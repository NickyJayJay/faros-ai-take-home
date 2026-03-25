import { Search } from 'lucide-react'

interface EmployeeSearchProps {
  value: string
  onChange: (value: string) => void
}

export function EmployeeSearch({ value, onChange }: EmployeeSearchProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search employees by name ..."
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
    </div>
  )
}
