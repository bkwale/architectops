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

// ── Phase 2: Approval Types ─────────────────────────────────

export type ApprovalStatus = 'pending' | 'approved' | 'returned'

export interface ApprovalRequest {
  id: string
  project_id: string
  item_type: 'task' | 'document'
  item_id: string
  item_title: string
  submitted_by_user_id: string
  reviewer_user_id: string
  status: ApprovalStatus
  submitted_at: string
  reviewed_at?: string
  reviewer_comments?: string
  created_at: string
  updated_at: string
}

// ── Phase 2: Issues / Changes / Risks Types ─────────────────

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type ChangeStatus = 'raised' | 'under_review' | 'approved' | 'rejected'
export type RiskRegisterStatus = 'open' | 'mitigated' | 'closed'
export type RiskProbability = 'low' | 'medium' | 'high'
export type RiskImpact = 'low' | 'medium' | 'high'

export interface Issue {
  id: string
  project_id: string
  issue_type: string
  title: string
  description: string
  owner_user_id: string
  status: IssueStatus
  raised_date: string
  resolved_date?: string
}

export interface Change {
  id: string
  project_id: string
  change_type: string
  title: string
  description: string
  initiated_by_user_id: string
  date_raised: string
  commercial_effect_note?: string
  programme_effect_note?: string
  approval_status: ChangeStatus
}

export interface RiskRegisterItem {
  id: string
  project_id: string
  risk_type: string
  title: string
  description: string
  probability: RiskProbability
  impact: RiskImpact
  owner_user_id: string
  mitigation: string
  status: RiskRegisterStatus
}

// ── Phase 2: Meeting Types ──────────────────────────────────

export type MeetingType = 'design_team' | 'client_review' | 'site_meeting' | 'consultant' | 'contractor' | 'other'
export type ActionStatus = 'open' | 'done' | 'overdue'

export interface Meeting {
  id: string
  project_id: string
  meeting_type: MeetingType
  title: string
  meeting_date: string
  location: string
  organiser_user_id: string
  notes?: string
}

export interface MeetingAction {
  id: string
  meeting_id: string
  task_id?: string
  action_description: string
  assigned_to_user_id: string
  due_date: string
  status: ActionStatus
}

// ── Phase 2 Wave 2: Design Risk Types ───────────────────────

export type DesignRiskReviewStatus = 'open' | 'under_review' | 'accepted' | 'closed'

export interface DesignRisk {
  id: string
  project_id: string
  stage_code: RIBAStage
  title: string
  description: string
  unusual_or_significant_flag: boolean
  mitigation: string
  residual_risk_note?: string
  owner_user_id: string
  review_status: DesignRiskReviewStatus
  created_at: string
  updated_at: string
}

// ── Phase 2 Wave 2: Contract Administration Types ───────────

export type ProcurementRoute = 'traditional' | 'design_and_build' | 'management' | 'construction_management'
export type ContractForm = 'JCT_SBC' | 'JCT_MW' | 'JCT_DB' | 'NEC3' | 'NEC4' | 'other'
export type ContractEventStatus = 'draft' | 'issued' | 'responded' | 'overdue' | 'closed'

export interface ContractAdminRecord {
  id: string
  project_id: string
  procurement_route: ProcurementRoute
  contract_form: ContractForm
  administrator_role: string
  key_dates_json: string
  notes?: string
}

export interface ContractEvent {
  id: string
  project_id: string
  event_type: string
  event_ref: string
  title: string
  description: string
  issue_date: string
  response_due_date: string
  status: ContractEventStatus
  created_by_user_id: string
  created_at: string
  updated_at: string
}

// ── Phase 2 Wave 2: Planning & Site Context Types ───────────

export interface PlanningRecord {
  id: string
  project_id: string
  record_type: string
  reference: string
  title: string
  description: string
  date_submitted?: string
  date_determined?: string
  status: string
  notes?: string
}

export interface SiteConstraint {
  id: string
  project_id: string
  constraint_type: string
  title: string
  description: string
  severity: RiskSeverity
  mitigation?: string
}

// ── Phase 2 Wave 2: Tender Types ────────────────────────────

export type TenderStatus = 'preparation' | 'issued' | 'returned' | 'evaluation' | 'awarded' | 'cancelled'

export interface TenderRecord {
  id: string
  project_id: string
  tender_name: string
  procurement_route: string
  itt_issue_date?: string
  return_date?: string
  status: TenderStatus
  notes?: string
}

export interface TenderReturn {
  id: string
  tender_record_id: string
  bidder_name: string
  return_date: string
  compliance_status: string
  price_summary: string
  notes?: string
}

export interface TenderEvaluation {
  id: string
  tender_return_id: string
  criterion_name: string
  weighting: number
  score: number
  evaluator_user_id: string
  notes?: string
}

// ── Phase 2 Wave 2: Site Query Types ────────────────────────

export type SiteQueryStatus = 'open' | 'responded' | 'closed'

export interface SiteQuery {
  id: string
  project_id: string
  title: string
  description: string
  raised_by_user_id: string
  owner_user_id: string
  due_date: string
  status: SiteQueryStatus
  response_notes?: string
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
