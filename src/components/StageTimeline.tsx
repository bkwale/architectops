import { RIBA_STAGES } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StageTimelineProps {
  distribution: Record<number, number>
}

export function StageTimeline({ distribution }: StageTimelineProps) {
  const stages = Object.entries(RIBA_STAGES)

  return (
    <div className="py-2">
      {/* Timeline track */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-surface-300" />

        {stages.map(([stage, label]) => {
          const count = distribution[Number(stage)] || 0
          const isActive = count > 0

          return (
            <div key={stage} className="relative flex flex-col items-center z-10">
              {/* Node */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                isActive
                  ? 'bg-ink-900 text-white shadow-md'
                  : 'bg-surface-50 border-2 border-surface-300 text-ink-300'
              )}>
                {isActive ? count : stage}
              </div>

              {/* Label below */}
              <div className="mt-3 text-center">
                <p className={cn(
                  'text-[10px] font-semibold tracking-wide',
                  isActive ? 'text-ink-900' : 'text-ink-300'
                )}>
                  {stage}
                </p>
                <p className={cn(
                  'text-[9px] mt-0.5 max-w-[4.5rem] leading-tight hidden sm:block',
                  isActive ? 'text-ink-500' : 'text-ink-200'
                )}>
                  {label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
