import { useState, useEffect, useCallback, useRef } from 'react'
import { getConsentToken, clearConsent } from '@/lib/consent'
import { filterPII, type PIIFilterResult } from '@/lib/pii-filter'
import { useConsent } from '@/contexts/ConsentContext'
import type { AIInsightResponse } from '@/types'

const API_BASE = 'http://localhost:4000/api/ai'
const CLIENT_TIMEOUT_MS = 8_000

export type InsightError =
  | { type: 'rate_limit'; retryAfter: number; message: string }
  | { type: 'timeout'; message: string }
  | { type: 'consent_expired'; message: string }
  | { type: 'network'; message: string }

export interface AIInsightState {
  /** The sanitized insight (PII filtered) */
  insight: (AIInsightResponse & { filteredSummary: string }) | null
  /** Whether PII was detected and redacted */
  piiResult: PIIFilterResult | null
  loading: boolean
  error: InsightError | null
  /** Retry fetching the insight */
  retry: () => void
}

export function useAIInsights(employeeId: string): AIInsightState {
  const { consented } = useConsent()
  const [insight, setInsight] = useState<
    (AIInsightResponse & { filteredSummary: string }) | null
  >(null)
  const [piiResult, setPiiResult] = useState<PIIFilterResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<InsightError | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchInsight = useCallback(async () => {
    const token = getConsentToken()
    if (!token) {
      // Token expired between consent grant and fetch
      clearConsent()
      setError({ type: 'consent_expired', message: 'Consent token expired. Please re-enable AI insights.' })
      return
    }

    // Cancel any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    // Client-side timeout
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS)

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/insights/${employeeId}`, {
        headers: { 'X-Consent-Token': token },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (res.status === 429) {
        const body = await res.json().catch(() => ({}))
        setError({
          type: 'rate_limit',
          retryAfter: body.retryAfter ?? 60,
          message: body.message ?? 'Rate limit exceeded. Please try again later.',
        })
        return
      }

      if (res.status === 401 || res.status === 403) {
        // Token invalid or expired — clear and signal re-consent
        clearConsent()
        setError({
          type: 'consent_expired',
          message: 'Consent token expired. Please re-enable AI insights.',
        })
        return
      }

      if (res.status === 504) {
        setError({
          type: 'timeout',
          message: 'Insight generation timed out. Please try again.',
        })
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError({
          type: 'network',
          message: body.message ?? `Unexpected error (${res.status})`,
        })
        return
      }

      const data: AIInsightResponse = await res.json()

      // Apply PII filter before exposing to UI
      const filtered = filterPII(data.summary)
      setPiiResult(filtered)
      setInsight({ ...data, filteredSummary: filtered.text })
    } catch (err: unknown) {
      clearTimeout(timeoutId)

      if (err instanceof DOMException && err.name === 'AbortError') {
        // Could be our client-side timeout or a component unmount
        if (!controller.signal.reason) {
          setError({
            type: 'timeout',
            message: 'Insight generation timed out. Please try again.',
          })
        }
        // If unmount, don't set state (component is gone)
        return
      }

      setError({
        type: 'network',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }, [employeeId])

  // Fetch on mount when consented
  useEffect(() => {
    if (consented) {
      fetchInsight()
    }

    return () => {
      abortRef.current?.abort()
    }
  }, [consented, fetchInsight])

  return {
    insight,
    piiResult,
    loading,
    error,
    retry: fetchInsight,
  }
}
