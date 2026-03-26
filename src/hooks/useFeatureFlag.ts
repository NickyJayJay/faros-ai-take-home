import { useFeatureFlags } from '@/contexts/FeatureFlagContext'

/**
 * Convenience hook to read a single feature flag by key.
 */
export function useFeatureFlag(key: string): boolean {
  const { getFlag } = useFeatureFlags()
  return getFlag(key)
}
