import { ChevronRight, Settings } from 'lucide-react'

export function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="hover:text-foreground cursor-pointer">Admin Settings</span>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="hover:text-foreground cursor-pointer">Organization Setup</span>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-foreground font-medium">Employees Page</span>
      <Settings className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    </nav>
  )
}
