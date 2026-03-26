import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  fetchConsentToken,
  hasValidConsent,
  clearConsent as clearConsentToken,
} from '@/lib/consent'

interface ConsentContextValue {
  /** Whether the user has granted AI consent in this session */
  consented: boolean
  /** Grant consent — fetches a token from the server */
  grantConsent: () => Promise<void>
  /** Revoke consent */
  revokeConsent: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

const USER_ID = 'current-user'

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consented, setConsented] = useState(() => hasValidConsent())

  const grantConsent = useCallback(async () => {
    await fetchConsentToken(USER_ID, 'insights')
    setConsented(true)
  }, [])

  const revokeConsent = useCallback(() => {
    clearConsentToken()
    setConsented(false)
  }, [])

  return (
    <ConsentContext.Provider value={{ consented, grantConsent, revokeConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used within a ConsentProvider')
  return ctx
}
