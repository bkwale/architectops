import { User, Project, Task, RIBAStage } from './types'
import { STAGE_TEMPLATES } from './stage-templates'

// ── Demo Users ──────────────────────────────────────────────

export const USERS: User[] = [
  { id: 'u1', name: 'Sarah Mitchell', email: 'sarah@studiomitchell.co.uk', role: 'practice_owner', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'u2', name: 'James Chen', email: 'james@studiomitchell.co.uk', role: 'project_lead', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'u3', name: 'Priya Sharma', email: 'priya@studiomitchell.co.uk', role: 'project_lead', created_at: '2024-02-15', updated_at: '2024-02-15' },
  { id: 'u4', name: 'Tom Davies', email: 'tom@studiomitchell.co.uk', role: 'team_member', created_at: '2024-03-01', updated_at: '2024-03-01' },
  { id: 'u5', name: 'Amara Okafor', email: 'amara@studiomitchell.co.uk', role: 'team_member', created_at: '2024-04-01', updated_at: '2024-04-01' },
]

// ── Helper to generate tasks from templates ─────────────────

let taskIdCounter = 0
function generateTasksForProject(
  projectId: string,
  currentStage: RIBAStage,
  overrides?: Partial<Record<string, Partial<Task>>>
): Task[] {
  const tasks: Task[] = []
  const now = new Date()

  for (let stage = 0 as RIBAStage; stage <= currentStage; stage++) {
    const templates = STAGE_TEMPLATES.filter(t => t.stage === stage)
    templates.forEach(template => {
      taskIdCounter++
      const id = `t${taskIdCounter}`
      const isPastStage = stage < currentStage
      const baseTask: Task = {
        id,
        project_id: projectId,
        title: template.task_title,
        description: template.task_description,
        stage: template.stage,
        status: isPastStage ? 'done' : 'not_started',
        owner_user_id: undefined,
        due_date: undefined,
        required_flag: template.required_flag,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      }
      const override = overrides?.[id] || overrides?.[template.task_title]
      tasks.push({ ...baseTask, ...override })
    })
  }
  return tasks
}

// ── Demo Projects ───────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Riverside House Extension',
    client: 'Harris Family Trust',
    description: 'Two-storey rear extension and loft conversion to Grade II listed property.',
    start_date: '2025-09-01',
    target_completion_date: '2026-06-30',
    current_stage: 3,
    status: 'active',
    project_lead_user_id: 'u2',
    created_by_user_id: 'u1',
    created_at: '2025-09-01',
    updated_at: '2026-03-18',
    last_activity_at: '2026-03-18',
  },
  {
    id: 'p2',
    name: 'Clapham Mixed-Use Block',
    client: 'Meridian Developments',
    description: 'New-build 12-unit residential with ground floor commercial. Pre-app in progress.',
    start_date: '2025-11-15',
    target_completion_date: '2027-03-01',
    current_stage: 2,
    status: 'active',
    project_lead_user_id: 'u3',
    created_by_user_id: 'u1',
    created_at: '2025-11-15',
    updated_at: '2026-03-15',
    last_activity_at: '2026-03-15',
  },
  {
    id: 'p3',
    name: 'Weybridge School Refurb',
    client: 'Surrey County Council',
    description: 'Internal refurbishment of existing primary school. Phased summer works.',
    start_date: '2025-06-01',
    target_completion_date: '2026-04-15',
    current_stage: 4,
    status: 'active',
    project_lead_user_id: 'u2',
    created_by_user_id: 'u1',
    created_at: '2025-06-01',
    updated_at: '2026-03-10',
    last_activity_at: '2026-03-10',
  },
  {
    id: 'p4',
    name: 'Southwark Community Hub',
    client: 'LB Southwark',
    description: 'Community centre with flexible workspace and youth facilities.',
    start_date: '2026-01-10',
    target_completion_date: '2027-09-01',
    current_stage: 1,
    status: 'active',
    project_lead_user_id: 'u3',
    created_by_user_id: 'u1',
    created_at: '2026-01-10',
    updated_at: '2026-03-01',
    last_activity_at: '2026-03-01',
  },
  {
    id: 'p5',
    name: 'Dulwich Garden Studio',
    client: 'Patterson Residence',
    description: 'Detached garden office / studio with green roof.',
    start_date: '2025-10-01',
    target_completion_date: '2026-05-01',
    current_stage: 5,
    status: 'active',
    project_lead_user_id: 'u2',
    created_by_user_id: 'u1',
    created_at: '2025-10-01',
    updated_at: '2026-03-19',
    last_activity_at: '2026-03-19',
  },
  {
    id: 'p6',
    name: 'Brixton Workspace Conversion',
    client: 'Acre Lane Partners',
    description: 'Light industrial to co-working conversion. Planning granted.',
    start_date: '2025-04-01',
    target_completion_date: '2026-01-15',
    current_stage: 2,
    status: 'paused',
    project_lead_user_id: undefined,
    created_by_user_id: 'u1',
    created_at: '2025-04-01',
    updated_at: '2025-12-10',
    last_activity_at: '2025-12-10',
  },
]

// ── Generate all tasks with realistic overrides ─────────────

const d = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// Project 1: Stage 3, mostly healthy but some overdue
const p1Tasks = generateTasksForProject('p1', 3, {
  'Develop coordinated design': { status: 'in_progress', owner_user_id: 'u2', due_date: d(14) },
  'Review planning submission package': { status: 'in_progress', owner_user_id: 'u4', due_date: d(-3) }, // overdue!
  'Confirm key spatial decisions': { status: 'not_started', owner_user_id: 'u2', due_date: d(21) },
  'Cost plan review': { status: 'not_started', due_date: d(28) },
})

// Project 2: Stage 2, concept sign-off overdue
const p2Tasks = generateTasksForProject('p2', 2, {
  'Develop concept proposals': { status: 'done', owner_user_id: 'u3' },
  'Review planning strategy': { status: 'in_progress', owner_user_id: 'u3', due_date: d(7) },
  'Coordinate initial consultant input': { status: 'not_started', owner_user_id: 'u5', due_date: d(14) },
  'Prepare outline specification': { status: 'not_started', due_date: d(21) },
  'Client concept sign-off': { status: 'not_started', owner_user_id: 'u3', due_date: d(-5) }, // overdue required!
})

// Project 3: Stage 4, behind schedule
const p3Tasks = generateTasksForProject('p3', 4, {
  'Complete technical design information': { status: 'in_progress', owner_user_id: 'u2', due_date: d(-10) }, // very overdue
  'Coordinate consultant technical input': { status: 'not_started', owner_user_id: undefined, due_date: d(-2) }, // overdue + no owner
  'Review issue package': { status: 'not_started', due_date: d(7) },
  'Prepare construction issue drawings': { status: 'not_started', due_date: d(14) },
  'Building control submission': { status: 'not_started', due_date: d(21) },
})

// Project 4: Stage 1, healthy and early
const p4Tasks = generateTasksForProject('p4', 1, {
  'Prepare project brief': { status: 'in_progress', owner_user_id: 'u3', due_date: d(10) },
  'Confirm site information': { status: 'done', owner_user_id: 'u5' },
  'Define project programme': { status: 'not_started', owner_user_id: 'u3', due_date: d(21) },
  'Appoint consultant team': { status: 'not_started', due_date: d(30) },
  'Prepare feasibility studies': { status: 'not_started', due_date: d(28) },
})

// Project 5: Stage 5, on site and progressing
const p5Tasks = generateTasksForProject('p5', 5, {
  'Record construction queries': { status: 'in_progress', owner_user_id: 'u2', due_date: d(7) },
  'Monitor site information flow': { status: 'in_progress', owner_user_id: 'u4', due_date: d(14) },
  'Review progress against design intent': { status: 'not_started', owner_user_id: 'u2', due_date: d(21) },
  'Review material submissions': { status: 'not_started', due_date: d(28) },
})

// Project 6: Paused, stale, stage 2 incomplete
const p6Tasks = generateTasksForProject('p6', 2, {
  'Develop concept proposals': { status: 'in_progress', owner_user_id: undefined, due_date: d(-45) }, // very overdue, no owner
  'Review planning strategy': { status: 'not_started', due_date: d(-30) },
  'Client concept sign-off': { status: 'not_started', due_date: d(-20) },
})

export const ALL_TASKS: Task[] = [
  ...p1Tasks,
  ...p2Tasks,
  ...p3Tasks,
  ...p4Tasks,
  ...p5Tasks,
  ...p6Tasks,
]

export function getProjectTasks(projectId: string): Task[] {
  return ALL_TASKS.filter(t => t.project_id === projectId)
}

export function getUser(userId: string): User | undefined {
  return USERS.find(u => u.id === userId)
}

export function getProject(projectId: string): Project | undefined {
  return PROJECTS.find(p => p.id === projectId)
}
