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
    <div className="max-w-6xl animate-fade-in">

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[13px] text-ink-400 mb-1.5">{greeting}, Sarah</p>
            <h1 className="font-display text-[2.5rem] sm:text-[3rem] leading-[1.05] text-ink-900 tracking-tight">
              Practice Overview
            </h1>
            <p className="text-[14px] text-ink-400 mt-2">
              {activeProjects.length} active projects across {Object.keys(stageDistribution).length} RIBA stages
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-ink-500 bg-white border border-surface-200 rounded-xl hover:border-accent-200 hover:text-accent-600 transition-all shadow-card hover:shadow-card-hover"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Ask AI
            </Link>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold text-white bg-gradient-accent rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
              New Project
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ METRICS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Active Projects"
            value={activeProjects.length}
            accent="blue"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
          />
          <KPICard
            label="At Risk"
            value={highRiskProjects.length}
            accent={highRiskProjects.length > 0 ? 'red' : 'green'}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            }
          />
          <KPICard
            label="Overdue Tasks"
            value={totalOverdue}
            accent={totalOverdue > 0 ? 'amber' : 'green'}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <KPICard
            label="High Risks"
            value={highRisks.length}
            accent={highRisks.length > 0 ? 'red' : 'green'}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ━━━ STAGE DISTRIBUTION ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-ink-900">RIBA Stage Distribution</h2>
          <span className="text-[11px] text-ink-400 font-medium">{activeProjects.length} active</span>
        </div>
        <StageTimeline distribution={stageDistribution} />
      </section>

      {/* ━━━ PROJECT HEALTH + SIDEBAR ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main table */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-ink-900">Project Health</h2>
              <Link href="/projects" className="text-[11px] text-accent-500 hover:text-accent-600 font-semibold transition-colors">
                View all →
              </Link>
            </div>
            <ProjectHealthTable projects={summaries.filter(s => s.project.status === 'active')} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Needs Attention */}
            <div className="card-premium p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" />
                <h3 className="text-[11px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Needs Attention</h3>
              </div>
              {alerts.length === 0 ? (
                <p className="text-[12px] text-ink-300 italic">All clear — no issues.</p>
              ) : (
                <div className="space-y-1">
                  {alerts.slice(0, 6).map((alert, i) => (
                    <Link
                      key={`${alert.projectId}-${i}`}
                      href={`/projects/${alert.projectId}`}
                      className="flex items-start gap-3 px-3 py-2.5 -mx-2 rounded-lg hover:bg-surface-50 transition-colors group"
                    >
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ring-2',
                        alert.severity === 'high' ? 'bg-red-500 ring-red-100' : 'bg-amber-400 ring-amber-100'
                      )} />
                      <div>
                        <p className="text-[12px] font-medium text-ink-700 group-hover:text-accent-600 transition-colors leading-tight">{alert.projectName}</p>
                        <p className={cn(
                          'text-[11px] mt-0.5',
                          alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'
                        )}>{alert.reason}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Top Risks */}
            {highRisks.length > 0 && (
              <div className="card-premium p-5">
                <h3 className="text-[11px] font-semibold text-ink-400 uppercase tracking-[0.1em] mb-4">Top Risks</h3>
                <div className="space-y-2">
                  {highRisks.slice(0, 4).map(risk => (
                    <RiskAlertCard key={risk.id} risk={risk} compact />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="card-premium p-5">
              <h3 className="text-[11px] font-semibold text-ink-400 uppercase tracking-[0.1em] mb-4">Recent Activity</h3>
              <div className="space-y-0">
                {[...PROJECTS]
                  .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())
                  .slice(0, 5)
                  .map(p => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-surface-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-surface-100 flex items-center justify-center text-[10px] font-bold text-ink-400">
                          {p.name.charAt(0)}
                        </span>
                        <span className="text-[12px] text-ink-600 group-hover:text-accent-600 transition-colors font-medium">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-ink-300 tabular-nums font-mono">
                        {new Date(p.last_activity_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ APPROVALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {pendingApprovals.length > 0 && (
        <section className="pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-ink-900">Pending Approvals</h2>
            <Link href="/approvals" className="text-[11px] text-accent-500 hover:text-accent-600 font-semibold transition-colors">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pendingApprovals.slice(0, 4).map(a => {
              const project = PROJECTS.find(p => p.id === a.project_id)
              const submitter = getUser(a.submitted_by_user_id)
              return (
                <div key={a.id} className="card-premium p-5 group">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-ink-900 leading-tight group-hover:text-accent-600 transition-colors">{a.item_title}</p>
                      <p className="text-[11px] text-ink-400 mt-1.5">
                        {project?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center text-[9px] font-semibold text-accent-600">
                          {submitter?.name.charAt(0)}
                        </span>
                        <span className="text-[10px] text-ink-300">
                          {submitter?.name} · {formatDate(a.submitted_at)}
                        </span>
                      </div>
                    </div>
                    <span className="status-pill bg-amber-50 text-amber-600 border border-amber-100 shrink-0 ml-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {a.item_type}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

    </div>
  )
}
