import { useState, createContext, useContext, useRef, useEffect, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const MenuContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({
  open: false,
  setOpen: () => {},
})

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useContext(MenuContext)
  return (
    <button className={className} onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ className, children, align = 'end', ...props }: HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' }) {
  const { open, setOpen } = useContext(MenuContext)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        align === 'start' ? 'left-0' : 'right-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ className, children, onClick, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useContext(MenuContext)
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent',
        className,
      )}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </div>
  )
}
