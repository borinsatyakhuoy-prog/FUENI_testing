import { Page, expect } from '@playwright/test';
import { createTempMailAccount, loginTempMailAccount, waitForOtpCode, TempMailAccount } from './tempmail';

const FUENI_FROM_ADDRESS = 'noreply@fueni.com';

export interface FreshDoctor {
  account: TempMailAccount;
  password: string;
}

/**
 * Drives a brand-new doctor through Éligibilité -> Inscription -> email-OTP verification,
 * stopping right at Step 4 ("Choix du plan") without picking a plan. Confirmed live 2026-08-20:
 * France (+33) with a standard 9-digit mobile number is the one phone format that consistently
 * passes both client and server validation on this form - the form's own placeholder (a Cambodge
 * "77 123 45 67" example) is actually rejected server-side, and Bénin's own numbers were also
 * rejected client-side. Not one of the requested FUE-818 cases, but a real, separate friction
 * point in this same flow - see test-case/doctor/plan-selection-gate-fue-818/README.md.
 */
export async function registerFreshDoctorToPlanStep(page: Page): Promise<FreshDoctor> {
  const account = await createTempMailAccount();
  const password = 'PlanGate@2026!';

  await page.goto('/fr/register');
  await page.getByRole('combobox', { name: "Dans quel pays exercez-vous ?*" }).click();
  await page.getByRole('option', { name: 'Bénin' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  await page.getByRole('textbox', { name: 'Ex : Aboubacar' }).fill('Test');
  await page.getByRole('textbox', { name: 'Ex : Diallo' }).fill('Automation');
  await page.getByRole('button', { name: 'Sélectionner votre date de naissance' }).click();
  await page.getByRole('combobox', { name: 'Choose the Year' }).click();
  await page.getByRole('option', { name: '1990', exact: true }).click();
  await page.getByRole('button', { name: /^\S+ 15 \S+ 1990$/ }).click();

  await page.getByRole('combobox').filter({ hasText: 'Choisir...' }).click();
  await page.getByRole('option', { name: 'Féminin' }).click();

  await page.getByRole('textbox', { name: 'Ex : a.diallo@cabinet.com' }).fill(account.address);

  await page.getByRole('combobox', { name: /Pays : Cambodge/ }).click();
  await page.getByRole('option', { name: 'France +33' }).click();
  // A fixed number would collide ("Ce numéro de téléphone est déjà enregistré.") across the
  // multiple fresh accounts this spec file registers - each needs its own.
  await page.getByRole('textbox', { name: 'Numéro de téléphone (partie' }).fill(randomFrenchMobileNumber());

  await page.getByRole('textbox', { name: '••••••••••••' }).pressSequentially(password);
  await page.getByRole('checkbox', { name: "J'accepte les Conditions Géné" }).click();
  await page.getByRole('checkbox', { name: "J'accepte que mes données" }).click();
  await page.getByRole('button', { name: 'Créer mon compte professionnel' }).click();

  await expect(page.getByRole('heading', { name: 'Vérifiez votre adresse e-mail' })).toBeVisible();
  const code = await waitForOtpCode(account.token, FUENI_FROM_ADDRESS);
  await page.getByRole('textbox', { name: 'One-time passcode' }).fill(code);
  await page.getByRole('button', { name: 'Vérifier' }).click();

  await expect(page.getByRole('heading', { name: /Choisissez la formule/ })).toBeVisible();
  return { account, password };
}

function randomFrenchMobileNumber(): string {
  const rest = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  return `6${rest}`;
}

/** Logs an already-registered doctor in, including the mandatory email-OTP step. */
export async function loginDoctor(page: Page, doctor: FreshDoctor) {
  await page.goto('/fr/login');
  await page.getByRole('tab', { name: 'E-mail' }).click();
  await page.getByRole('textbox', { name: 'Identifiant' }).fill(doctor.account.address);
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill(doctor.password);
  await page.getByRole('button', { name: 'Connexion' }).click();

  await expect(page.getByRole('heading', { name: 'Vérification en deux étapes' })).toBeVisible();
  const token = await loginTempMailAccount(doctor.account.address, doctor.account.password);
  const code = await waitForOtpCode(token, FUENI_FROM_ADDRESS);
  await page.getByRole('textbox', { name: 'Code de vérification' }).fill(code);
  await page.getByRole('button', { name: 'Valider et accéder' }).click();
}
