import { useState, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import { FilterCategoryPopover, type FilterCategory } from './FilterCategoryPopover'
import { FilterValuePopover } from './FilterValuePopover'
import { useFilterOptions } from '@/hooks/useFilterOptions'
import type { EmployeeFilter } from '@/types'

interface FilterBarProps {
  filter: EmployeeFilter
  onFilterChange: (filter: EmployeeFilter) => void
}

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  teams: 'Team',
  trackingStatuses: 'Tracking Status',
  accountTypes: 'Accounts Connected',
}

const SEARCH_PLACEHOLDERS: Record<FilterCategory, string> = {
  teams: 'Search team name...',
  trackingStatuses: 'Search status...',
  accountTypes: 'Search account type...',
}

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const { filterOptions } = useFilterOptions()
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false)
  const [openValuePopover, setOpenValuePopover] = useState<FilterCategory | null>(null)

  const activeCategories = getActiveCategories(filter)

  function getActiveCategories(f: EmployeeFilter): FilterCategory[] {
    const cats: FilterCategory[] = []
    if (f.teams) cats.push('teams')
    if (f.trackingStatuses) cats.push('trackingStatuses')
    if (f.accountTypes) cats.push('accountTypes')
    return cats
  }

  function getOptionsForCategory(category: FilterCategory): { value: string; label: string }[] {
    if (!filterOptions) return []
    switch (category) {
      case 'teams':
        return filterOptions.teams.map((t) => ({ value: t.uid, label: t.name }))
      case 'trackingStatuses':
        return filterOptions.trackingStatuses.map((s) => ({ value: s, label: s }))
      case 'accountTypes':
        return filterOptions.accountTypes.map((a) => ({ value: a.type, label: a.source }))
    }
  }

  function getSelectedValues(category: FilterCategory): string[] {
    return filter[category] ?? []
  }

  function getChipLabel(category: FilterCategory): string {
    const values = filter[category]
    const options = getOptionsForCategory(category)
    if (!values || values.length === 0 || values.length === options.length) {
      return `${CATEGORY_LABELS[category]}: All`
    }
    if (values.length === 1) {
      const opt = options.find((o) => o.value === values[0])
      return `${CATEGORY_LABELS[category]}: ${opt?.label ?? values[0]}`
    }
    return `${CATEGORY_LABELS[category]}: ${values.length} selected`
  }

  const handleCategoryApply = useCallback(
    (categories: FilterCategory[]) => {
      const next: EmployeeFilter = {}
      for (const cat of categories) {
        // Preserve existing selections, or default to all values (= no filter restriction)
        next[cat] = filter[cat] ?? []
      }
      onFilterChange(next)
    },
    [filter, onFilterChange]
  )

  function handleValueApply(category: FilterCategory, values: string[]) {
    onFilterChange({ ...filter, [category]: values })
    setOpenValuePopover(null)
  }

  function removeFilter(category: FilterCategory) {
    const next = { ...filter }
    delete next[category]
    onFilterChange(next)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* + Add Filter button */}
      <div className="relative">
        <button
          onClick={() => setCategoryPopoverOpen((prev) => !prev)}
          className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Filter
        </button>
        <FilterCategoryPopover
          open={categoryPopoverOpen}
          onClose={() => setCategoryPopoverOpen(false)}
          activeCategories={activeCategories}
          onApply={handleCategoryApply}
        />
      </div>

      {/* Active filter chips */}
      {activeCategories.map((category) => (
        <div key={category} className="relative">
          <button
            onClick={() =>
              setOpenValuePopover((prev) => (prev === category ? null : category))
            }
            className="flex items-center gap-1.5 rounded-md bg-teal-50 border border-teal-200 px-2.5 py-1 text-sm font-medium text-teal-700 hover:bg-teal-100"
          >
            {getChipLabel(category)}
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation()
                removeFilter(category)
              }}
              className="ml-0.5 rounded-sm hover:bg-teal-200 p-0.5"
            >
              <X className="h-3 w-3" />
            </span>
          </button>
          <FilterValuePopover
            open={openValuePopover === category}
            onClose={() => setOpenValuePopover(null)}
            options={getOptionsForCategory(category)}
            selectedValues={getSelectedValues(category)}
            onApply={(values) => handleValueApply(category, values)}
            searchPlaceholder={SEARCH_PLACEHOLDERS[category]}
          />
        </div>
      ))}
    </div>
  )
}
