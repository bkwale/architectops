import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md'
  color?: string
  label?: string
  showPercent?: boolean
}

export function ProgressBar({ value, size = 'md', color, label, showPercent = true }: ProgressBarProps) {
  const barColor = color || (value >= 80 ? 'bg-emerald-500' : value >= 50 ? 'bg-brand-500' : value >= 25 ? 'bg-amber-500' : 'bg-slate-300')

  return (
    <div>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-slate-700">{value}%</span>}
        </div>
      )}
      <div className={cn(
        'w-full rounded-full bg-slate-100 overflow-hidden',
        size === 'sm' ? 'h-1.5' : 'h-2.5'
      )}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}
