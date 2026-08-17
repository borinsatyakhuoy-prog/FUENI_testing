import { Page, Locator } from '@playwright/test';

/**
 * Opens the "Date de naissance" picker and picks the 1st of whichever month
 * it defaults to (confirmed live: exactly 18 years before today, with dates
 * from the 18th onward disabled) - the 1st is always safely before that
 * cutoff. Deliberately avoids driving the Year/Month selectors (confirmed
 * live to be custom Radix-style comboboxes, not navigable the way a plain
 * next/previous-month button would be) since that combination wasn't
 * actually verified interactively and caused a real timeout in practice -
 * see specs/planner/06-registration.md §6.1.
 */
export async function fillAdultDateOfBirth(page: Page) {
  await page.getByRole('button', { name: 'Sélectionner votre date de naissance' }).click();
  await page.getByRole('button', { name: /^\S+ 1 \S+ \d{4}$/ }).click();
}

/** Opens a custom listbox-style combobox (Sexe, Pays, Région, Ville) and picks an option. */
export async function selectListboxOption(page: Page, combobox: Locator, optionName: string) {
  await combobox.click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
}
