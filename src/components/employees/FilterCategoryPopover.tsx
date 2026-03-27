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

const CATEGORIES: { key: FilterCategory; label: string; }[] = [
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
      <PopoverTrigger className="flex h-8 items-center gap-1 rounded border border-[#dadff1] px-3 py-1.5 text-sm font-medium text-[#072E45] hover:bg-muted cursor-pointer">
        <Plus className="h-4 w-4" />
        Add Filter
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 px-[0] py-[0]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground pl-[16px] pt-[16px]">
          Filter by
        </p>
        <div className="flex flex-col gap-2.5 p-[16px] pb-[0] pt-[6px]">
          {CATEGORIES.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={selected.has(key)} onCheckedChange={() => toggleCategory(key)} />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 px-[16px] py-[8px] border-t border-solid border-[#DADFF1]">
          <Button size="sm" onClick={handleApply} className="px-[12px] py-[6px] height-[32px] bg-[#023D67] rounded-[4px]">
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={() => setOpen(false)} className="px-[12px] py-[6px] height-[32px] rounded-[4px]">
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
