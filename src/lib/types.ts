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

// ── Phase 2 Wave 3: Building Regulations Types ────────────────
export type BuildingRegStatus = 'not_submitted' | 'submitted' | 'in_progress' | 'approved' | 'rejected' | 'conditional'
export type BuildingRegRoute = 'full_plans' | 'building_notice' | 'initial_notice' | 'regularisation'

export interface BuildingRegRecord {
  id: string
  project_id: string
  submission_route: BuildingRegRoute
  reference: string
  title: string
  description: string
  submitted_date?: string
  decision_date?: string
  status: BuildingRegStatus
  inspector_name?: string
  inspection_notes?: string
  conditions?: string
  created_at: string
  updated_at: string
}

export type InspectionStatus = 'scheduled' | 'passed' | 'failed' | 'requires_revisit'

export interface BuildingInspection {
  id: string
  building_reg_id: string
  project_id: string
  inspection_type: string
  scheduled_date: string
  completed_date?: string
  status: InspectionStatus
  inspector_notes?: string
  follow_up_required: boolean
}

// ── Phase 2 Wave 3: BRPD / Dutyholder Coordination Types ─────
export type DutyholderRole = 'client' | 'principal_designer' | 'principal_contractor' | 'designer' | 'contractor'
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending_review' | 'not_applicable'

export interface DutyholderRecord {
  id: string
  project_id: string
  role: DutyholderRole
  organisation_name: string
  contact_name: string
  contact_email?: string
  appointed_date: string
  competence_evidence?: string
  compliance_status: ComplianceStatus
  notes?: string
}

export interface BRPDGateway {
  id: string
  project_id: string
  gateway_number: 1 | 2 | 3
  title: string
  description: string
  target_date: string
  completed_date?: string
  status: 'not_started' | 'in_progress' | 'submitted' | 'passed' | 'failed'
  evidence_notes?: string
}

// ── Phase 2 Wave 3: Enhanced Documents Types ──────────────────
export type DocumentCategory = 'drawing' | 'specification' | 'report' | 'correspondence' | 'certificate' | 'schedule' | 'other'
export type DocumentStatus = 'draft' | 'for_review' | 'approved' | 'superseded' | 'archived'

export interface DocumentRecord {
  id: string
  project_id: string
  title: string
  document_ref: string
  category: DocumentCategory
  status: DocumentStatus
  revision: string
  stage: RIBAStage
  uploaded_by_user_id: string
  file_url?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface DocumentTransmittal {
  id: string
  project_id: string
  transmittal_ref: string
  recipient: string
  issued_date: string
  document_ids: string[]
  purpose: 'for_information' | 'for_approval' | 'for_construction' | 'for_comment' | 'as_built'
  notes?: string
  status: 'draft' | 'issued' | 'acknowledged'
}

// ── Phase 3: Knowledge Base Types ────────────────────────────
export type KnowledgeCategory = 'lessons_learned' | 'office_procedure' | 'checklist' | 'reference_note' | 'fee_clause' | 'template' | 'guidance'

export interface KnowledgeArticle {
  id: string
  organisation_id: string
  title: string
  summary: string
  body_markdown: string
  category: KnowledgeCategory
  tags: string[]
  related_stage?: RIBAStage
  related_sector?: string
  related_contract_type?: string
  owner_user_id: string
  published_flag: boolean
  created_at: string
  updated_at: string
}

// ── Phase 3: CPD & Competence Types ──────────────────────────
export interface CPDRecord {
  id: string
  user_id: string
  title: string
  provider: string
  cpd_topic: string
  hours: number
  completion_date: string
  evidence_url?: string
  mandatory_flag: boolean
  notes?: string
}

export interface Competency {
  id: string
  organisation_id: string
  name: string
  category: string
  description: string
}

export interface UserCompetency {
  id: string
  user_id: string
  competency_id: string
  proficiency_level: 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert'
  evidence_url?: string
  last_reviewed_at: string
}

export interface TrainingPlan {
  id: string
  user_id: string
  title: string
  objective: string
  due_date: string
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue'
  manager_notes?: string
}

// ── Phase 3: Internationalisation Types ──────────────────────
export interface JurisdictionPack {
  id: string
  country: string
  region?: string
  language: string
  currency: string
  units: 'metric' | 'imperial'
  date_format: string
  stage_labels: Record<RIBAStage, string>
  terminology_notes?: string
  reference_guidance_notes?: string
}

export interface OrganisationSettings {
  id: string
  organisation_id: string
  default_currency: string
  default_units: 'metric' | 'imperial'
  date_format: string
  jurisdiction_pack_id?: string
  project_number_template?: string
  terminology_overrides?: Record<string, string>
}

// ── Phase 3: Admin Controls Types ────────────────────────────
export type AISourceCategory = 'project_data' | 'project_documents' | 'knowledge_base' | 'reference_uploads' | 'fee_data'

export interface AISourcePermission {
  id: string
  organisation_id: string
  source_category: AISourceCategory
  enabled: boolean
  updated_at: string
}

export interface AILog {
  id: string
  organisation_id: string
  user_id: string
  project_id?: string
  prompt: string
  response_summary: string
  source_categories_used: AISourceCategory[]
  confidence_level: 'high' | 'medium' | 'low'
  created_at: string
}

// ── Phase 3 Wave 2: Drawing Issue Intelligence Types ────────
export type DrawingIssueType = 'planning' | 'sketch' | 'working' | 'as_built' | 'tender' | 'construction' | 'custom'

export interface DrawingIssueRecord {
  id: string
  project_id: string
  drawing_ref: string
  drawing_title: string
  issue_type: DrawingIssueType
  stage: RIBAStage
  issued_date: string
  issued_to: string
  revision: string
  supersedes?: string
  notes?: string
  created_by_user_id: string
}

// ── Phase 3 Wave 2: Commercial Reporting Types ──────────────
export type CommercialHealthFlag = 'healthy' | 'watch' | 'at_risk' | 'critical'

export interface ProjectCommercial {
  id: string
  project_id: string
  agreed_fee: number
  fee_invoiced: number
  fee_paid: number
  wip_value: number
  expenses: number
  time_logged_hours: number
  estimated_hours_remaining: number
  approved_variations: number
  current_margin_percent: number
  forecast_margin_percent: number
  stage_overspend_flag: boolean
  health_flag: CommercialHealthFlag
  last_updated: string
}

export interface CashflowForecast {
  id: string
  organisation_id: string
  month: string
  projected_income: number
  projected_expenses: number
  actual_income?: number
  actual_expenses?: number
  pipeline_value: number
}

// ── Phase 3 Wave 2: Staffing & Utilisation Types ────────────
export interface StaffAllocation {
  id: string
  user_id: string
  project_id: string
  stage: RIBAStage
  hours_per_week: number
  start_date: string
  end_date: string
  role_on_project: string
}

export interface StaffCapacity {
  user_id: string
  name: string
  role: string
  weekly_capacity_hours: number
  allocated_hours: number
  utilisation_percent: number
  status: 'under' | 'optimal' | 'over'
}

export type UtilisationStatus = 'under' | 'optimal' | 'over'

// ── Phase 3 Wave 3: Fee Recommendation Types ────────────────
export interface FeeRecommendation {
  id: string
  organisation_id: string
  project_type: string
  sector: string
  scale_estimate: number
  procurement_route: string
  complexity: 'low' | 'medium' | 'high'
  stage_scope: string
  staffing_mix_notes: string
  overhead_percent: number
  margin_percent: number
  recommended_fee_low: number
  recommended_fee_high: number
  recommended_stage_split: Record<string, number>
  confidence_level: 'high' | 'medium' | 'low'
  similar_project_ids: string[]
  notes?: string
  created_at: string
  created_by_user_id: string
}

// ── Phase 3 Wave 3: Fee Quote Types ─────────────────────────
export type FeeQuoteStatus = 'draft' | 'issued' | 'revised' | 'accepted' | 'superseded'

export interface FeeQuoteRecord {
  id: string
  organisation_id: string
  related_project_id?: string
  related_opportunity_id?: string
  quote_reference: string
  status: FeeQuoteStatus
  fee_basis: string
  total_fee: number
  exclusions_text: string
  terms_text: string
  issued_date?: string
  valid_until?: string
  created_by_user_id: string
  updated_at: string
}

export interface FeeQuoteLineItem {
  id: string
  fee_quote_record_id: string
  sort_order: number
  line_type: 'stage' | 'service' | 'expense' | 'discount'
  title: string
  description: string
  quantity?: number
  unit?: string
  rate?: number
  amount: number
  related_stage?: RIBAStage
}

// ── Phase 3 Wave 3: Opportunities / Proposals Types ─────────
export type OpportunityStatus = 'lead' | 'qualifying' | 'proposal_sent' | 'negotiation' | 'won' | 'lost' | 'dormant'

export interface Opportunity {
  id: string
  organisation_id: string
  title: string
  client_name: string
  sector: string
  estimated_value: number
  status: OpportunityStatus
  expected_start_date?: string
  likelihood_percentage: number
  owner_user_id: string
  notes?: string
  linked_quote_ids: string[]
  created_at: string
  updated_at: string
}

// ── Phase 3 Wave 4: AI Teammate Types ─────────────────────
export type AIMessageRole = 'user' | 'assistant' | 'system'

export interface AIConversation {
  id: string
  organisation_id: string
  project_id?: string // null = global, set = project-scoped
  title: string
  started_by_user_id: string
  messages: AIMessage[]
  created_at: string
  updated_at: string
}

export interface AIMessage {
  id: string
  conversation_id: string
  role: AIMessageRole
  content: string
  sources?: AISource[]
  timestamp: string
}

export interface AISource {
  type: 'project' | 'task' | 'document' | 'knowledge' | 'risk' | 'regulation'
  title: string
  reference_id: string
  url?: string
}

export interface AISuggestedPrompt {
  id: string
  label: string
  prompt: string
  scope: 'global' | 'project'
  category: string
}

// ── Phase 3 Wave 4: Integrations Types ────────────────────
export type IntegrationProvider = 'xero' | 'quickbooks' | 'outlook' | 'google_calendar' | 'sharepoint' | 'dropbox'
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'syncing'

export interface Integration {
  id: string
  organisation_id: string
  provider: IntegrationProvider
  display_name: string
  description: string
  status: IntegrationStatus
  connected_by_user_id?: string
  connected_at?: string
  last_sync_at?: string
  sync_frequency_minutes?: number
  config: Record<string, string>
  category: 'accounting' | 'calendar' | 'storage'
}

// ── Phase 3 Wave 4: External Collaboration Portal Types ───
export type PortalAccessLevel = 'view_only' | 'comment' | 'approve'

export interface PortalInvite {
  id: string
  project_id: string
  email: string
  name: string
  organisation: string
  role: string // e.g. 'Client', 'Structural Engineer', 'Planning Consultant'
  access_level: PortalAccessLevel
  invited_by_user_id: string
  accepted: boolean
  invited_at: string
  last_accessed_at?: string
}

export interface PortalSharedItem {
  id: string
  project_id: string
  item_type: 'document' | 'approval' | 'drawing' | 'report' | 'meeting_minutes'
  item_id: string
  title: string
  shared_at: string
  shared_by_user_id: string
  visible_to_portal_invite_ids: string[]
  requires_sign_off: boolean
  signed_off_by?: string
  signed_off_at?: string
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
