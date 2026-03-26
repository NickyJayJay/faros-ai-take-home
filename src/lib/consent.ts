/**
 * Consent token management for AI insights.
 *
 * Tokens are stored in memory only (not localStorage) — they are session-scoped
 * and expire after 1 hour. The module handles fetching, caching, validation,
 * and auto-renewal.
 */

import type { ConsentTokenResponse } from '@/types';

const API_BASE = 'http://localhost:4000/api/ai';

// Buffer before expiry to trigger renewal (5 minutes)
const RENEWAL_BUFFER_MS = 5 * 60 * 1000;

let cachedToken: string | null = null;
let cachedExpiresAt: Date | null = null;
let renewalTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Fetch a new consent token from the server.
 */
export async function fetchConsentToken(
  userId: string,
  scope: string = 'insights'
): Promise<ConsentTokenResponse> {
  const res = await fetch(`${API_BASE}/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, scope }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Consent request failed (${res.status})`);
  }

  const data: ConsentTokenResponse = await res.json();

  // Cache token
  cachedToken = data.consentToken;
  cachedExpiresAt = new Date(data.expiresAt);

  // Schedule auto-renewal
  scheduleRenewal(userId, scope);

  return data;
}

/**
 * Returns the current valid consent token, or null if none/expired.
 */
export function getConsentToken(): string | null {
  if (!cachedToken || !cachedExpiresAt) return null;
  if (new Date() >= cachedExpiresAt) {
    clearConsent();
    return null;
  }
  return cachedToken;
}

/**
 * Whether we have a valid (non-expired) consent token.
 */
export function hasValidConsent(): boolean {
  return getConsentToken() !== null;
}

/**
 * Clear stored consent (e.g. on logout or explicit revocation).
 */
export function clearConsent(): void {
  cachedToken = null;
  cachedExpiresAt = null;
  if (renewalTimer) {
    clearTimeout(renewalTimer);
    renewalTimer = null;
  }
}

/**
 * Schedule automatic token renewal before expiry.
 */
function scheduleRenewal(userId: string, scope: string): void {
  if (renewalTimer) clearTimeout(renewalTimer);
  if (!cachedExpiresAt) return;

  const msUntilExpiry = cachedExpiresAt.getTime() - Date.now();
  const renewIn = Math.max(msUntilExpiry - RENEWAL_BUFFER_MS, 0);

  renewalTimer = setTimeout(async () => {
    try {
      await fetchConsentToken(userId, scope);
    } catch {
      // Renewal failed silently — the next insight fetch will detect the
      // expired token and re-prompt for consent.
      clearConsent();
    }
  }, renewIn);
}
