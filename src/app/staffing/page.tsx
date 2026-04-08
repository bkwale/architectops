'use client'

import { useMemo } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { SummaryCard } from '@/components/SummaryCard'
import { cn } from '@/lib/utils'
import { utilisationColor, formatDate } from '@/lib/utils'
import {
  getStaffAllocations,
  getStaffCapacities,
  getUserAllocations,
  getProject,
  PROJECTS,
  USERS,
  getUser,
} from '@/lib/mock-data'
import { StaffAllocation, StaffCapacity } from '@/lib/types'

interface UserWithMetrics {
  userId: string
  name: string
  role: string
  capacity: StaffCapacity
  allocations: StaffAllocation[]
  totalAllocated: number
  utilisationPercent: number
  status: 'under' | 'optimal' | 'over'
  excessHours?: number
}

interface ProjectAllocationGroup {
  projectId: string
  name: string
  client: string
  totalHours: number
  allocations: Array<{
    userId: string
    userName: string
    roleOnProject: string
    hoursPerWeek: number
    periodStart: string
    periodEnd: string
  }>
}

export default function StaffingForecastPage() {
  const staffMetrics = useMemo(() => {
    const capacities = getStaffCapacities()
    const allocations = getStaffAllocations()

    const metrics: UserWithMetrics[] = capacities.map(capacity => {
      const user = getUser(capacity.user_id)
      const userAllocations = allocations.filter(a => a.user_id === capacity.user_id)
      const totalAllocated = userAllocations.reduce((sum, a) => sum + a.hours_per_week, 0)
      const utilisationPercent = Math.round((totalAllocated / capacity.weekly_capacity_hours) * 100)

      let status: 'under' | 'optimal' | 'over' = 'optimal'
      if (utilisationPercent < 70) status = 'under'
      if (utilisationPercent > 100) status = 'over'

      return {
        userId: capacity.user_id,
        name: user?.name || 'Unknown',
        role: user?.role || 'N/A',
        capacity,
        allocations: userAllocations,
        totalAllocated,
        utilisationPercent,
        status,
        excessHours: utilisationPercent > 100 ? totalAllocated - capacity.weekly_capacity_hours : 0,
      }
    })

    return metrics
  }, [])

  const projectAllocations = useMemo(() => {
    const allocations = getStaffAllocations()
    const grouped: Record<string, ProjectAllocationGroup> = {}

    allocations.forEach(alloc => {
      if (!grouped[alloc.project_id]) {
        const project = getProject(alloc.project_id)
        grouped[alloc.project_id] = {
          projectId: alloc.project_id,
          name: project?.name || 'Unknown',
          client: project?.client || 'N/A',
          totalHours: 0,
          allocations: [],
        }
      }

      const user = getUser(alloc.user_id)
      grouped[alloc.project_id].totalHours += alloc.hours_per_week
      grouped[alloc.project_id].allocations.push({
        userId: alloc.user_id,
        userName: user?.name || 'Unknown',
        roleOnProject: alloc.role_on_project,
        hoursPerWeek: alloc.hours_per_week,
        periodStart: alloc.start_date,
        periodEnd: alloc.end_date,
      })
    })

    return Object.values(grouped)
      .sort((a, b) => b.totalHours - a.totalHours)
  }, [])

  const summaryMetrics = useMemo(() => {
    return {
      teamSize: staffMetrics.length,
      avgUtilisation: Math.round(staffMetrics.reduce((sum, m) => sum + m.utilisationPercent, 0) / staffMetrics.length),
      overAllocated: staffMetrics.filter(m => m.status === 'over').length,
      underAllocated: staffMetrics.filter(m => m.status === 'under').length,
    }
  }, [staffMetrics])

  const sortedByUtilisation = [...staffMetrics].sort((a, b) => b.utilisationPercent - a.utilisationPercent)
  const overAllocatedMembers = staffMetrics.filter(m => m.status === 'over')

  return (
    <div className="max-w-6xl">
      {/* ━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-12">
        <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Staffing Forecast' }]} />
        <div className="mt-6">
          <h1 className="font-display text-[2rem] text-ink-900 tracking-tight mb-2">
            Staffing Forecast
          </h1>
          <p className="text-[13px] text-ink-400">Team utilisation, allocation, and capacity planning</p>
        </div>
      </section>

      {/* ━━━ SUMMARY CARDS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <SummaryCard label="Team Size" value={summaryMetrics.teamSize} />
          <SummaryCard
            label="Avg Utilisation"
            value={summaryMetrics.avgUtilisation}
            textColor={summaryMetrics.avgUtilisation > 100 ? 'text-red-600' : 'text-emerald-600'}
            labelColor="text-ink-400"
          />
          <SummaryCard
            label="Over-allocated"
            value={summaryMetrics.overAllocated}
            bgColor={summaryMetrics.overAllocated > 0 ? 'bg-red-50' : 'bg-white'}
            borderColor={summaryMetrics.overAllocated > 0 ? 'border-red-200' : 'border-surface-200'}
            textColor={summaryMetrics.overAllocated > 0 ? 'text-red-700' : 'text-ink-900'}
          />
          <SummaryCard
            label="Under-allocated"
            value={summaryMetrics.underAllocated}
            bgColor={summaryMetrics.underAllocated > 0 ? 'bg-blue-50' : 'bg-white'}
            borderColor={summaryMetrics.underAllocated > 0 ? 'border-blue-200' : 'border-surface-200'}
            textColor={summaryMetrics.underAllocated > 0 ? 'text-blue-700' : 'text-ink-900'}
          />
        </div>
      </section>

      {/* ━━━ UTILISATION HEATMAP ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-8">Team Utilisation</h2>
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 space-y-6">
            {sortedByUtilisation.map(member => (
              <div key={member.userId} className="flex items-center gap-4">
                {/* Info */}
                <div className="w-32 flex-shrink-0">
                  <p className="text-[13px] font-medium text-ink-900">{member.name}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{member.role}</p>
                </div>

                {/* Bar */}
                <div className="flex-1 h-8 bg-surface-200 rounded-lg overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-lg transition-all',
                      utilisationColor(member.status)
                    )}
                    style={{
                      width: `${Math.min(member.utilisationPercent, 100)}%`,
                    }}
                  />
                </div>

                {/* Percentage */}
                <div className="w-16 text-right flex-shrink-0">
                  <p className={cn(
                    'text-[13px] font-medium tabular-nums',
                    utilisationColor(member.status).replace('bg-', 'text-').replace('100', '700')
                  )}>
                    {member.utilisationPercent}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CAPACITY OVERVIEW TABLE ━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-8">Capacity Overview</h2>
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="px-6 py-3 text-left text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Role</th>
                  <th className="px-6 py-3 text-center text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Weekly Capacity</th>
                  <th className="px-6 py-3 text-center text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Allocated</th>
                  <th className="px-6 py-3 text-center text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Available</th>
                  <th className="px-6 py-3 text-center text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Utilisation</th>
                  <th className="px-6 py-3 text-center text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {staffMetrics.map(member => {
                  const available = member.capacity.weekly_capacity_hours - member.totalAllocated
                  return (
                    <tr
                      key={member.userId}
                      className={cn(
                        'border-b border-surface-200 hover:bg-surface-50 transition-colors',
                        member.status === 'over' && 'bg-red-50/30'
                      )}
                    >
                      <td className="px-6 py-4 font-medium text-ink-900">{member.name}</td>
                      <td className="px-6 py-4 text-ink-600">{member.role}</td>
                      <td className="px-6 py-4 text-center tabular-nums">{member.capacity.weekly_capacity_hours}h</td>
                      <td className="px-6 py-4 text-center tabular-nums font-medium">{member.totalAllocated}h</td>
                      <td className={cn(
                        'px-6 py-4 text-center tabular-nums font-medium',
                        available < 0 ? 'text-red-600' : 'text-emerald-600'
                      )}>
                        {available}h
                      </td>
                      <td className="px-6 py-4 text-center tabular-nums">{member.utilisationPercent}%</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          'text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md',
                          member.status === 'under' && 'bg-blue-100 text-blue-700',
                          member.status === 'optimal' && 'bg-emerald-100 text-emerald-700',
                          member.status === 'over' && 'bg-red-100 text-red-700'
                        )}>
                          {member.status === 'under' && 'Under'}
                          {member.status === 'optimal' && 'Optimal'}
                          {member.status === 'over' && 'Over'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ━━━ PROJECT ALLOCATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-8">Project Allocations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projectAllocations.map(project => (
              <div key={project.projectId} className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
                <div className="mb-5">
                  <p className="text-[13px] font-medium text-ink-900">{project.name}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{project.client}</p>
                </div>

                <div className="space-y-3 mb-5 pb-5 border-b border-surface-200">
                  {project.allocations.map((alloc, i) => (
                    <div key={`${project.projectId}-${alloc.userId}-${i}`} className="text-[12px]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-ink-900">{alloc.userName}</p>
                          <p className="text-ink-400 mt-0.5">{alloc.roleOnProject}</p>
                        </div>
                        <span className="text-ink-600 font-medium tabular-nums">{alloc.hoursPerWeek}h/w</span>
                      </div>
                      <p className="text-[10px] text-ink-300 mt-2">
                        {formatDate(alloc.periodStart)} – {formatDate(alloc.periodEnd)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-ink-400 font-medium uppercase tracking-[0.08em]">Total</p>
                  <p className="text-[13px] font-semibold text-ink-900 tabular-nums">{project.totalHours}h/w</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CAPACITY WARNINGS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {overAllocatedMembers.length > 0 && (
        <section className="pb-16">
          <div className="border-t border-surface-200/60 pt-10">
            <h2 className="font-display text-[1.5rem] text-ink-900 mb-8">Capacity Warnings</h2>
            <div className="space-y-4">
              {overAllocatedMembers.map(member => {
                const lowestPriorityProject = member.allocations.length > 0
                  ? [...member.allocations].sort((a, b) => a.hours_per_week - b.hours_per_week)[0]
                  : null
                const lowestProjectName = lowestPriorityProject ? getProject(lowestPriorityProject.project_id)?.name : 'a project'
                const suggestionHours = Math.round(member.excessHours || 0)

                return (
                  <div
                    key={member.userId}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <p className="text-[13px] font-medium text-ink-900 mb-2">{member.name}</p>
                    <div className="grid grid-cols-3 gap-4 mb-4 text-[12px]">
                      <div>
                        <p className="text-ink-400 text-[11px] uppercase tracking-[0.08em] font-semibold">Current</p>
                        <p className="text-ink-900 font-medium mt-1">{member.totalAllocated}h/w</p>
                      </div>
                      <div>
                        <p className="text-ink-400 text-[11px] uppercase tracking-[0.08em] font-semibold">Capacity</p>
                        <p className="text-ink-900 font-medium mt-1">{member.capacity.weekly_capacity_hours}h/w</p>
                      </div>
                      <div>
                        <p className="text-ink-400 text-[11px] uppercase tracking-[0.08em] font-semibold">Excess</p>
                        <p className="text-red-600 font-medium mt-1">{suggestionHours}h/w</p>
                      </div>
                    </div>
                    <p className="text-[12px] text-red-700">
                      Consider reassigning {suggestionHours}h from <span className="font-medium">{lowestProjectName}</span>.
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
