'use client'

import Link from 'next/link'
import { ProjectSummary } from '@/lib/types'
import { StageBadge } from './StageBadge'
import { ProgressBar } from './ProgressBar'
import { healthDot, cn } from '@/lib/utils'

interface ProjectHealthTableProps {
  projects: ProjectSummary[]
}

function HealthDot({ health }: { health: string }) {
  return (
    <span className={cn(
      'w-2.5 h-2.5 rounded-full shrink-0 ring-2',
      health === 'red' ? 'bg-red-500 ring-red-100' :
      health === 'amber' ? 'bg-amber-400 ring-amber-100' :
      'bg-emerald-500 ring-emerald-100'
    )} />
  )
}

function MetricBadge({ value, type }: { value: number; type: 'risk' | 'overdue' }) {
  if (value === 0) return <span className="text-ink-200">—</span>

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
      type === 'risk'
        ? 'bg-red-50 text-red-600'
        : 'bg-amber-50 text-amber-600'
    )}>
      {value}
    </span>
  )
}

export function ProjectHealthTable({ projects }: ProjectHealthTableProps) {
  return (
    <div className="card-premium overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Project</th>
              <th className="px-4 py-3.5 text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Stage</th>
              <th className="px-4 py-3.5 text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em] w-36">Progress</th>
              <th className="px-4 py-3.5 text-center text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Risks</th>
              <th className="px-5 py-3.5 text-center text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Overdue</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((ps, i) => (
              <tr
                key={ps.project.id}
                className={cn(
                  'stripe-row group',
                  i < projects.length - 1 && 'border-b border-surface-100'
                )}
              >
                <td className="px-5 py-4">
                  <Link href={`/projects/${ps.project.id}`} className="group/link flex items-center gap-3">
                    <HealthDot health={ps.health} />
                    <div>
                      <p className="text-[13px] font-medium text-ink-900 group-hover/link:text-accent-600 transition-colors">
                        {ps.project.name}
                      </p>
                      <p className="text-[11px] text-ink-400 mt-0.5">{ps.project.client}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <StageBadge stage={ps.project.current_stage} size="sm" />
                </td>
                <td className="px-4 py-4">
                  <ProgressBar value={ps.completion} size="sm" showPercent={true} />
                </td>
                <td className="px-4 py-4 text-center">
                  <MetricBadge value={ps.open_risks} type="risk" />
                </td>
                <td className="px-5 py-4 text-center">
                  <MetricBadge value={ps.overdue_tasks} type="overdue" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-surface-100">
        {projects.map(ps => (
          <Link
            key={ps.project.id}
            href={`/projects/${ps.project.id}`}
            className="block p-5 hover:bg-surface-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <HealthDot health={ps.health} />
                <span className="font-medium text-ink-900 text-[13px]">{ps.project.name}</span>
              </div>
              <StageBadge stage={ps.project.current_stage} size="sm" />
            </div>
            <p className="text-[11px] text-ink-400 mb-3">{ps.project.client}</p>
            <ProgressBar value={ps.completion} size="sm" />
            <div className="flex items-center gap-3 mt-3">
              {ps.open_risks > 0 && <MetricBadge value={ps.open_risks} type="risk" />}
              {ps.overdue_tasks > 0 && <MetricBadge value={ps.overdue_tasks} type="overdue" />}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
