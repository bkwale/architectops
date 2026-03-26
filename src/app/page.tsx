import Link from 'next/link'
import { PROJECTS, ALL_TASKS, USERS, getProjectTasks, getUser, APPROVALS, ISSUES, CHANGES, RISK_REGISTER, MEETINGS, MEETING_ACTIONS } from '@/lib/mock-data'
import { calculateRisks, calculateHealth, calculateCompletion, calculateStageCompletion } from '@/lib/risk-engine'
import { ProjectSummary, RiskAlert, RIBA_STAGES } from '@/lib/types'
import { KPICard } from '@/components/KPICard'
import { ProjectHealthTable } from '@/components/ProjectHealthTable'
import { RiskAlertCard } from '@/components/RiskAlertCard'
import { isOverdue, approvalStatusColor, formatDate, cn } from '@/lib/utils'

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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Practice Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Studio Mitchell Architects — live project overview</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Active Projects" value={activeProjects.length} accent="blue" />
        <KPICard label="At Risk" value={highRiskProjects.length} accent={highRiskProjects.length > 0 ? 'red' : 'green'} />
        <KPICard label="Overdue Tasks" value={totalOverdue} accent={totalOverdue > 0 ? 'amber' : 'green'} />
        <KPICard label="High Risks" value={highRisks.length} accent={highRisks.length > 0 ? 'red' : 'green'} />
      </div>

      {/* Stage Distribution */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Active Projects by RIBA Stage</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(RIBA_STAGES).map(([stage, label]) => {
            const count = stageDistribution[Number(stage)] || 0
            return (
              <div
                key={stage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"
              >
                <span className="text-xs font-bold text-slate-400">S{stage}</span>
                <span className="text-xs text-slate-600 hidden sm:inline">{label}</span>
                <span className="text-sm font-bold text-slate-900">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two-column: Health Table + Risk Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProjectHealthTable projects={summaries.filter(s => s.project.status === 'active')} />
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Top Risks</h2>
            {highRisks.length === 0 ? (
              <p className="text-xs text-slate-400">No high-severity risks detected.</p>
            ) : (
              <div className="space-y-2">
                {highRisks.slice(0, 6).map(risk => (
                  <RiskAlertCard key={risk.id} risk={risk} compact />
                ))}
              </div>
            )}
          </div>

          {/* Recently Updated */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Recently Updated</h2>
            <div className="space-y-2.5">
              {[...PROJECTS]
                .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())
                .slice(0, 4)
                .map(p => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between py-1.5 group"
                  >
                    <span className="text-sm text-slate-700 group-hover:text-brand-600 transition-colors">{p.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(p.last_activity_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2: Approvals + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Pending Approvals</h2>
            <Link href="/approvals" className="text-xs text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
          </div>
          {(() => {
            const pending = APPROVALS.filter(a => a.status === 'pending')
            if (pending.length === 0) {
              return <p className="text-xs text-slate-400">No items awaiting review.</p>
            }
            return (
              <div className="space-y-2">
                {pending.slice(0, 4).map(a => {
                  const project = PROJECTS.find(p => p.id === a.project_id)
                  const submitter = getUser(a.submitted_by_user_id)
                  return (
                    <div key={a.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-800 truncate">{a.item_title}</p>
                        <p className="text-[11px] text-slate-400">
                          {project?.name} · {submitter?.name} · {formatDate(a.submitted_at)}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase shrink-0 ml-2">
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
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Projects Needing Attention</h2>
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

              if (pRisks.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pRisks.length} high-probability risk${pRisks.length > 1 ? 's' : ''}`, color: 'text-red-600' })
              if (pIssues.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pIssues.length} open issue${pIssues.length > 1 ? 's' : ''}`, color: 'text-amber-600' })
              if (pOverdueActions.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pOverdueActions.length} overdue action${pOverdueActions.length > 1 ? 's' : ''}`, color: 'text-red-600' })
            })

            if (alerts.length === 0) {
              return <p className="text-xs text-slate-400">All projects look healthy.</p>
            }

            return (
              <div className="space-y-2">
                {alerts.slice(0, 6).map((alert, i) => (
                  <Link
                    key={`${alert.projectId}-${i}`}
                    href={`/projects/${alert.projectId}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-800">{alert.projectName}</span>
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
