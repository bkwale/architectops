'use client'

import Link from 'next/link'
import { ProjectSummary, RIBA_STAGES } from '@/lib/types'
import { StageBadge } from './StageBadge'
import { ProgressBar } from './ProgressBar'
import { healthDot, formatDate, cn } from '@/lib/utils'

interface ProjectHealthTableProps {
  projects: ProjectSummary[]
}

export function ProjectHealthTable({ projects }: ProjectHealthTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Project Health</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Project</th>
              <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Client</th>
              <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Stage</th>
              <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide w-36">Progress</th>
              <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide text-center">Risks</th>
              <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide text-center">Overdue</th>
              <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(ps => (
              <tr key={ps.project.id} className="border-b border-slate-50 hover:bg-slate-25 transition-colors">
                <td className="px-5 py-3.5">
                  <Link href={`/projects/${ps.project.id}`} className="font-medium text-slate-900 hover:text-brand-600 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full shrink-0', healthDot(ps.health))} />
                      {ps.project.name}
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{ps.project.client}</td>
                <td className="px-5 py-3.5"><StageBadge stage={ps.project.current_stage} size="sm" /></td>
                <td className="px-5 py-3.5">
                  <ProgressBar value={ps.completion} size="sm" showPercent={true} />
                </td>
                <td className="px-5 py-3.5 text-center">
                  {ps.open_risks > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">{ps.open_risks}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {ps.overdue_tasks > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{ps.overdue_tasks}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    'inline-block px-2 py-0.5 rounded text-[11px] font-medium capitalize',
                    ps.project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    ps.project.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
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
      <div className="md:hidden divide-y divide-slate-100">
        {projects.map(ps => (
          <Link key={ps.project.id} href={`/projects/${ps.project.id}`} className="block p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full shrink-0', healthDot(ps.health))} />
                <span className="font-medium text-slate-900 text-sm">{ps.project.name}</span>
              </div>
              <StageBadge stage={ps.project.current_stage} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mb-2">{ps.project.client}</p>
            <ProgressBar value={ps.completion} size="sm" />
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              {ps.open_risks > 0 && <span className="text-red-600 font-medium">{ps.open_risks} risks</span>}
              {ps.overdue_tasks > 0 && <span className="text-amber-600 font-medium">{ps.overdue_tasks} overdue</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
