/**
 * Confirmed live 2026-08-20: the disposable inboxes used throughout this suite's doctor/admin
 * exploratory sessions (emalupe.com addresses) are backed by the public mail.tm API
 * (https://api.mail.tm) - `POST /accounts`, `POST /token`, `GET /messages` all respond exactly
 * per mail.tm's own API-Platform/Hydra shape. This means OTP retrieval can be fully scripted
 * from inside a Playwright test process, not just from an interactive MCP browser session -
 * unblocking real unattended automation of every doctor/admin flow gated by mandatory email-OTP.
 * See defects/improvement/test-account-provisioning.md for the before/after on this finding.
 */
const API_BASE = 'https://api.mail.tm';

export interface TempMailAccount {
  address: string;
  password: string;
  token: string;
}

export async function createTempMailAccount(): Promise<TempMailAccount> {
  const domainsRes = await fetch(`${API_BASE}/domains`);
  const domainsBody = await domainsRes.json();
  const domain = domainsBody['hydra:member'][0].domain;

  const address = `${randomLocalPart()}@${domain}`;
  const password = randomLocalPart();

  const createRes = await fetch(`${API_BASE}/accounts`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  if (!createRes.ok) {
    throw new Error(`mail.tm account creation failed: ${createRes.status} ${await createRes.text()}`);
  }

  const token = await loginTempMailAccount(address, password);
  return { address, password, token };
}

export async function loginTempMailAccount(address: string, password: string): Promise<string> {
  const tokenRes = await fetch(`${API_BASE}/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  if (!tokenRes.ok) {
    throw new Error(`mail.tm login failed: ${tokenRes.status} ${await tokenRes.text()}`);
  }
  const body = await tokenRes.json();
  return body.token;
}

/**
 * Polls the inbox until a message from `fromAddress` arrives, then extracts the first
 * standalone 6-digit code from its plaintext body. FUENI's OTP emails are sent within a few
 * seconds in practice; the timeout is generous to absorb CI/network jitter.
 */
export async function waitForOtpCode(
  token: string,
  fromAddress: string,
  { timeoutMs = 30_000, pollIntervalMs = 2_000 } = {}
): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    const messages: Array<{ id: string; from: { address: string } }> = body['hydra:member'] ?? [];
    const match = messages.find((m) => m.from.address === fromAddress);
    if (match) {
      const messageRes = await fetch(`${API_BASE}/messages/${match.id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const message = await messageRes.json();
      const codeMatch = (message.text as string ?? '').match(/\b(\d{6})\b/);
      if (codeMatch) return codeMatch[1];
      throw new Error(`Found a message from ${fromAddress} but no 6-digit code in its body.`);
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error(`No message from ${fromAddress} arrived within ${timeoutMs}ms.`);
}

function randomLocalPart(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
