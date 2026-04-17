import { HealthStatus, TaskStatus, RiskSeverity, ApprovalStatus, IssueStatus, ChangeStatus, RiskRegisterStatus, ActionStatus, RiskProbability, RiskImpact, MeetingType, DesignRiskReviewStatus, ContractEventStatus, TenderStatus, SiteQueryStatus, BuildingRegStatus, InspectionStatus, ComplianceStatus, DocumentStatus, KnowledgeCategory, DutyholderRole, DrawingIssueType, CommercialHealthFlag, UtilisationStatus, FeeQuoteStatus, OpportunityStatus, IntegrationStatus, QuoteSectionType, FeeQuoteRecord } from './types'

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function healthColor(h: HealthStatus): string {
  switch (h) {
    case 'green': return 'bg-emerald-100 text-emerald-800'
    case 'amber': return 'bg-amber-100 text-amber-800'
    case 'red': return 'bg-red-100 text-red-800'
  }
}

export function healthDot(h: HealthStatus): string {
  switch (h) {
    case 'green': return 'bg-emerald-500'
    case 'amber': return 'bg-amber-500'
    case 'red': return 'bg-red-500'
  }
}

export function statusLabel(s: TaskStatus): string {
  switch (s) {
    case 'not_started': return 'Not Started'
    case 'in_progress': return 'In Progress'
    case 'done': return 'Done'
    case 'blocked': return 'Blocked'
  }
}

export function statusColor(s: TaskStatus): string {
  switch (s) {
    case 'not_started': return 'bg-slate-100 text-slate-600'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'done': return 'bg-emerald-100 text-emerald-700'
    case 'blocked': return 'bg-red-100 text-red-700'
  }
}

export function severityColor(s: RiskSeverity): string {
  switch (s) {
    case 'low': return 'bg-slate-100 text-slate-600 border-slate-200'
    case 'medium': return 'bg-amber-50 text-amber-800 border-amber-200'
    case 'high': return 'bg-red-50 text-red-800 border-red-200'
  }
}

export function severityDot(s: RiskSeverity): string {
  switch (s) {
    case 'low': return 'bg-slate-400'
    case 'medium': return 'bg-amber-500'
    case 'high': return 'bg-red-500'
  }
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff === 0 ? 0 : diff // avoid -0
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  return formatDate(dateStr)
}

// ── Phase 2 Utilities ────────────────────────────────────────

export function approvalStatusColor(s: ApprovalStatus): string {
  switch (s) {
    case 'pending': return 'bg-amber-100 text-amber-700'
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'returned': return 'bg-red-100 text-red-700'
  }
}

export function approvalStatusLabel(s: ApprovalStatus): string {
  switch (s) {
    case 'pending': return 'Awaiting Review'
    case 'approved': return 'Approved'
    case 'returned': return 'Returned'
  }
}

export function issueStatusColor(s: IssueStatus): string {
  switch (s) {
    case 'open': return 'bg-red-100 text-red-700'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'resolved': return 'bg-emerald-100 text-emerald-700'
    case 'closed': return 'bg-slate-100 text-slate-600'
  }
}

export function changeStatusColor(s: ChangeStatus): string {
  switch (s) {
    case 'raised': return 'bg-amber-100 text-amber-700'
    case 'under_review': return 'bg-blue-100 text-blue-700'
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'rejected': return 'bg-red-100 text-red-700'
  }
}

export function riskRegisterStatusColor(s: RiskRegisterStatus): string {
  switch (s) {
    case 'open': return 'bg-red-100 text-red-700'
    case 'mitigated': return 'bg-amber-100 text-amber-700'
    case 'closed': return 'bg-slate-100 text-slate-600'
  }
}

export function actionStatusColor(s: ActionStatus): string {
  switch (s) {
    case 'open': return 'bg-blue-100 text-blue-700'
    case 'done': return 'bg-emerald-100 text-emerald-700'
    case 'overdue': return 'bg-red-100 text-red-700'
  }
}

export function riskScoreColor(probability: RiskProbability, impact: RiskImpact): string {
  const score = { low: 1, medium: 2, high: 3 }
  const total = score[probability] * score[impact]
  if (total >= 6) return 'bg-red-500'
  if (total >= 3) return 'bg-amber-500'
  return 'bg-emerald-500'
}

export function meetingTypeLabel(t: MeetingType): string {
  switch (t) {
    case 'design_team': return 'Design Team'
    case 'client_review': return 'Client Review'
    case 'site_meeting': return 'Site Meeting'
    case 'consultant': return 'Consultant'
    case 'contractor': return 'Contractor'
    case 'other': return 'Other'
  }
}

export function meetingTypeColor(t: MeetingType): string {
  switch (t) {
    case 'design_team': return 'bg-brand-100 text-brand-700'
    case 'client_review': return 'bg-violet-100 text-violet-700'
    case 'site_meeting': return 'bg-amber-100 text-amber-700'
    case 'consultant': return 'bg-cyan-100 text-cyan-700'
    case 'contractor': return 'bg-orange-100 text-orange-700'
    case 'other': return 'bg-slate-100 text-slate-600'
  }
}

// ── Phase 2 Wave 2 Utilities ─────────────────────────────────

export function designRiskStatusColor(s: DesignRiskReviewStatus): string {
  switch (s) {
    case 'open': return 'bg-red-100 text-red-700'
    case 'under_review': return 'bg-amber-100 text-amber-700'
    case 'accepted': return 'bg-emerald-100 text-emerald-700'
    case 'closed': return 'bg-slate-100 text-slate-600'
  }
}

export function contractEventStatusColor(s: ContractEventStatus): string {
  switch (s) {
    case 'draft': return 'bg-slate-100 text-slate-600'
    case 'issued': return 'bg-blue-100 text-blue-700'
    case 'responded': return 'bg-emerald-100 text-emerald-700'
    case 'overdue': return 'bg-red-100 text-red-700'
    case 'closed': return 'bg-slate-100 text-slate-500'
  }
}

export function tenderStatusColor(s: TenderStatus): string {
  switch (s) {
    case 'preparation': return 'bg-slate-100 text-slate-600'
    case 'issued': return 'bg-blue-100 text-blue-700'
    case 'returned': return 'bg-amber-100 text-amber-700'
    case 'evaluation': return 'bg-violet-100 text-violet-700'
    case 'awarded': return 'bg-emerald-100 text-emerald-700'
    case 'cancelled': return 'bg-red-100 text-red-700'
  }
}

export function siteQueryStatusColor(s: SiteQueryStatus): string {
  switch (s) {
    case 'open': return 'bg-red-100 text-red-700'
    case 'responded': return 'bg-blue-100 text-blue-700'
    case 'closed': return 'bg-slate-100 text-slate-600'
  }
}

// ── Phase 2 Wave 3 Utilities ────────────────────────────────

export function buildingRegStatusColor(s: BuildingRegStatus): string {
  switch (s) {
    case 'not_submitted': return 'bg-slate-100 text-slate-600'
    case 'submitted': return 'bg-blue-100 text-blue-700'
    case 'in_progress': return 'bg-amber-100 text-amber-700'
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    case 'conditional': return 'bg-violet-100 text-violet-700'
  }
}

export function inspectionStatusColor(s: InspectionStatus): string {
  switch (s) {
    case 'scheduled': return 'bg-blue-100 text-blue-700'
    case 'passed': return 'bg-emerald-100 text-emerald-700'
    case 'failed': return 'bg-red-100 text-red-700'
    case 'requires_revisit': return 'bg-amber-100 text-amber-700'
  }
}

export function complianceStatusColor(s: ComplianceStatus): string {
  switch (s) {
    case 'compliant': return 'bg-emerald-100 text-emerald-700'
    case 'non_compliant': return 'bg-red-100 text-red-700'
    case 'pending_review': return 'bg-amber-100 text-amber-700'
    case 'not_applicable': return 'bg-slate-100 text-slate-500'
  }
}

export function documentStatusColor(s: DocumentStatus): string {
  switch (s) {
    case 'draft': return 'bg-slate-100 text-slate-600'
    case 'for_review': return 'bg-amber-100 text-amber-700'
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'superseded': return 'bg-violet-100 text-violet-700'
    case 'archived': return 'bg-slate-100 text-slate-500'
  }
}

export function knowledgeCategoryLabel(c: KnowledgeCategory): string {
  switch (c) {
    case 'lessons_learned': return 'Lessons Learned'
    case 'office_procedure': return 'Office Procedure'
    case 'checklist': return 'Checklist'
    case 'reference_note': return 'Reference Note'
    case 'fee_clause': return 'Fee Clause'
    case 'template': return 'Template'
    case 'guidance': return 'Guidance'
  }
}

export function knowledgeCategoryColor(c: KnowledgeCategory): string {
  switch (c) {
    case 'lessons_learned': return 'bg-amber-100 text-amber-700'
    case 'office_procedure': return 'bg-blue-100 text-blue-700'
    case 'checklist': return 'bg-emerald-100 text-emerald-700'
    case 'reference_note': return 'bg-violet-100 text-violet-700'
    case 'fee_clause': return 'bg-cyan-100 text-cyan-700'
    case 'template': return 'bg-orange-100 text-orange-700'
    case 'guidance': return 'bg-indigo-100 text-indigo-700'
  }
}

export function trainingPlanStatusColor(s: 'not_started' | 'in_progress' | 'completed' | 'overdue'): string {
  switch (s) {
    case 'not_started': return 'bg-slate-100 text-slate-600'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'completed': return 'bg-emerald-100 text-emerald-700'
    case 'overdue': return 'bg-red-100 text-red-700'
  }
}

export function proficiencyLabel(l: 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert'): string {
  return l.charAt(0).toUpperCase() + l.slice(1)
}

export function proficiencyColor(l: 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert'): string {
  switch (l) {
    case 'none': return 'bg-slate-100 text-slate-500'
    case 'basic': return 'bg-amber-100 text-amber-700'
    case 'intermediate': return 'bg-blue-100 text-blue-700'
    case 'advanced': return 'bg-emerald-100 text-emerald-700'
    case 'expert': return 'bg-violet-100 text-violet-700'
  }
}

export function gatewayStatusColor(s: 'not_started' | 'in_progress' | 'submitted' | 'passed' | 'failed'): string {
  switch (s) {
    case 'not_started': return 'bg-slate-100 text-slate-600'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'submitted': return 'bg-amber-100 text-amber-700'
    case 'passed': return 'bg-emerald-100 text-emerald-700'
    case 'failed': return 'bg-red-100 text-red-700'
  }
}

export function transmittalStatusColor(s: 'draft' | 'issued' | 'acknowledged'): string {
  switch (s) {
    case 'draft': return 'bg-slate-100 text-slate-600'
    case 'issued': return 'bg-blue-100 text-blue-700'
    case 'acknowledged': return 'bg-emerald-100 text-emerald-700'
  }
}

export function dutyholderRoleLabel(r: DutyholderRole): string {
  switch (r) {
    case 'client': return 'Client'
    case 'principal_designer': return 'Principal Designer'
    case 'principal_contractor': return 'Principal Contractor'
    case 'designer': return 'Designer'
    case 'contractor': return 'Contractor'
  }
}

// ── Phase 3 Wave 2 Utilities ────────────────────────────────

export function drawingIssueTypeLabel(t: DrawingIssueType): string {
  switch (t) {
    case 'planning': return 'Planning'
    case 'sketch': return 'Sketch'
    case 'working': return 'Working'
    case 'as_built': return 'As Built'
    case 'tender': return 'Tender'
    case 'construction': return 'Construction'
    case 'custom': return 'Custom'
  }
}

export function drawingIssueTypeColor(t: DrawingIssueType): string {
  switch (t) {
    case 'planning': return 'bg-indigo-100 text-indigo-700'
    case 'sketch': return 'bg-slate-100 text-slate-600'
    case 'working': return 'bg-blue-100 text-blue-700'
    case 'as_built': return 'bg-emerald-100 text-emerald-700'
    case 'tender': return 'bg-amber-100 text-amber-700'
    case 'construction': return 'bg-orange-100 text-orange-700'
    case 'custom': return 'bg-violet-100 text-violet-700'
  }
}

export function commercialHealthColor(h: CommercialHealthFlag): string {
  switch (h) {
    case 'healthy': return 'bg-emerald-100 text-emerald-700'
    case 'watch': return 'bg-amber-100 text-amber-700'
    case 'at_risk': return 'bg-orange-100 text-orange-700'
    case 'critical': return 'bg-red-100 text-red-700'
  }
}

export function commercialHealthDot(h: CommercialHealthFlag): string {
  switch (h) {
    case 'healthy': return 'bg-emerald-500'
    case 'watch': return 'bg-amber-500'
    case 'at_risk': return 'bg-orange-500'
    case 'critical': return 'bg-red-500'
  }
}

export function utilisationColor(s: UtilisationStatus): string {
  switch (s) {
    case 'under': return 'bg-blue-100 text-blue-700'
    case 'optimal': return 'bg-emerald-100 text-emerald-700'
    case 'over': return 'bg-red-100 text-red-700'
  }
}

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%'
}

// ── Phase 3 Wave 3 Utilities ────────────────────────────────

export function feeQuoteStatusColor(s: FeeQuoteStatus): string {
  switch (s) {
    case 'draft': return 'bg-slate-100 text-slate-600'
    case 'sent': return 'bg-blue-100 text-blue-700'
    case 'viewed': return 'bg-indigo-100 text-indigo-700'
    case 'revised': return 'bg-amber-100 text-amber-700'
    case 'accepted': return 'bg-emerald-100 text-emerald-700'
    case 'declined': return 'bg-red-100 text-red-700'
    case 'expired': return 'bg-slate-100 text-slate-400'
    case 'superseded': return 'bg-violet-100 text-violet-700'
  }
}

export function feeQuoteStatusLabel(s: FeeQuoteStatus): string {
  switch (s) {
    case 'draft': return 'Draft'
    case 'sent': return 'Sent'
    case 'viewed': return 'Viewed'
    case 'revised': return 'Revised'
    case 'accepted': return 'Accepted'
    case 'declined': return 'Declined'
    case 'expired': return 'Expired'
    case 'superseded': return 'Superseded'
  }
}

export function opportunityStatusColor(s: OpportunityStatus): string {
  switch (s) {
    case 'lead': return 'bg-slate-100 text-slate-600'
    case 'qualifying': return 'bg-blue-100 text-blue-700'
    case 'proposal_sent': return 'bg-indigo-100 text-indigo-700'
    case 'negotiation': return 'bg-amber-100 text-amber-700'
    case 'won': return 'bg-emerald-100 text-emerald-700'
    case 'lost': return 'bg-red-100 text-red-700'
    case 'dormant': return 'bg-slate-100 text-slate-500'
  }
}

export function opportunityStatusLabel(s: OpportunityStatus): string {
  switch (s) {
    case 'lead': return 'Lead'
    case 'qualifying': return 'Qualifying'
    case 'proposal_sent': return 'Proposal Sent'
    case 'negotiation': return 'Negotiation'
    case 'won': return 'Won'
    case 'lost': return 'Lost'
    case 'dormant': return 'Dormant'
  }
}

export function confidenceBadgeColor(c: 'high' | 'medium' | 'low'): string {
  switch (c) {
    case 'high': return 'bg-emerald-100 text-emerald-700'
    case 'medium': return 'bg-amber-100 text-amber-700'
    case 'low': return 'bg-red-100 text-red-700'
  }
}

// ── Phase 4 Wave 1 Utilities ───────────────────────────────────

export function quoteSectionTypeLabel(s: QuoteSectionType): string {
  const labels: Record<QuoteSectionType, string> = {
    cover: 'Cover / Introduction',
    project_understanding: 'Project Understanding',
    scope_of_service: 'Scope of Service',
    stage_breakdown: 'Stage Breakdown',
    optional_extras: 'Optional Extras',
    consultant_coordination: 'Consultant Coordination',
    programme_assumptions: 'Programme Assumptions',
    design_freeze_note: 'Design Freeze Note',
    meetings_and_communication: 'Meetings & Communication',
    expenses_and_travel: 'Expenses & Travel',
    exclusions: 'Exclusions',
    terms_and_conditions: 'Terms & Conditions',
    payment_terms: 'Payment Terms',
    acceptance: 'Acceptance / Next Steps',
  }
  return labels[s]
}

export function numberingPreview(format: string, sampleSeq?: number): string {
  const year = new Date().getFullYear().toString()
  const shortYear = year.slice(-2)
  let result = format
    .replace('{YEAR}', year)
    .replace('{YY}', shortYear)
    .replace('{PROJECT}', 'MA-2025-001')

  const seqMatch = result.match(/\{SEQ:(\d+)\}/)
  if (seqMatch) {
    const pad = parseInt(seqMatch[1])
    const seq = (sampleSeq || 1).toString().padStart(pad, '0')
    result = result.replace(seqMatch[0], seq)
  }
  return result
}

export function quoteNeedsFollowUp(quote: { status: FeeQuoteStatus; sent_at?: string; viewed_count: number; valid_until: string }): boolean {
  if (quote.status === 'sent' && quote.viewed_count === 0) {
    const daysSinceSent = quote.sent_at ? Math.floor((Date.now() - new Date(quote.sent_at).getTime()) / 86400000) : 0
    return daysSinceSent > 3
  }
  if (quote.status === 'viewed') {
    const daysUntilExpiry = Math.floor((new Date(quote.valid_until).getTime() - Date.now()) / 86400000)
    return daysUntilExpiry < 7
  }
  return false
}

export function healthScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-600'
  if (score >= 50) return 'text-amber-600'
  return 'text-red-600'
}

export function healthScoreBg(score: number): string {
  if (score >= 75) return 'bg-emerald-100'
  if (score >= 50) return 'bg-amber-100'
  return 'bg-red-100'
}

// ── Phase 3 Wave 4 Utilities ───────────────────────────────

export function integrationStatusColor(s: IntegrationStatus): string {
  switch (s) {
    case 'connected': return 'bg-emerald-100 text-emerald-700'
    case 'disconnected': return 'bg-slate-100 text-slate-500'
    case 'error': return 'bg-red-100 text-red-700'
    case 'syncing': return 'bg-blue-100 text-blue-700'
  }
}

export function integrationStatusLabel(s: IntegrationStatus): string {
  switch (s) {
    case 'connected': return 'Connected'
    case 'disconnected': return 'Not Connected'
    case 'error': return 'Error'
    case 'syncing': return 'Syncing'
  }
}

export function integrationStatusDot(s: IntegrationStatus): string {
  switch (s) {
    case 'connected': return 'bg-emerald-500'
    case 'disconnected': return 'bg-slate-300'
    case 'error': return 'bg-red-500'
    case 'syncing': return 'bg-blue-500 animate-pulse'
  }
}

export function portalAccessLabel(level: 'view_only' | 'comment' | 'approve'): string {
  switch (level) {
    case 'view_only': return 'View Only'
    case 'comment': return 'Comment'
    case 'approve': return 'Approve'
  }
}

export function portalAccessColor(level: 'view_only' | 'comment' | 'approve'): string {
  switch (level) {
    case 'view_only': return 'bg-slate-100 text-slate-600'
    case 'comment': return 'bg-blue-100 text-blue-700'
    case 'approve': return 'bg-emerald-100 text-emerald-700'
  }
}

export function portalItemTypeIcon(type: 'document' | 'approval' | 'drawing' | 'report' | 'meeting_minutes'): string {
  switch (type) {
    case 'document': return '📄'
    case 'approval': return '✅'
    case 'drawing': return '📐'
    case 'report': return '📊'
    case 'meeting_minutes': return '📝'
  }
}

