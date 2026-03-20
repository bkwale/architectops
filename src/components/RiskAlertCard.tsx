import { RiskAlert } from '@/lib/types'
import { severityColor, severityDot, cn } from '@/lib/utils'

interface RiskAlertCardProps {
  risk: RiskAlert
  compact?: boolean
}

export function RiskAlertCard({ risk, compact = false }: RiskAlertCardProps) {
  if (compact) {
    return (
      <div className={cn('flex items-start gap-2.5 px-3 py-2.5 rounded-lg border', severityColor(risk.severity))}>
        <span className={cn('w-2 h-2 rounded-full mt-1 shrink-0', severityDot(risk.severity))} />
        <div className="min-w-0">
          <p className="text-xs font-medium leading-tight">{risk.title}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border p-4', severityColor(risk.severity))}>
      <div className="flex items-start gap-3">
        <span className={cn('w-2.5 h-2.5 rounded-full mt-0.5 shrink-0', severityDot(risk.severity))} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold">{risk.title}</p>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{risk.severity}</span>
          </div>
          <p className="text-xs opacity-75 mb-2">{risk.description}</p>
          {risk.suggested_action && (
            <p className="text-xs font-medium opacity-90">→ {risk.suggested_action}</p>
          )}
        </div>
      </div>
    </div>
  )
}
