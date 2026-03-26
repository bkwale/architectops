import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string | number
  sublabel?: string
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'slate'
}

const accentMap = {
  blue: { line: 'bg-accent-500', value: 'text-ink-900' },
  green: { line: 'bg-emerald-500', value: 'text-ink-900' },
  amber: { line: 'bg-amber-500', value: 'text-ink-900' },
  red: { line: 'bg-red-500', value: 'text-ink-900' },
  slate: { line: 'bg-ink-200', value: 'text-ink-900' },
}

export function KPICard({ label, value, sublabel, accent = 'slate' }: KPICardProps) {
  const a = accentMap[accent]

  return (
    <div className="group">
      {/* Thin top accent line */}
      <div className={cn('h-[2px] rounded-full mb-4', a.line)} />
      <p className={cn(
        'font-display text-[3rem] sm:text-[3.5rem] leading-none tracking-tight',
        a.value
      )}>
        {value}
      </p>
      <p className="text-[11px] font-medium text-ink-400 uppercase tracking-[0.12em] mt-2">
        {label}
      </p>
      {sublabel && <p className="text-[11px] text-ink-300 mt-1">{sublabel}</p>}
    </div>
  )
}
