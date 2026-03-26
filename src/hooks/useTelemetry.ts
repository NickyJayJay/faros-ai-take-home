import { useCallback } from 'react'
import { trackEvent } from '@/lib/telemetry-client'

/**
 * Hook providing a stable `track` function for emitting telemetry events.
 *
 * IMPORTANT: Never pass PII (names, emails, search text) as properties.
 * Only pass aggregate/anonymous values like counts, IDs, and categories.
 */
export function useTelemetry() {
  const track = useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      trackEvent(event, properties)
    },
    []
  )

  return { track }
}
