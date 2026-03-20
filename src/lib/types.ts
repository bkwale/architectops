// ── Core Types ──────────────────────────────────────────────

export type Role = 'admin' | 'practice_owner' | 'project_lead' | 'team_member'

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'

export type TaskStatus = 'not_started' | 'in_progress' | 'done' | 'blocked'

export type RiskSeverity = 'low' | 'medium' | 'high'

export type HealthStatus = 'green' | 'amber' | 'red'

export type RIBAStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

// ── Models ──────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  client: string
  description?: string
  start_date: string
  target_completion_date?: string
  current_stage: RIBAStage
  status: ProjectStatus
  project_lead_user_id?: string
  created_by_user_id: string
  created_at: string
  updated_at: string
  last_activity_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  stage: RIBAStage
  status: TaskStatus
  owner_user_id?: string
  due_date?: string
  required_flag: boolean
  created_at: string
  updated_at: string
}

export interface RiskAlert {
  id: string
  project_id: string
  task_id?: string
  title: string
  description: string
  severity: RiskSeverity
  source_type: string
  resolved_flag: boolean
  suggested_action?: string
  created_at: string
  updated_at: string
}

// ── Computed / Dashboard Types ──────────────────────────────

export interface ProjectDashboard {
  project: Project
  lead?: User
  overall_completion: number
  stage_completion: number
  total_tasks: number
  tasks_by_status: Record<TaskStatus, number>
  overdue_tasks: Task[]
  required_outstanding: Task[]
  risks: RiskAlert[]
  health: HealthStatus
  next_actions: Task[]
}

export interface PracticeOverview {
  total_active: number
  projects_by_stage: Record<number, number>
  high_risk_count: number
  overdue_tasks_count: number
  project_summaries: ProjectSummary[]
}

export interface ProjectSummary {
  project: Project
  lead?: User
  completion: number
  stage_completion: number
  open_risks: number
  overdue_tasks: number
  health: HealthStatus
}

// ── RIBA Stage Info ─────────────────────────────────────────

export const RIBA_STAGES: Record<RIBAStage, string> = {
  0: 'Strategic Definition',
  1: 'Preparation & Briefing',
  2: 'Concept Design',
  3: 'Spatial Coordination',
  4: 'Technical Design',
  5: 'Manufacturing & Construction',
  6: 'Handover',
  7: 'Use',
}

export const RIBA_STAGE_COLORS: Record<RIBAStage, string> = {
  0: '#6366f1', // indigo
  1: '#8b5cf6', // violet
  2: '#0ea5e9', // sky
  3: '#06b6d4', // cyan
  4: '#0c85f1', // brand blue
  5: '#f59e0b', // amber
  6: '#10b981', // emerald
  7: '#6b7280', // gray
}
