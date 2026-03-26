import { ChevronDown, Home, RefreshCw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import farosLogo from '@/assets/faros-logo.svg';

export function Header() {
  return (
    <header className="flex h-14 items-center border-b border-border bg-white px-4">
      {/* Left section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <img src={farosLogo} alt="Faros AI" className="h-6 w-6" />
        </div>
        <Button variant="ghost" size="sm">
          Default Workspace
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            Modules
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm">
            Scorecard
          </Button>
        </nav>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Personal:</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm">
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon-sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Acme:</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm">
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon-sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
