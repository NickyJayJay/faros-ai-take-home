import { useState } from 'react'
import { RefreshCw, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { useTelemetry } from '@/hooks/useTelemetry'
import type { AIInsightResponse } from '@/types'

interface InsightCardProps {
  insight: AIInsightResponse & { filteredSummary: string }
  piiRedacted: boolean
  onRegenerate: () => void
}

export function InsightCard({ insight, piiRedacted, onRegenerate }: InsightCardProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const { track } = useTelemetry()

  function handleFeedback(value: 'up' | 'down') {
    setFeedback(value)
    track('ai_insight_feedback', {
      employeeId: insight.employeeId,
      feedback: value,
    })
  }
  const isLowConfidence = insight.confidence < 0.3

  return (
    <div className="space-y-3">
      {/* Low confidence warning */}
      {isLowConfidence && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Low confidence — this insight may not be reliable. Consider verifying
            with other data sources.
          </p>
        </div>
      )}

      {/* Summary text */}
      <div className={isLowConfidence ? 'opacity-70' : undefined}>
        <p className="text-sm text-foreground leading-relaxed">
          {insight.filteredSummary}
        </p>
      </div>

      {/* PII redaction notice */}
      {piiRedacted && (
        <p className="text-xs text-muted-foreground italic">
          Some personally identifiable information was automatically redacted from this insight.
        </p>
      )}

      {/* Confidence + metadata */}
      <div className="flex items-center justify-between">
        <ConfidenceIndicator confidence={insight.confidence} />
        <span className="text-xs text-muted-foreground">
          {new Date(insight.generatedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        {/* Feedback */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleFeedback('up')}
            aria-label="Helpful"
            className={feedback === 'up' ? 'text-green-600' : 'text-muted-foreground'}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleFeedback('down')}
            aria-label="Not helpful"
            className={feedback === 'down' ? 'text-red-600' : 'text-muted-foreground'}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Regenerate */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          className="text-muted-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Regenerate
        </Button>
      </div>
    </div>
  )
}
