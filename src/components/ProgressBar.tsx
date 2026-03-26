import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md'
  color?: string
  label?: string
  showPercent?: boolean
}

export function ProgressBar({ value, size = 'md', color, label, showPercent = true }: ProgressBarProps) {
  const barColor = color || (
    value >= 80 ? 'bg-status-green' :
    value >= 50 ? 'bg-accent-500' :
    value >= 25 ? 'bg-status-amber' :
    'bg-ink-200'
  )

  return (
    <div>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-[11px] font-medium text-ink-500">{label}</span>}
          {showPercent && <span className="text-[11px] font-semibold text-ink-700 tabular-nums">{value}%</span>}
        </div>
      )}
      <div className={cn(
        'w-full rounded-full bg-surface-200 overflow-hidden',
        size === 'sm' ? 'h-1' : 'h-2'
      )}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', barColor)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}
