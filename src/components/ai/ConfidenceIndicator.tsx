import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  confidence: number;
}

function getConfidenceLevel(confidence: number) {
  if (confidence >= 0.7)
    return {
      label: 'High',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    };
  if (confidence >= 0.3)
    return {
      label: 'Medium',
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
    };
  return { label: 'Low', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' };
}

export function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const { label, color, textColor, bgColor } = getConfidenceLevel(confidence);
  const pct = Math.round(confidence * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
          bgColor,
          textColor
        )}
      >
        {label} ({pct}%)
      </span>
    </div>
  );
}
