import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { fetchConsentToken, getConsentToken, hasValidConsent, clearConsent } from '../consent'

describe('consent', () => {
  beforeEach(() => {
    clearConsent()
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getConsentToken', () => {
    it('returns null when no token exists', () => {
      expect(getConsentToken()).toBeNull()
    })

    it('returns null when hasValidConsent is false', () => {
      expect(hasValidConsent()).toBe(false)
    })
  })

  describe('fetchConsentToken', () => {
    it('stores token on successful fetch', async () => {
      const mockResponse = {
        consentToken: 'test-token-123',
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
        scope: 'insights',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await fetchConsentToken('user-1', 'insights')
      expect(result.consentToken).toBe('test-token-123')
      expect(getConsentToken()).toBe('test-token-123')
      expect(hasValidConsent()).toBe(true)
    })

    it('throws on failed fetch', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Bad request' }),
      })

      await expect(fetchConsentToken('user-1')).rejects.toThrow('Bad request')
      expect(getConsentToken()).toBeNull()
    })
  })

  describe('clearConsent', () => {
    it('clears stored token', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            consentToken: 'token',
            expiresAt: new Date(Date.now() + 3600_000).toISOString(),
            scope: 'insights',
          }),
      })

      await fetchConsentToken('user-1')
      expect(hasValidConsent()).toBe(true)

      clearConsent()
      expect(getConsentToken()).toBeNull()
      expect(hasValidConsent()).toBe(false)
    })
  })

  describe('token expiry', () => {
    it('returns null for expired token', async () => {
      // Token that expires in 1 second
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            consentToken: 'short-lived',
            expiresAt: new Date(Date.now() + 1000).toISOString(),
            scope: 'insights',
          }),
      })

      await fetchConsentToken('user-1')
      expect(getConsentToken()).toBe('short-lived')

      // Advance past expiry
      vi.advanceTimersByTime(2000)
      expect(getConsentToken()).toBeNull()
    })
  })
})
