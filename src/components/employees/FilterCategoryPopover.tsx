import { useState } from 'react'
import { Popover } from '@/components/common/Popover'

export type FilterCategory = 'accountTypes' | 'teams' | 'trackingStatuses'

interface FilterCategoryPopoverProps {
  open: boolean
  onClose: () => void
  activeCategories: FilterCategory[]
  onApply: (categories: FilterCategory[]) => void
}

const CATEGORIES: { key: FilterCategory; label: string }[] = [
  { key: 'accountTypes', label: 'Accounts Connected' },
  { key: 'teams', label: 'Team' },
  { key: 'trackingStatuses', label: 'Tracking Status' },
]

export function FilterCategoryPopover({
  open,
  onClose,
  activeCategories,
  onApply,
}: FilterCategoryPopoverProps) {
  const [selected, setSelected] = useState<Set<FilterCategory>>(
    new Set(activeCategories)
  )

  function toggleCategory(key: FilterCategory) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleApply() {
    onApply([...selected])
    onClose()
  }

  function handleCancel() {
    setSelected(new Set(activeCategories))
    onClose()
  }

  return (
    <Popover open={open} onClose={handleCancel}>
      <div className="p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filter by
        </p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(key)}
                onChange={() => toggleCategory(key)}
                className="h-4 w-4 rounded border-border text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleApply}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Apply
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    </Popover>
  )
}
