import { useQuery } from '@apollo/client/react'
import { X, ExternalLink, ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { GET_EMPLOYEE } from '@/graphql/queries'
import type { GetEmployeeData, GetEmployeeVars } from '@/types'
import { cn } from '@/lib/utils'

interface EmployeeDetailPanelProps {
  employeeId: string
  onClose: () => void
}

export function EmployeeDetailPanel({ employeeId, onClose }: EmployeeDetailPanelProps) {
  const { data, loading, error } = useQuery<GetEmployeeData, GetEmployeeVars>(
    GET_EMPLOYEE,
    { variables: { id: employeeId } }
  )

  const employee = data?.employee

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col border-l border-border bg-white shadow-lg">
        {loading && (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading employee...
          </div>
        )}

        {error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
            <p className="text-sm text-destructive">Failed to load employee details.</p>
            <button
              onClick={onClose}
              className="text-sm text-primary hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {employee && (
          <>
            {/* Header */}
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {employee.name ?? employee.uid}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    aria-label="Open external"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    aria-label="Close panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-3">
                <StatusPill
                  trackingStatus={employee.trackingStatus}
                  trackingCategory={employee.trackingCategory}
                />
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ProfileInfoSection employee={employee} />

              {/* AI Insights placeholder — Step 9 */}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-3 flex items-center gap-2">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Save
              </button>
              <button
                onClick={onClose}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function StatusPill({
  trackingStatus,
  trackingCategory,
}: {
  trackingStatus: string | null
  trackingCategory: string | null
}) {
  const isIncluded = trackingStatus === 'Included'
  const isActive = trackingCategory === 'Active'

  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        isIncluded && isActive
          ? 'bg-green-50 text-green-700 border border-green-200'
          : isIncluded
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-gray-100 text-gray-600 border border-gray-200'
      )}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" fill="currentColor" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="currentColor" />
      </svg>
      {trackingStatus ?? 'Unknown'}
      {isIncluded && trackingCategory ? ` - ${trackingCategory}` : ''}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  )
}

function ProfileInfoSection({
  employee,
}: {
  employee: NonNullable<GetEmployeeData['employee']>
}) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-1.5 py-2 text-sm font-semibold text-foreground"
      >
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        Profile Info
      </button>

      {open && (
        <div className="flex flex-col gap-4 pb-4">
          <ReadOnlyField label="UID" value={employee.uid} />
          <PlaceholderField label="Title" />
          <ReadOnlyField label="Name" value={employee.name ?? employee.uid} />
          <ReadOnlyField label="Email" value={employee.email ?? ''} />
          <PlaceholderField label="Role" />
          <PlaceholderField label="Location" />
          <PlaceholderField label="Level" />
          <PlaceholderField label="Employment Type" />
        </div>
      )}
    </div>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
        {value}
      </div>
    </div>
  )
}

function PlaceholderField({ label }: { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
        <Plus className="h-3.5 w-3.5" />
        Add {label}
      </button>
    </div>
  )
}
