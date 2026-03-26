import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  colorClass: string
  uppercase?: boolean
}

export function StatusBadge({ label, colorClass, uppercase = true }: StatusBadgeProps) {
  return (
    <span className={cn(
      'px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide',
      uppercase && 'uppercase',
      colorClass
    )}>
      {label}
    </span>
  )
}
