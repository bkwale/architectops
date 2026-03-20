import { RIBAStage, RIBA_STAGES, RIBA_STAGE_COLORS } from '@/lib/types'

interface StageBadgeProps {
  stage: RIBAStage
  size?: 'sm' | 'md'
}

export function StageBadge({ stage, size = 'md' }: StageBadgeProps) {
  const color = RIBA_STAGE_COLORS[stage]
  const label = RIBA_STAGES[stage]

  if (size === 'sm') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {stage}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      Stage {stage}: {label}
    </span>
  )
}
