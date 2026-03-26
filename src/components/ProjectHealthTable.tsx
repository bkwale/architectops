'use client'

import Link from 'next/link'
import { ProjectSummary } from '@/lib/types'
import { StageBadge } from './StageBadge'
import { ProgressBar } from './ProgressBar'
import { healthDot, cn } from '@/lib/utils'

interface ProjectHealthTableProps {
  projects: ProjectSummary[]
}

export function ProjectHealthTable({ projects }: ProjectHealthTableProps) {
  return (
    <div>
      {/* Desktop table — no card wrapper, just clean lines */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-300">
              <th className="pb-3 pr-6 text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[0.12em]">Project</th>
              <th className="pb-3 pr-6 text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[0.12em]">Stage</th>
              <th className="pb-3 pr-6 text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[0.12em] w-32">Progress</th>
              <th className="pb-3 pr-6 text-center text-[10px] font-semibold text-ink-400 uppercase tracking-[0.12em]">Risks</th>
              <th className="pb-3 text-center text-[10px] font-semibold text-ink-400 uppercase tracking-[0.12em]">Overdue</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((ps, i) => (
              <tr
                key={ps.project.id}
                className={cn(
                  'group',
                  i < projects.length - 1 && 'border-b border-surface-200/60'
                )}
              >
                <td className="py-5 pr-6">
                  <Link href={`/projects/${ps.project.id}`} className="group/link">
                    <div className="flex items-center gap-3">
                      <span className={cn('w-2 h-2 rounded-full shrink-0', healthDot(ps.health))} />
                      <div>
                        <p className="text-[13px] font-medium text-ink-900 group-hover/link:text-accent-600 transition-colors">
                          {ps.project.name}
                        </p>
                        <p className="text-[11px] text-ink-400 mt-0.5">{ps.project.client}</p>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-5 pr-6">
                  <StageBadge stage={ps.project.current_stage} size="sm" />
                </td>
                <td className="py-5 pr-6">
                  <ProgressBar value={ps.completion} size="sm" showPercent={true} />
                </td>
                <td className="py-5 pr-6 text-center">
                  {ps.open_risks > 0 ? (
                    <span className="text-[13px] font-semibold text-red-600">{ps.open_risks}</span>
                  ) : (
                    <span className="text-ink-200">—</span>
                  )}
                </td>
                <td className="py-5 text-center">
                  {ps.overdue_tasks > 0 ? (
                    <span className="text-[13px] font-semibold text-amber-600">{ps.overdue_tasks}</span>
                  ) : (
                    <span className="text-ink-200">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {projects.map(ps => (
          <Link
            key={ps.project.id}
            href={`/projects/${ps.project.id}`}
            className="block p-5 bg-white rounded-2xl border border-surface-200 hover:border-surface-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className={cn('w-2 h-2 rounded-full shrink-0', healthDot(ps.health))} />
                <span className="font-medium text-ink-900 text-[13px]">{ps.project.name}</span>
              </div>
              <StageBadge stage={ps.project.current_stage} size="sm" />
            </div>
            <p className="text-[11px] text-ink-400 mb-3">{ps.project.client}</p>
            <ProgressBar value={ps.completion} size="sm" />
            <div className="flex items-center gap-4 mt-3 text-[11px]">
              {ps.open_risks > 0 && <span className="text-red-600 font-semibold">{ps.open_risks} risks</span>}
              {ps.overdue_tasks > 0 && <span className="text-amber-600 font-semibold">{ps.overdue_tasks} overdue</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
