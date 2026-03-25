import type { ReactNode } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'

interface PopoverProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Popover({ open, onClose, children }: PopoverProps) {
  const ref = useClickOutside<HTMLDivElement>(onClose)

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-md border border-border bg-white shadow-lg"
    >
      {children}
    </div>
  )
}
