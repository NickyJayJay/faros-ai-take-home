import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export type FilterCategory = 'accountTypes' | 'teams' | 'trackingStatuses';

interface FilterCategoryPopoverProps {
  activeCategories: FilterCategory[];
  onApply: (categories: FilterCategory[]) => void;
}

const CATEGORIES: { key: FilterCategory; label: string }[] = [
  { key: 'accountTypes', label: 'Accounts Connected' },
  { key: 'teams', label: 'Team' },
  { key: 'trackingStatuses', label: 'Tracking Status' },
];

export function FilterCategoryPopover({ activeCategories, onApply }: FilterCategoryPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<FilterCategory>>(new Set(activeCategories));

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setSelected(new Set(activeCategories));
    }
    setOpen(nextOpen);
  }

  function toggleCategory(key: FilterCategory) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleApply() {
    onApply([...selected]);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 cursor-pointer">
        <Plus className="h-4 w-4" />
        Add Filter
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filter by
        </p>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={selected.has(key)} onCheckedChange={() => toggleCategory(key)} />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
