import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { useTelemetry } from '@/hooks/useTelemetry';
import { FLAG_DEFINITIONS } from '@/lib/feature-flags';

/**
 * Small floating gear icon for toggling feature flags during development.
 * Only rendered in dev mode.
 */
export function DevFlagToggle() {
  const [open, setOpen] = useState(false);
  const { flags, toggleFlag } = useFeatureFlags();
  const { track } = useTelemetry();

  function handleToggle(key: string) {
    toggleFlag(key);
    track('feature_flag_toggled', { flag: key, newValue: !flags[key] });
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground hover:bg-muted/80 shadow-sm cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Feature flags"
        >
          <Settings className="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent align="end" side="top" className="w-72">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Feature Flags
          </p>
          <div className="flex flex-col gap-2.5">
            {FLAG_DEFINITIONS.map(({ key, description }) => (
              <label key={key} className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={flags[key] ?? false}
                  onCheckedChange={() => handleToggle(key)}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-foreground">{key}</span>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
