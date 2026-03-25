import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'

interface PaginationProps {
  pageSize: number
  currentStart: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onNextPage: () => void
  onPreviousPage: () => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [5, 10, 20]

export function Pagination({
  pageSize,
  currentStart,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
}: PaginationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setDropdownOpen(false))

  const currentEnd = Math.min(currentStart + pageSize - 1, totalCount)
  const rangeLabel = totalCount > 0 ? `${currentStart}-${currentEnd}` : '0-0'

  return (
    <div className="flex items-center justify-end gap-3 px-4 py-3">
      {/* Page size selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-sm text-foreground hover:bg-muted"
        >
          {rangeLabel}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {dropdownOpen && (
          <div className="absolute bottom-full right-0 z-50 mb-1 min-w-[80px] rounded-md border border-border bg-white shadow-lg">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => {
                  onPageSizeChange(size)
                  setDropdownOpen(false)
                }}
                className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-muted ${
                  size === pageSize ? 'font-medium text-primary' : 'text-foreground'
                }`}
              >
                {size} per page
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Total count */}
      <span className="text-sm text-muted-foreground">of {totalCount}</span>

      {/* Previous / Next arrows */}
      <button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
