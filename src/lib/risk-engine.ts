import { Project, Task, RiskAlert, RiskSeverity, HealthStatus } from './types'

// ── Risk Detection Engine ───────────────────────────────────
// Rule-based. No AI. Runs on dashboard load.

function makeRisk(
  project_id: string,
  title: string,
  description: string,
  severity: RiskSeverity,
  source_type: string,
  suggested_action: string,
  task_id?: string,
): RiskAlert {
  return {
    id: `risk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    project_id,
    task_id,
    title,
    description,
    severity,
    source_type,
    resolved_flag: false,
    suggested_action,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function calculateRisks(project: Project, tasks: Task[]): RiskAlert[] {
  const risks: RiskAlert[] = []
  const now = new Date()

  const currentStageTasks = tasks.filter(t => t.stage === project.current_stage)
  const allOverdue = tasks.filter(t => t.due_date && new Date(t.due_date) < now && t.status !== 'done')
  const overdueRequired = allOverdue.filter(t => t.required_flag)
  const requiredIncomplete = currentStageTasks.filter(t => t.required_flag && t.status !== 'done')
  const unassignedRequired = tasks.filter(t => t.required_flag && !t.owner_user_id && t.status !== 'done')

  // 1. Stage blocked by incomplete required tasks
  if (requiredIncomplete.length > 0) {
    risks.push(makeRisk(
      project.id,
      `Stage ${project.current_stage} progression blocked`,
      `${requiredIncomplete.length} required task${requiredIncomplete.length > 1 ? 's' : ''} incomplete in current stage.`,
      requiredIncomplete.length >= 3 ? 'high' : 'medium',
      'stage_blocked',
      'Complete required tasks before progressing to next stage.',
    ))
  }

  // 2. Overdue required tasks
  overdueRequired.forEach(task => {
    risks.push(makeRisk(
      project.id,
      `Required task overdue: ${task.title}`,
      `Task was due ${task.due_date} and is still ${task.status.replace('_', ' ')}.`,
      'high',
      'overdue_required',
      'Reassign or escalate this task immediately.',
      task.id,
    ))
  })

  // 3. Multiple overdue tasks (non-required)
  const overdueNonRequired = allOverdue.filter(t => !t.required_flag)
  if (overdueNonRequired.length >= 3) {
    risks.push(makeRisk(
      project.id,
      `${overdueNonRequired.length} tasks overdue`,
      'Multiple tasks have passed their due dates. Review workload and priorities.',
      'medium',
      'multiple_overdue',
      'Review task assignments and due dates with the team.',
    ))
  }

  // 4. Unassigned required tasks
  unassignedRequired.forEach(task => {
    risks.push(makeRisk(
      project.id,
      `No owner: ${task.title}`,
      'Required task has no assigned owner.',
      'medium',
      'unassigned_required',
      'Assign an owner to this required task.',
      task.id,
    ))
  })

  // 5. Project inactive for 14+ days
  const lastActivity = new Date(project.last_activity_at)
  const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
  if (daysSinceActivity >= 14 && project.status === 'active') {
    risks.push(makeRisk(
      project.id,
      `Project inactive for ${daysSinceActivity} days`,
      'No updates recorded recently. Is this project still actively progressing?',
      daysSinceActivity >= 30 ? 'high' : 'medium',
      'stagnant',
      'Check in with the project lead and update task statuses.',
    ))
  }

  // 6. Target completion approaching with low completion
  if (project.target_completion_date) {
    const target = new Date(project.target_completion_date)
    const daysRemaining = Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const totalTasks = tasks.length
    const doneTasks = tasks.filter(t => t.status === 'done').length
    const completion = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0

    if (daysRemaining <= 30 && daysRemaining > 0 && completion < 60) {
      risks.push(makeRisk(
        project.id,
        `Completion date approaching: ${daysRemaining} days left`,
        `Only ${Math.round(completion)}% of tasks complete with ${daysRemaining} days remaining.`,
        'high',
        'deadline_risk',
        'Review scope and reprioritise critical path tasks.',
      ))
    } else if (daysRemaining <= 60 && daysRemaining > 30 && completion < 40) {
      risks.push(makeRisk(
        project.id,
        `Behind schedule: ${Math.round(completion)}% complete`,
        `Target date is ${daysRemaining} days away but progress is low.`,
        'medium',
        'deadline_risk',
        'Assess whether the target date is still achievable.',
      ))
    }
  }

  return risks
}

export function calculateHealth(risks: RiskAlert[], overdueTasks: Task[]): HealthStatus {
  const hasHigh = risks.some(r => r.severity === 'high')
  const hasMedium = risks.some(r => r.severity === 'medium')
  const hasOverdueRequired = overdueTasks.some(t => t.required_flag)

  if (hasHigh || hasOverdueRequired) return 'red'
  if (hasMedium || overdueTasks.length > 0) return 'amber'
  return 'green'
}

export function calculateCompletion(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter(t => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}

export function calculateStageCompletion(tasks: Task[], stage: number): number {
  const stageTasks = tasks.filter(t => t.stage === stage)
  if (stageTasks.length === 0) return 0
  const done = stageTasks.filter(t => t.status === 'done').length
  return Math.round((done / stageTasks.length) * 100)
}
