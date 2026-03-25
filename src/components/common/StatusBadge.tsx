import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  trackingStatus: string | null
  trackingCategory: string | null
}

export function StatusBadge({ trackingStatus, trackingCategory }: StatusBadgeProps) {
  const isIncluded = trackingStatus === 'Included'
  const isActive = trackingCategory === 'Active'

  return (
    <div className="flex items-center gap-2">
      <PersonIcon status={isIncluded ? (isActive ? 'active' : 'inactive') : 'ignored'} />
      <div className="flex flex-col">
        <span className="text-sm text-foreground">{trackingStatus ?? 'Unknown'}</span>
        {isIncluded && (
          <span
            className={cn(
              'text-xs font-medium',
              isActive ? 'text-green-600' : 'text-red-500'
            )}
          >
            {trackingCategory}
          </span>
        )}
      </div>
    </div>
  )
}

function PersonIcon({ status }: { status: 'active' | 'inactive' | 'ignored' }) {
  if (status === 'active') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="7" r="3" fill="#16a34a" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="#16a34a" />
      </svg>
    )
  }
  if (status === 'inactive') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="7" r="2.5" stroke="#ef4444" strokeWidth="1.5" fill="none" />
        <path d="M4.5 17c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="#ef4444" strokeWidth="1.5" fill="none" />
      </svg>
    )
  }
  // ignored
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="7" r="3" fill="#9ca3af" />
      <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="#9ca3af" />
    </svg>
  )
}
