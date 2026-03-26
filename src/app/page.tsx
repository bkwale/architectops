import Link from 'next/link'
import { PROJECTS, ALL_TASKS, getProjectTasks, getUser, APPROVALS, ISSUES, CHANGES, RISK_REGISTER, MEETINGS, MEETING_ACTIONS } from '@/lib/mock-data'
import { calculateRisks, calculateHealth, calculateCompletion, calculateStageCompletion } from '@/lib/risk-engine'
import { ProjectSummary, RiskAlert, RIBA_STAGES } from '@/lib/types'
import { KPICard } from '@/components/KPICard'
import { ProjectHealthTable } from '@/components/ProjectHealthTable'
import { StageTimeline } from '@/components/StageTimeline'
import { RiskAlertCard } from '@/components/RiskAlertCard'
import { isOverdue, formatDate, cn } from '@/lib/utils'

export default function PracticeDashboard() {
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

  const allRisks: RiskAlert[] = PROJECTS.flatMap(p => {
    const tasks = getProjectTasks(p.id)
    return calculateRisks(p, tasks)
  })

  const activeProjects = PROJECTS.filter(p => p.status === 'active')
  const highRiskProjects = summaries.filter(s => s.health === 'red')
  const totalOverdue = ALL_TASKS.filter(t => isOverdue(t.due_date) && t.status !== 'done').length
  const highRisks = allRisks.filter(r => r.severity === 'high')

  const stageDistribution: Record<number, number> = {}
  activeProjects.forEach(p => {
    stageDistribution[p.current_stage] = (stageDistribution[p.current_stage] || 0) + 1
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Alerts for sidebar
  const alerts: { projectName: string; projectId: string; reason: string; severity: 'high' | 'medium' }[] = []
  PROJECTS.filter(p => p.status === 'active').forEach(p => {
    const pRisks = RISK_REGISTER.filter(r => r.project_id === p.id && r.status === 'open' && r.probability === 'high')
    const pOverdueActions = MEETING_ACTIONS.filter(a => {
      const meeting = MEETINGS.find(m => m.id === a.meeting_id)
      return meeting?.project_id === p.id && a.status === 'overdue'
    })
    const pIssues = ISSUES.filter(i => i.project_id === p.id && (i.status === 'open' || i.status === 'in_progress'))
    if (pRisks.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pRisks.length} high risk${pRisks.length > 1 ? 's' : ''}`, severity: 'high' })
    if (pOverdueActions.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pOverdueActions.length} overdue`, severity: 'high' })
    if (pIssues.length > 0) alerts.push({ projectName: p.name, projectId: p.id, reason: `${pIssues.length} open issue${pIssues.length > 1 ? 's' : ''}`, severity: 'medium' })
  })

  const pendingApprovals = APPROVALS.filter(a => a.status === 'pending')

  return (
    <div className="max-w-6xl">

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <p className="text-[13px] text-ink-400 mb-2">{greeting}, Sarah</p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="font-display text-[2.75rem] sm:text-[3.5rem] leading-[1.05] text-ink-900 tracking-tight">
              Practice<br />
              <span className="text-ink-400">Overview</span>
            </h1>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold text-ink-900 border border-ink-900 rounded-full hover:bg-ink-900 hover:text-white transition-all uppercase tracking-[0.1em] self-start sm:self-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            New Project
          </Link>
        </div>
      </section>

      {/* ━━━ METRICS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-300 pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <KPICard label="Active Projects" value={activeProjects.length} accent="blue" />
            <KPICard label="At Risk" value={highRiskProjects.length} accent={highRiskProjects.length > 0 ? 'red' : 'green'} />
            <KPICard label="Overdue Tasks" value={totalOverdue} accent={totalOverdue > 0 ? 'amber' : 'green'} />
            <KPICard label="High Risks" value={highRisks.length} accent={highRisks.length > 0 ? 'red' : 'green'} />
          </div>
        </div>
      </section>

      {/* ━━━ STAGE DISTRIBUTION ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-300 pt-10">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-[1.5rem] text-ink-900">RIBA Stages</h2>
            <span className="text-[11px] text-ink-400 uppercase tracking-[0.1em]">{activeProjects.length} active</span>
          </div>
          <StageTimeline distribution={stageDistribution} />
        </div>
      </section>

      {/* ━━━ PROJECT HEALTH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-300 pt-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Main table */}
            <div className="xl:col-span-2">
              <h2 className="font-display text-[1.5rem] text-ink-900 mb-8">Project Health</h2>
              <ProjectHealthTable projects={summaries.filter(s => s.project.status === 'active')} />
            </div>

            {/* Sidebar — attention items */}
            <div className="space-y-10">
              {/* Needs Attention */}
              <div>
                <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.14em] mb-4">Needs Attention</h3>
                {alerts.length === 0 ? (
                  <p className="text-[12px] text-ink-300 italic">All clear.</p>
                ) : (
                  <div className="space-y-2">
                    {alerts.slice(0, 6).map((alert, i) => (
                      <Link
                        key={`${alert.projectId}-${i}`}
                        href={`/projects/${alert.projectId}`}
                        className="flex items-start gap-3 py-2 group"
                      >
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                          alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                        )} />
                        <div>
                          <p className="text-[12px] font-medium text-ink-700 group-hover:text-accent-600 transition-colors leading-tight">{alert.projectName}</p>
                          <p className={cn(
                            'text-[11px] mt-0.5',
                            alert.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                          )}>{alert.reason}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Risks */}
              {highRisks.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.14em] mb-4">Top Risks</h3>
                  <div className="space-y-2">
                    {highRisks.slice(0, 4).map(risk => (
                      <RiskAlertCard key={risk.id} risk={risk} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div>
                <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.14em] mb-4">Recent Activity</h3>
                <div className="space-y-0">
                  {[...PROJECTS]
                    .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())
                    .slice(0, 5)
                    .map(p => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className="flex items-center justify-between py-2.5 group"
                      >
                        <span className="text-[12px] text-ink-600 group-hover:text-accent-600 transition-colors">{p.name}</span>
                        <span className="text-[10px] text-ink-300 tabular-nums font-mono">
                          {new Date(p.last_activity_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ APPROVALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {pendingApprovals.length > 0 && (
        <section className="pb-16">
          <div className="border-t border-surface-300 pt-10">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-[1.5rem] text-ink-900">Approvals</h2>
              <Link href="/approvals" className="text-[11px] text-ink-400 hover:text-accent-600 transition-colors uppercase tracking-[0.1em]">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pendingApprovals.slice(0, 4).map(a => {
                const project = PROJECTS.find(p => p.id === a.project_id)
                const submitter = getUser(a.submitted_by_user_id)
                return (
                  <div key={a.id} className="flex items-start justify-between p-5 bg-white rounded-2xl border border-surface-200">
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-ink-900 leading-tight">{a.item_title}</p>
                      <p className="text-[11px] text-ink-400 mt-1.5">
                        {project?.name}
                      </p>
                      <p className="text-[10px] text-ink-300 mt-0.5">
                        {submitter?.name} · {formatDate(a.submitted_at)}
                      </p>
                    </div>
                    <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-[0.1em] shrink-0 ml-4 mt-0.5">
                      {a.item_type}
                    </span>
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
