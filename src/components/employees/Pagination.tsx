import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PaginationProps {
  pageSize: number;
  currentStart: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20];

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentEnd = Math.min(currentStart + pageSize - 1, totalCount);
  const rangeLabel = totalCount > 0 ? `${currentStart}-${currentEnd}` : '0-0';

  return (
    <div className="flex items-center justify-end gap-3 border-t border-border px-4 py-3">
      {/* Page size selector */}
      <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <PopoverTrigger className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-sm text-foreground hover:bg-muted cursor-pointer">
          {rangeLabel}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto min-w-[120px] p-1">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => {
                onPageSizeChange(size);
                setDropdownOpen(false);
              }}
              className={`block w-full rounded-sm px-3 py-1.5 text-left text-sm hover:bg-muted ${
                size === pageSize ? 'font-medium text-primary' : 'text-foreground'
              }`}
            >
              {size} per page
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Total count */}
      <span className="text-sm text-muted-foreground">of {totalCount}</span>

      {/* Previous / Next arrows */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={onNextPage}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
