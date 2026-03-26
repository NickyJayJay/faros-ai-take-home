/**
 * Feature flag definitions with localStorage persistence.
 *
 * In production this would be backed by a service like LaunchDarkly.
 * For this exercise, localStorage gives us "no redeploy" toggling.
 */

export interface FeatureFlagDefinition {
  key: string
  description: string
  defaultValue: boolean
}

export const FLAG_DEFINITIONS: FeatureFlagDefinition[] = [
  {
    key: 'AI_INSIGHTS_ENABLED',
    description: 'Show AI-generated employee insights in the detail panel',
    defaultValue: true,
  },
]

const STORAGE_PREFIX = 'ff_'

export function readFlag(key: string): boolean {
  const def = FLAG_DEFINITIONS.find((f) => f.key === key)
  const defaultValue = def?.defaultValue ?? false

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (stored === null) return defaultValue
    return stored === 'true'
  } catch {
    return defaultValue
  }
}

export function writeFlag(key: string, value: boolean): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, String(value))
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}
