import { useState, useEffect } from 'react'
import { ChevronDown, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useConsent } from '@/contexts/ConsentContext'
import { useAIInsights, type InsightError } from '@/hooks/useAIInsights'
import { ConsentPrompt } from './ConsentPrompt'
import { InsightCard } from './InsightCard'

interface AIInsightsSectionProps {
  employeeId: string
}

export function AIInsightsSection({ employeeId }: AIInsightsSectionProps) {
  const { consented } = useConsent()
  const { insight, piiResult, loading, error, retry } = useAIInsights(employeeId)

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 py-2 text-sm font-semibold text-foreground [&[data-open]>svg:first-child]:rotate-90">
        <ChevronDown className="h-4 w-4 -rotate-90 transition-transform" />
        <Sparkles className="h-4 w-4 text-teal-600" />
        AI Insights
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="pb-4">
          {!consented && <ConsentPrompt />}

          {consented && (loading || (!insight && !error)) && <InsightSkeleton />}

          {consented && !loading && error && <InsightError error={error} onRetry={retry} />}

          {consented && !loading && insight && !error && (
            <InsightCard
              insight={insight}
              piiRedacted={piiResult?.piiDetected ?? false}
              onRegenerate={retry}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function InsightSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-1.5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  )
}

function InsightError({
  error,
  onRetry,
}: {
  error: InsightError
  onRetry: () => void
}) {
  // Rate limit with countdown
  if (error.type === 'rate_limit') {
    return <RateLimitMessage retryAfter={error.retryAfter} onRetry={onRetry} />
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <p className="text-sm text-destructive">{error.message}</p>
      {error.type !== 'consent_expired' && (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Try Again
        </Button>
      )}
    </div>
  )
}

function RateLimitMessage({
  retryAfter,
  onRetry,
}: {
  retryAfter: number
  onRetry: () => void
}) {
  const [seconds, setSeconds] = useState(retryAfter)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [seconds])

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-700">
        AI insights are temporarily unavailable.
        {seconds > 0
          ? ` Please try again in ${seconds}s.`
          : ' You can try again now.'}
      </p>
      {seconds <= 0 && (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Try Again
        </Button>
      )}
    </div>
  )
}
