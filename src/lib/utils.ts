import { HealthStatus, TaskStatus, RiskSeverity, ApprovalStatus, IssueStatus, ChangeStatus, RiskRegisterStatus, ActionStatus, RiskProbability, RiskImpact, MeetingType, DesignRiskReviewStatus, ContractEventStatus, TenderStatus, SiteQueryStatus } from './types'

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
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
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
