import Link from 'next/link'
import { PROJECTS, ALL_TASKS, getProjectTasks, getUser, APPROVALS, ISSUES, CHANGES, RISK_REGISTER, MEETINGS, MEETING_ACTIONS } from '@/lib/mock-data'
import { calculateRisks, calculateHealth, calculateCompletion, calculateStageCompletion } from '@/lib/risk-engine'
import { ProjectSummary, RiskAlert, RIBA_STAGES } from '@/lib/types'
import { KPICard } from '@/components/KPICard'
import { ProjectHealthTable } from '@/components/ProjectHealthTable'
import { RiskAlertCard } from '@/components/RiskAlertCard'
import { isOverdue, formatDate, cn } from '@/lib/utils'

export default function PracticeDashboard() {
  // Build project summaries
  const summaries: ProjectSummary[] = PROJECTS.map(project => {
    const tasks = getProjectTasks(project.id)
    const risks = calculateRisks(project, tasks)
    const overdueTasks = tasks.filter(t => isOverdue(t.due_date) && t.status !== 'done')
    const completion = calculateCompletion(tasks)
    const stageCompletion = calculateStageCompletion(tasks, project.current_stage)
    const health = calculateHealth(risks, overdueTasks)

    return {
      project,
      lead: project.project_lead_user_id ? getUser(project.project_lead_user_id) : undefined,
      completion,
      stage_completion: stageCompletion,
      open_risks: risks.filter(r => !r.resolved_flag).length,
      overdue_tasks: overdueTasks.length,
      health,
    }
  })

  // Collect all risks
  const allRisks: RiskAlert[] = PROJECTS.flatMap(p => {
    const tasks = getProjectTasks(p.id)
    return calculateRisks(p, tasks)
  })

  const activeProjects = PROJECTS.filter(p => p.status === 'active')
  const highRiskProjects = summaries.filter(s => s.health === 'red')
  const totalOverdue = ALL_TASKS.filter(t => isOverdue(t.due_date) && t.status !== 'done').length
  const highRisks = allRisks.filter(r => r.severity === 'high')

  // Projects by stage
  const stageDistribution: Record<number, number> = {}
  activeProjects.forEach(p => {
    stageDistribution[p.current_stage] = (stageDistribution[p.current_stage] || 0) + 1
  })

  // Time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[13px] text-ink-400 font-medium mb-1">{greeting}, Sarah</p>
          <h1 className="font-display text-display text-ink-900">Practice Overview</h1>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-600 text-white text-[13px] font-medium rounded-xl hover:bg-accent-700 shadow-sm transition-all hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </Link>
      </div>

      {/* ─── KPI Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Active Projects" value={activeProjects.length} accent="blue" />
        <KPICard label="At Risk" value={highRiskProjects.length} accent={highRiskProjects.length > 0 ? 'red' : 'green'} />
        <KPICard label="Overdue Tasks" value={totalOverdue} accent={totalOverdue > 0 ? 'amber' : 'green'} />
        <KPICard label="High Risks" value={highRisks.length} accent={highRisks.length > 0 ? 'red' : 'green'} />
      </div>

      {/* ─── Stage Distribution ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[13px] font-semibold text-ink-900 tracking-tight">RIBA Stage Distribution</h2>
          <span className="text-[11px] text-ink-400">{activeProjects.length} active projects</span>
        </div>

        {/* Stage track — visual bar */}
        <div className="flex gap-1.5 mb-4">
          {Object.entries(RIBA_STAGES).map(([stage, label]) => {
            const count = stageDistribution[Number(stage)] || 0
            const isActive = count > 0
            return (
              <div
                key={stage}
                className={cn(
                  'flex-1 rounded-lg transition-all',
                  isActive ? 'h-2 bg-accent-500' : 'h-2 bg-surface-200'
                )}
                title={`Stage ${stage}: ${label} — ${count} project${count !== 1 ? 's' : ''}`}
              />
            )
          })}
        </div>

        {/* Stage labels */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(RIBA_STAGES).map(([stage, label]) => {
            const count = stageDistribution[Number(stage)] || 0
            return (
              <div
                key={stage}
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-colors',
                  count > 0
                    ? 'bg-white border-surface-200 shadow-card'
                    : 'bg-surface-50 border-transparent'
                )}
              >
                <span className={cn(
                  'text-[11px] font-bold tabular-nums',
                  count > 0 ? 'text-accent-600' : 'text-ink-300'
                )}>
                  {stage}
                </span>
                <span className={cn(
                  'text-[11px] hidden sm:inline',
                  count > 0 ? 'text-ink-700' : 'text-ink-300'
                )}>
                  {label}
                </span>
                {count > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-md bg-accent-50 text-accent-700 text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Health Table + Sidebar ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProjectHealthTable projects={summaries.filter(s => s.project.status === 'active')} />
        </div>

        <div className="space-y-4">
          {/* Top Risks */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
            <h2 className="text-[13px] font-semibold text-ink-900 tracking-tight mb-4">Top Risks</h2>
            {highRisks.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-10 h-10 rounded-full bg-status-green-light flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[12px] text-ink-400">No high-severity risks</p>
              </div>
            ) : (
              <div className="space-y-2">
                {highRisks.slice(0, 6).map(risk => (
                  <RiskAlertCard key={risk.id} risk={risk} compact />
                ))}
              </div>
            )}
          </div>

          {/* Recently Updated */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
            <h2 className="text-[13px] font-semibold text-ink-900 tracking-tight mb-4">Recent Activity</h2>
            <div className="space-y-1">
              {[...PROJECTS]
                .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())
                .slice(0, 5)
                .map(p => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between py-2.5 px-3 -mx-3 rounded-xl group hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                      <span className="text-[13px] text-ink-700 group-hover:text-accent-600 transition-colors font-medium">{p.name}</span>
                    </div>
                    <span className="text-[11px] text-ink-300 tabular-nums">
                      {new Date(p.last_activity_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Approvals + Attention Row ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-ink-900 tracking-tight">Pending Approvals</h2>
            <Link href="/approvals" className="text-[11px] text-accent-600 hover:text-accent-700 font-medium transition-colors">
              View all
              <span className="ml-1">→</span>
            </Link>
          </div>
          {(() => {
            const pending = APPROVALS.filter(a => a.status === 'pending')
            if (pending.length === 0) {
              return <p className="text-[12px] text-ink-400 py-2">No items awaiting review.</p>
            }
            return (
              <div className="space-y-2">
                {pending.slice(0, 4).map(a => {
                  const project = PROJECTS.find(p => p.id === a.project_id)
                  const submitter = getUser(a.submitted_by_user_id)
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-status-amber-light border border-amber-100/60">
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-ink-900 truncate">{a.item_title}</p>
                        <p className="text-[11px] text-ink-400 mt-0.5">
                          {project?.name} · {submitter?.name} · {formatDate(a.submitted_at)}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-status-amber bg-white/60 px-2 py-0.5 rounded-md uppercase shrink-0 ml-3">
                        {a.item_type}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>

        {/* Projects Needing Attention */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
          <h2 className="text-[13px] font-semibold text-ink-900 tracking-tight mb-4">Needs Attention</h2>
          {(() => {
            const alerts: { projectName: string; projectId: string; reason: string; color: string }[] = []

            PROJECTS.filter(p => p.status === 'active').forEach(p => {
              const pIssues = ISSUES.filter(i => i.project_id === p.id && (i.status === 'open' || i.status === 'in_progress'))
              const pChanges = CHANGES.filter(c => c.project_id === p.id && (c.approval_status === 'raised' || c.approval_status === 'under_review'))
              const pRisks = RISK_REGISTER.filter(r => r.project_id === p.id && r.status === 'open' && r.probability === 'high')
              const pOverdueActions = MEETING_ACTIONS.filter(a => {
                const meeting = MEETINGS.find(m => m.id === a.meeting_id)
                return meeting?.project_id === p.id && a.status === 'overdue'
              })

              if (pRisks.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pRisks.length} high-probability risk${pRisks.length > 1 ? 's' : ''}`, color: 'text-status-red' })
              if (pIssues.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pIssues.length} open issue${pIssues.length > 1 ? 's' : ''}`, color: 'text-status-amber' })
              if (pOverdueActions.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pOverdueActions.length} overdue action${pOverdueActions.length > 1 ? 's' : ''}`, color: 'text-status-red' })
            })

            if (alerts.length === 0) {
              return (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-status-green-light flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-ink-400">All projects look healthy</p>
                </div>
              )
            }

            return (
              <div className="space-y-1">
                {alerts.slice(0, 6).map((alert, i) => (
                  <Link
                    key={`${alert.projectId}-${i}`}
                    href={`/projects/${alert.projectId}`}
                    className="flex items-center justify-between p-2.5 px-3 rounded-xl hover:bg-surface-50 transition-colors group"
                  >
                    <span className="text-[12px] font-medium text-ink-700 group-hover:text-accent-600 transition-colors">{alert.projectName}</span>
                    <span className={cn('text-[11px] font-medium', alert.color)}>{alert.reason}</span>
                  </Link>
                ))}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
