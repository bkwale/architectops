import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string | number
  sublabel?: string
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'slate'
}

const accentColors = {
  blue: 'border-brand-200 bg-brand-50/50',
  green: 'border-emerald-200 bg-emerald-50/50',
  amber: 'border-amber-200 bg-amber-50/50',
  red: 'border-red-200 bg-red-50/50',
  slate: 'border-slate-200 bg-white',
}

const valueColors = {
  blue: 'text-brand-700',
  green: 'text-emerald-700',
  amber: 'text-amber-700',
  red: 'text-red-700',
  slate: 'text-slate-900',
}

export function KPICard({ label, value, sublabel, accent = 'slate' }: KPICardProps) {
  return (
    <div className={cn('rounded-xl border p-4 sm:p-5', accentColors[accent])}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={cn('text-2xl sm:text-3xl font-bold mt-1', valueColors[accent])}>{value}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-1">{sublabel}</p>}
    </div>
  )
}
