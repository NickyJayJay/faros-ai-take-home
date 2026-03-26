import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConsent } from '@/contexts/ConsentContext'

export function ConsentPrompt() {
  const { grantConsent } = useConsent()
  const [granting, setGranting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleEnable() {
    setGranting(true)
    setError(null)
    try {
      await grantConsent()
    } catch {
      setError('Failed to enable AI insights. Please try again.')
    } finally {
      setGranting(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground">AI Insights</h4>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Get AI-generated insights about this employee's recent activity,
            collaboration patterns, and contributions. Data is processed
            securely and insights are generated on-demand.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" onClick={handleEnable} disabled={granting}>
              {granting ? 'Enabling...' : 'Enable AI Insights'}
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
