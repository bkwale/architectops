import { RiskAlert } from '@/lib/types'
import { severityColor, severityDot, cn } from '@/lib/utils'

interface RiskAlertCardProps {
  risk: RiskAlert
  compact?: boolean
}

export function RiskAlertCard({ risk, compact = false }: RiskAlertCardProps) {
  if (compact) {
    return (
      <div className={cn('flex items-start gap-2.5 px-3 py-2.5 rounded-xl border', severityColor(risk.severity))}>
        <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', severityDot(risk.severity))} />
        <div className="min-w-0">
          <p className="text-[12px] font-medium leading-tight">{risk.title}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl border p-5', severityColor(risk.severity))}>
      <div className="flex items-start gap-3">
        <span className={cn('w-2 h-2 rounded-full mt-1 shrink-0', severityDot(risk.severity))} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[13px] font-semibold">{risk.title}</p>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50">{risk.severity}</span>
          </div>
          <p className="text-[12px] opacity-70 mb-2">{risk.description}</p>
          {risk.suggested_action && (
            <p className="text-[12px] font-medium opacity-80">→ {risk.suggested_action}</p>
          )}
        </div>
      </div>
    </div>
  )
}
