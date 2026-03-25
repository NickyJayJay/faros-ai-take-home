import { ChevronDown, Home, RefreshCw, Heart } from 'lucide-react'
import farosLogo from '@/assets/faros-logo.svg'

export function Header() {
  return (
    <header className="flex h-14 items-center border-b border-border bg-white px-4">
      {/* Left section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <img src={farosLogo} alt="Faros AI" className="h-6 w-6" />
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          Default Workspace
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
        <nav className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm font-medium text-foreground">
            Modules
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-medium text-foreground">Scorecard</span>
        </nav>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Personal:</span>
          <div className="flex items-center gap-1">
            <IconButton><Home className="h-4 w-4" /></IconButton>
            <IconButton><RefreshCw className="h-4 w-4" /></IconButton>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Acme:</span>
          <div className="flex items-center gap-1">
            <IconButton><Home className="h-4 w-4" /></IconButton>
            <IconButton><Heart className="h-4 w-4" /></IconButton>
          </div>
        </div>
      </div>
    </header>
  )
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted">
      {children}
    </button>
  )
}
