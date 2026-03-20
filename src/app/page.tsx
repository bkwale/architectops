import Link from 'next/link'
import { PROJECTS, ALL_TASKS, USERS, getProjectTasks, getUser } from '@/lib/mock-data'
import { calculateRisks, calculateHealth, calculateCompletion, calculateStageCompletion } from '@/lib/risk-engine'
import { ProjectSummary, RiskAlert, RIBA_STAGES } from '@/lib/types'
import { KPICard } from '@/components/KPICard'
import { ProjectHealthTable } from '@/components/ProjectHealthTable'
import { RiskAlertCard } from '@/components/RiskAlertCard'
import { isOverdue } from '@/lib/utils'

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
    </div>
  )
}
