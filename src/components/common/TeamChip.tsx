import { cn } from '@/lib/utils';

interface TeamChipProps {
  name: string;
  uid: string;
}

const TEAM_COLORS: Record<string, string> = {
  frontend: 'bg-sky-100 text-sky-800 border-sky-200',
  backend: 'bg-sky-100 text-sky-800 border-sky-200',
  'data-platform': 'bg-rose-50 text-rose-700 border-rose-200',
};

const DEFAULT_COLOR = 'bg-teal-50 text-teal-700 border-teal-200';

export function TeamChip({ name, uid }: TeamChipProps) {
  const colorClass = TEAM_COLORS[uid] ?? DEFAULT_COLOR;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border',
        colorClass
      )}
    >
      {name.toLowerCase().replace(/\s+/g, '-') === uid ? uid : name.toLowerCase()}
    </span>
  );
}
