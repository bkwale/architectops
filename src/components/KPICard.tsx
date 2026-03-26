import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string | number
  sublabel?: string
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'slate'
  icon?: React.ReactNode
}

const accentMap = {
  blue: {
    border: 'border-accent-100',
    dot: 'bg-accent-500',
    value: 'text-accent-700',
  },
  green: {
    border: 'border-emerald-100',
    dot: 'bg-status-green',
    value: 'text-status-green',
  },
  amber: {
    border: 'border-amber-100',
    dot: 'bg-status-amber',
    value: 'text-status-amber',
  },
  red: {
    border: 'border-red-100',
    dot: 'bg-status-red',
    value: 'text-status-red',
  },
  slate: {
    border: 'border-surface-200',
    dot: 'bg-ink-300',
    value: 'text-ink-900',
  },
}

export function KPICard({ label, value, sublabel, accent = 'slate', icon }: KPICardProps) {
  const a = accentMap[accent]

  return (
    <div className={cn(
      'bg-white rounded-2xl border p-5 sm:p-6 shadow-card card-hover',
      a.border
    )}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={cn('w-1.5 h-1.5 rounded-full', a.dot)} />
            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-[0.08em]">{label}</p>
          </div>
          <p className={cn('text-3xl sm:text-4xl font-light tracking-tight', a.value)}>{value}</p>
          {sublabel && <p className="text-[11px] text-ink-400 mt-1.5">{sublabel}</p>}
        </div>
        {icon && (
          <div className="text-ink-200">{icon}</div>
        )}
      </div>
    </div>
  )
}
