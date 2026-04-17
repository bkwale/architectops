import { RIBA_STAGES } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StageTimelineProps {
  distribution: Record<number, number>
}

export function StageTimeline({ distribution }: StageTimelineProps) {
  const stages = Object.entries(RIBA_STAGES)

  // Find the highest active stage for the connecting line
  const activeStages = Object.entries(distribution)
    .filter(([, count]) => count > 0)
    .map(([stage]) => Number(stage))
  const highestActive = activeStages.length > 0 ? Math.max(...activeStages) : -1

  return (
    <div className="card-premium p-6">
      <div className="relative flex items-center justify-between">
        {/* Background track */}
        <div className="absolute left-4 right-4 top-[18px] h-[2px] bg-surface-200" />

        {/* Active track fills to highest active stage */}
        {highestActive >= 0 && (
          <div
            className="absolute left-4 top-[18px] h-[2px] bg-gradient-accent rounded-full"
            style={{
              width: `${(highestActive / (stages.length - 1)) * (100 - (100 / stages.length))}%`,
            }}
          />
        )}

        {stages.map(([stage, label]) => {
          const count = distribution[Number(stage)] || 0
          const isActive = count > 0
          const stageNum = Number(stage)

          return (
            <div key={stage} className="relative flex flex-col items-center z-10">
              {/* Node */}
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-all relative',
                isActive
                  ? 'bg-gradient-accent text-white shadow-md'
                  : stageNum <= highestActive
                    ? 'bg-accent-100 border-2 border-accent-300 text-accent-600'
                    : 'bg-white border-2 border-surface-200 text-ink-300'
              )}>
                {isActive ? count : stage}

                {/* Pulse ring on active nodes */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full border-2 border-accent-400/30 animate-pulse-soft" />
                )}
              </div>

              {/* Label below */}
              <div className="mt-3 text-center">
                <p className={cn(
                  'text-[10px] font-bold tracking-wide',
                  isActive ? 'text-ink-900' : 'text-ink-300'
                )}>
                  {stage}
                </p>
                <p className={cn(
                  'text-[9px] mt-0.5 max-w-[5rem] leading-tight hidden sm:block',
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
