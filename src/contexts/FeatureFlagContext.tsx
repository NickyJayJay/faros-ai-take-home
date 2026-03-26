import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { FLAG_DEFINITIONS, readFlag, writeFlag } from '@/lib/feature-flags'

type FlagMap = Record<string, boolean>

interface FeatureFlagContextValue {
  flags: FlagMap
  getFlag: (key: string) => boolean
  setFlag: (key: string, value: boolean) => void
  toggleFlag: (key: string) => void
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null)

function initFlags(): FlagMap {
  const map: FlagMap = {}
  for (const def of FLAG_DEFINITIONS) {
    map[def.key] = readFlag(def.key)
  }
  return map
}

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FlagMap>(initFlags)

  const getFlag = useCallback(
    (key: string) => flags[key] ?? false,
    [flags]
  )

  const setFlagValue = useCallback((key: string, value: boolean) => {
    writeFlag(key, value)
    setFlags((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleFlag = useCallback((key: string) => {
    setFlags((prev) => {
      const next = !prev[key]
      writeFlag(key, next)
      return { ...prev, [key]: next }
    })
  }, [])

  return (
    <FeatureFlagContext.Provider
      value={{ flags, getFlag, setFlag: setFlagValue, toggleFlag }}
    >
      {children}
    </FeatureFlagContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFeatureFlags(): FeatureFlagContextValue {
  const ctx = useContext(FeatureFlagContext)
  if (!ctx) throw new Error('useFeatureFlags must be used within a FeatureFlagProvider')
  return ctx
}
