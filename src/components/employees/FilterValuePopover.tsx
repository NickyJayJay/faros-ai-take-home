import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Popover } from '@/components/common/Popover'

interface FilterValuePopoverProps {
  open: boolean
  onClose: () => void
  options: { value: string; label: string }[]
  selectedValues: string[]
  onApply: (values: string[]) => void
  searchPlaceholder?: string
}

export function FilterValuePopover({
  open,
  onClose,
  options,
  selectedValues,
  onApply,
  searchPlaceholder = 'Search...',
}: FilterValuePopoverProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedValues))

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const term = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(term))
  }, [options, search])

  const allFilteredSelected = filteredOptions.length > 0 && filteredOptions.every((o) => selected.has(o.value))

  function toggleValue(value: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  function handleToggleAll() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        for (const o of filteredOptions) next.delete(o.value)
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        for (const o of filteredOptions) next.add(o.value)
        return next
      })
    }
  }

  function handleApply() {
    onApply([...selected])
    onClose()
  }

  function handleCancel() {
    setSelected(new Set(selectedValues))
    setSearch('')
    onClose()
  }

  return (
    <Popover open={open} onClose={handleCancel}>
      <div className="p-3">
        {/* Search input */}
        <div className="mb-2 flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Select all / Deselect all */}
        <button
          onClick={handleToggleAll}
          className="mb-2 text-xs font-medium text-teal-600 hover:text-teal-700"
        >
          {allFilteredSelected ? 'Deselect all' : 'Select all'}
        </button>

        {/* Checkbox list */}
        <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
          {filteredOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(value)}
                onChange={() => toggleValue(value)}
                className="h-4 w-4 rounded border-border text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
          {filteredOptions.length === 0 && (
            <p className="py-2 text-xs text-muted-foreground text-center">No results</p>
          )}
        </div>

        {/* Actions */}
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
