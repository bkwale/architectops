'use client'

import Link from 'next/link'
import { ProjectSummary, RIBA_STAGES } from '@/lib/types'
import { StageBadge } from './StageBadge'
import { ProgressBar } from './ProgressBar'
import { healthDot, cn } from '@/lib/utils'

interface ProjectHealthTableProps {
  projects: ProjectSummary[]
}

export function ProjectHealthTable({ projects }: ProjectHealthTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-surface-200">
        <h2 className="text-[13px] font-semibold text-ink-900 tracking-tight">Project Health</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 text-left">
              <th className="px-6 py-3.5 font-medium text-ink-400 text-[10px] uppercase tracking-[0.1em]">Project</th>
              <th className="px-6 py-3.5 font-medium text-ink-400 text-[10px] uppercase tracking-[0.1em]">Client</th>
              <th className="px-6 py-3.5 font-medium text-ink-400 text-[10px] uppercase tracking-[0.1em]">Stage</th>
              <th className="px-6 py-3.5 font-medium text-ink-400 text-[10px] uppercase tracking-[0.1em] w-36">Progress</th>
              <th className="px-6 py-3.5 font-medium text-ink-400 text-[10px] uppercase tracking-[0.1em] text-center">Risks</th>
              <th className="px-6 py-3.5 font-medium text-ink-400 text-[10px] uppercase tracking-[0.1em] text-center">Overdue</th>
              <th className="px-6 py-3.5 font-medium text-ink-400 text-[10px] uppercase tracking-[0.1em]">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(ps => (
              <tr key={ps.project.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/projects/${ps.project.id}`} className="font-medium text-ink-900 hover:text-accent-600 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className={cn('w-2 h-2 rounded-full shrink-0', healthDot(ps.health))} />
                      {ps.project.name}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-ink-500 text-[13px]">{ps.project.client}</td>
                <td className="px-6 py-4"><StageBadge stage={ps.project.current_stage} size="sm" /></td>
                <td className="px-6 py-4">
                  <ProgressBar value={ps.completion} size="sm" showPercent={true} />
                </td>
                <td className="px-6 py-4 text-center">
                  {ps.open_risks > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-status-red-light text-status-red text-[11px] font-bold">{ps.open_risks}</span>
                  ) : (
                    <span className="text-ink-200">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {ps.overdue_tasks > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-status-amber-light text-status-amber text-[11px] font-bold">{ps.overdue_tasks}</span>
                  ) : (
                    <span className="text-ink-200">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize',
                    ps.project.status === 'active' ? 'bg-status-green-light text-status-green' :
                    ps.project.status === 'paused' ? 'bg-status-amber-light text-status-amber' :
                    'bg-surface-100 text-ink-400'
                  )}>
                    {ps.project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-surface-100">
        {projects.map(ps => (
          <Link key={ps.project.id} href={`/projects/${ps.project.id}`} className="block p-5 hover:bg-surface-50 transition-colors">
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <span className={cn('w-2 h-2 rounded-full shrink-0', healthDot(ps.health))} />
                <span className="font-medium text-ink-900 text-sm">{ps.project.name}</span>
              </div>
              <StageBadge stage={ps.project.current_stage} size="sm" />
            </div>
            <p className="text-xs text-ink-400 mb-3">{ps.project.client}</p>
            <ProgressBar value={ps.completion} size="sm" />
            <div className="flex items-center gap-4 mt-2.5 text-xs">
              {ps.open_risks > 0 && <span className="text-status-red font-medium">{ps.open_risks} risks</span>}
              {ps.overdue_tasks > 0 && <span className="text-status-amber font-medium">{ps.overdue_tasks} overdue</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
