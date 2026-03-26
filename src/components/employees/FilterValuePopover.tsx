import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterValuePopoverProps {
  triggerContent: React.ReactNode;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onApply: (values: string[]) => void;
  searchPlaceholder?: string;
}

export function FilterValuePopover({
  triggerContent,
  options,
  selectedValues,
  onApply,
  searchPlaceholder = 'Search...',
}: FilterValuePopoverProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedValues));

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setSelected(new Set(selectedValues));
      setSearch('');
    }
    setOpen(nextOpen);
  }

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const term = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(term));
  }, [options, search]);

  const allFilteredSelected =
    filteredOptions.length > 0 && filteredOptions.every((o) => selected.has(o.value));

  function toggleValue(value: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function handleToggleAll() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const o of filteredOptions) next.delete(o.value);
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const o of filteredOptions) next.add(o.value);
        return next;
      });
    }
  }

  function handleApply() {
    onApply([...selected]);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={triggerContent as React.ReactElement} />
      <PopoverContent align="start" className="w-64">
        {/* Search input */}
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-7 h-7 text-sm"
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
        <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
          {filteredOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={selected.has(value)} onCheckedChange={() => toggleValue(value)} />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
          {filteredOptions.length === 0 && (
            <p className="py-2 text-xs text-muted-foreground text-center">No results</p>
          )}
        </div>

        {/* Actions */}
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
