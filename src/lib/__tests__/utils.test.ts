import { describe, it, expect } from 'vitest'
import {
  cn,
  healthColor, healthDot,
  statusLabel, statusColor,
  severityColor, severityDot,
  formatDate, daysUntil, isOverdue, timeAgo,
  feeQuoteStatusColor, feeQuoteStatusLabel,
  quoteSectionTypeLabel,
  numberingPreview,
  quoteNeedsFollowUp,
  healthScoreColor, healthScoreBg,
  integrationStatusColor, integrationStatusLabel, integrationStatusDot,
  portalAccessLabel, portalAccessColor,
  formatCurrency, formatPercent,
  opportunityStatusColor, opportunityStatusLabel,
  confidenceBadgeColor,
  healthAlertSeverityColor, healthAlertSeverityDot,
  healthAlertCategoryLabel, healthAlertCategoryIcon,
  burnRatioColor, burnRatioBg, varianceColor, formatBurnRatio,
  complianceStatementStatusColor, complianceStatementStatusLabel,
  brpdRequirementStatusColor, brpdRequirementStatusLabel,
  brpdChangeTypeLabel, brpdChangeTypeColor,
  drawingWorkflowStatusColor, drawingWorkflowStatusLabel,
  drawingEmailDirectionLabel, drawingEmailDirectionColor,
  requirementCategoryLabel, requirementCategoryColor,
} from '../utils'

describe('cn (class name helper)', () => {
  it('joins class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('filters out falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })
  it('returns empty string with no valid inputs', () => {
    expect(cn(false, undefined)).toBe('')
  })
})

describe('formatDate', () => {
  it('formats ISO date to en-GB', () => {
    const result = formatDate('2025-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('2025')
    expect(result).toContain('15')
  })
})

describe('daysUntil', () => {
  it('returns positive number for future dates', () => {
    const futureDate = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
    const days = daysUntil(futureDate)
    expect(days).toBeGreaterThan(0)
  })
  it('returns negative number for past dates', () => {
    const pastDate = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
    const days = daysUntil(pastDate)
    expect(days).toBeLessThan(0)
  })
  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0]
    const days = daysUntil(today)
    expect(days).toBe(0)
  })
})

describe('isOverdue', () => {
  it('returns true for past dates', () => {
    expect(isOverdue('2020-01-01')).toBe(true)
  })
  it('returns false for future dates', () => {
    expect(isOverdue('2030-01-01')).toBe(false)
  })
  it('returns false for undefined', () => {
    expect(isOverdue(undefined)).toBe(false)
  })
})

describe('timeAgo', () => {
  it('returns "just now" for very recent timestamps', () => {
    const justNow = new Date(Date.now() - 10000).toISOString()
    expect(timeAgo(justNow)).toBe('just now')
  })
  it('returns minutes for timestamps within the hour', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString()
    expect(timeAgo(fiveMinutesAgo)).toContain('m ago')
  })
  it('returns hours for timestamps within a day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString()
    expect(timeAgo(twoHoursAgo)).toContain('h ago')
  })
  it('returns days for older timestamps', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString()
    expect(timeAgo(threeDaysAgo)).toContain('d ago')
  })
})

describe('feeQuoteStatusColor', () => {
  it('returns correct color for all 8 statuses', () => {
    const statuses = ['draft', 'sent', 'viewed', 'revised', 'accepted', 'declined', 'expired', 'superseded'] as const
    statuses.forEach(s => {
      const result = feeQuoteStatusColor(s)
      expect(result).toBeTruthy()
      expect(result).toContain('bg-')
      expect(result).toContain('text-')
    })
  })
})

describe('feeQuoteStatusLabel', () => {
  it('returns correct label for all 8 statuses', () => {
    expect(feeQuoteStatusLabel('draft')).toBe('Draft')
    expect(feeQuoteStatusLabel('sent')).toBe('Sent')
    expect(feeQuoteStatusLabel('viewed')).toBe('Viewed')
    expect(feeQuoteStatusLabel('revised')).toBe('Revised')
    expect(feeQuoteStatusLabel('accepted')).toBe('Accepted')
    expect(feeQuoteStatusLabel('declined')).toBe('Declined')
    expect(feeQuoteStatusLabel('expired')).toBe('Expired')
    expect(feeQuoteStatusLabel('superseded')).toBe('Superseded')
  })
})

describe('quoteSectionTypeLabel', () => {
  it('returns label for all section types', () => {
    expect(quoteSectionTypeLabel('cover')).toBe('Cover / Introduction')
    expect(quoteSectionTypeLabel('scope_of_service')).toBe('Scope of Service')
    expect(quoteSectionTypeLabel('acceptance')).toBe('Acceptance / Next Steps')
    expect(quoteSectionTypeLabel('terms_and_conditions')).toBe('Terms & Conditions')
  })
})

describe('numberingPreview', () => {
  it('replaces {YEAR} with current year', () => {
    const year = new Date().getFullYear().toString()
    expect(numberingPreview('MA-{YEAR}-001')).toContain(year)
  })
  it('replaces {SEQ:N} with zero-padded sequence', () => {
    expect(numberingPreview('MA-{SEQ:3}', 5)).toContain('005')
  })
  it('replaces {YY} with short year', () => {
    const shortYear = new Date().getFullYear().toString().slice(-2)
    expect(numberingPreview('Q-{YY}-{SEQ:2}', 1)).toContain(shortYear)
  })
  it('replaces {PROJECT} with sample project ref', () => {
    expect(numberingPreview('{PROJECT}-CI-{SEQ:2}', 3)).toBe('MA-2025-001-CI-03')
  })
})

describe('quoteNeedsFollowUp', () => {
  it('returns true for sent quote not viewed after 3+ days', () => {
    const threeDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString()
    expect(quoteNeedsFollowUp({
      status: 'sent',
      sent_at: threeDaysAgo,
      viewed_count: 0,
      valid_until: '2030-01-01',
    })).toBe(true)
  })
  it('returns false for recently sent quote', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    expect(quoteNeedsFollowUp({
      status: 'sent',
      sent_at: yesterday,
      viewed_count: 0,
      valid_until: '2030-01-01',
    })).toBe(false)
  })
  it('returns true for viewed quote expiring soon', () => {
    const fiveDaysFromNow = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
    expect(quoteNeedsFollowUp({
      status: 'viewed',
      viewed_count: 1,
      valid_until: fiveDaysFromNow,
    })).toBe(true)
  })
  it('returns false for accepted quote', () => {
    expect(quoteNeedsFollowUp({
      status: 'accepted',
      viewed_count: 3,
      valid_until: '2025-01-01',
    })).toBe(false)
  })
})

describe('healthScoreColor', () => {
  it('returns emerald for score >= 75', () => {
    expect(healthScoreColor(80)).toContain('emerald')
  })
  it('returns amber for score 50-74', () => {
    expect(healthScoreColor(60)).toContain('amber')
  })
  it('returns red for score < 50', () => {
    expect(healthScoreColor(30)).toContain('red')
  })
})

describe('healthScoreBg', () => {
  it('returns background class with color', () => {
    const result = healthScoreBg(75)
    expect(result).toContain('bg-')
    expect(result).toContain('emerald')
  })
})

describe('integrationStatusColor', () => {
  it('handles all statuses', () => {
    expect(integrationStatusColor('connected')).toContain('emerald')
    expect(integrationStatusColor('disconnected')).toContain('slate')
    expect(integrationStatusColor('error')).toContain('red')
    expect(integrationStatusColor('syncing')).toContain('blue')
  })
})

describe('integrationStatusLabel', () => {
  it('returns correct label for all statuses', () => {
    expect(integrationStatusLabel('connected')).toBeTruthy()
    expect(integrationStatusLabel('disconnected')).toBeTruthy()
    expect(integrationStatusLabel('error')).toBeTruthy()
    expect(integrationStatusLabel('syncing')).toBeTruthy()
  })
})

describe('integrationStatusDot', () => {
  it('returns dot classes for all statuses', () => {
    expect(integrationStatusDot('connected')).toContain('bg-')
    expect(integrationStatusDot('disconnected')).toContain('bg-')
    expect(integrationStatusDot('error')).toContain('bg-')
    expect(integrationStatusDot('syncing')).toContain('bg-')
  })
})

describe('portalAccessLabel', () => {
  it('returns correct labels', () => {
    expect(portalAccessLabel('view_only')).toBeTruthy()
    expect(portalAccessLabel('comment')).toBeTruthy()
    expect(portalAccessLabel('approve')).toBeTruthy()
  })
})

describe('portalAccessColor', () => {
  it('returns correct colors', () => {
    expect(portalAccessColor('view_only')).toBeTruthy()
    expect(portalAccessColor('comment')).toBeTruthy()
    expect(portalAccessColor('approve')).toBeTruthy()
  })
})

describe('formatCurrency', () => {
  it('formats GBP currency', () => {
    const result = formatCurrency(48500)
    expect(result).toContain('48')
    expect(result).toContain('500')
  })
  it('handles zero', () => {
    const result = formatCurrency(0)
    expect(result).toBeTruthy()
  })
  it('handles negative values', () => {
    const result = formatCurrency(-1000)
    expect(result).toBeTruthy()
  })
})

describe('formatPercent', () => {
  it('formats percentage', () => {
    const result = formatPercent(85)
    expect(result).toContain('85')
    expect(result).toContain('%')
  })
  it('handles decimal values', () => {
    const result = formatPercent(33.33)
    expect(result).toBeTruthy()
  })
})

describe('opportunityStatusColor', () => {
  it('returns correct color for all statuses', () => {
    const statuses = ['lead', 'qualifying', 'proposal_sent', 'negotiation', 'won', 'lost', 'dormant'] as const
    statuses.forEach(s => {
      const result = opportunityStatusColor(s)
      expect(result).toBeTruthy()
      expect(result).toContain('bg-')
    })
  })
})

describe('opportunityStatusLabel', () => {
  it('returns correct label for all statuses', () => {
    expect(opportunityStatusLabel('lead')).toBeTruthy()
    expect(opportunityStatusLabel('qualifying')).toBeTruthy()
    expect(opportunityStatusLabel('proposal_sent')).toBeTruthy()
    expect(opportunityStatusLabel('negotiation')).toBeTruthy()
    expect(opportunityStatusLabel('won')).toBeTruthy()
    expect(opportunityStatusLabel('lost')).toBeTruthy()
    expect(opportunityStatusLabel('dormant')).toBeTruthy()
  })
})

describe('confidenceBadgeColor', () => {
  it('returns correct color for all levels', () => {
    const levels = ['low', 'medium', 'high'] as const
    levels.forEach(l => {
      const result = confidenceBadgeColor(l)
      expect(result).toBeTruthy()
      expect(result).toContain('bg-')
    })
  })
})

describe('healthColor', () => {
  it('returns correct classes for all statuses', () => {
    expect(healthColor('green')).toContain('emerald')
    expect(healthColor('amber')).toContain('amber')
    expect(healthColor('red')).toContain('red')
  })
})

describe('healthDot', () => {
  it('returns dot classes for all statuses', () => {
    expect(healthDot('green')).toContain('bg-')
    expect(healthDot('amber')).toContain('bg-')
    expect(healthDot('red')).toContain('bg-')
  })
})

describe('statusLabel', () => {
  it('returns correct labels', () => {
    expect(statusLabel('not_started')).toBe('Not Started')
    expect(statusLabel('in_progress')).toBe('In Progress')
    expect(statusLabel('done')).toBe('Done')
    expect(statusLabel('blocked')).toBe('Blocked')
  })
})

describe('statusColor', () => {
  it('returns correct color classes for all statuses', () => {
    expect(statusColor('not_started')).toContain('bg-')
    expect(statusColor('in_progress')).toContain('bg-')
    expect(statusColor('done')).toContain('bg-')
    expect(statusColor('blocked')).toContain('bg-')
  })
})

describe('severityColor', () => {
  it('returns correct color for all severities', () => {
    expect(severityColor('low')).toContain('bg-')
    expect(severityColor('medium')).toContain('bg-')
    expect(severityColor('high')).toContain('bg-')
  })
})

describe('severityDot', () => {
  it('returns dot classes for all severities', () => {
    expect(severityDot('low')).toContain('bg-')
    expect(severityDot('medium')).toContain('bg-')
    expect(severityDot('high')).toContain('bg-')
  })
})

// ── Phase 4 Wave 2 Tests ──────────────────────────────────

describe('healthAlertSeverityColor', () => {
  it('returns correct color for all severities', () => {
    expect(healthAlertSeverityColor('info')).toContain('blue')
    expect(healthAlertSeverityColor('warning')).toContain('amber')
    expect(healthAlertSeverityColor('critical')).toContain('red')
  })
})

describe('healthAlertSeverityDot', () => {
  it('returns dot classes for all severities', () => {
    expect(healthAlertSeverityDot('info')).toContain('bg-blue')
    expect(healthAlertSeverityDot('warning')).toContain('bg-amber')
    expect(healthAlertSeverityDot('critical')).toContain('bg-red')
  })
})

describe('healthAlertCategoryLabel', () => {
  it('returns labels for all categories', () => {
    const categories = ['burn_rate', 'margin_erosion', 'billing_gap', 'scope_creep', 'programme_delay', 'near_loss', 'fee_overrun'] as const
    categories.forEach(c => {
      const result = healthAlertCategoryLabel(c)
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })
})

describe('healthAlertCategoryIcon', () => {
  it('returns icons for all categories', () => {
    const categories = ['burn_rate', 'margin_erosion', 'billing_gap', 'scope_creep', 'programme_delay', 'near_loss', 'fee_overrun'] as const
    categories.forEach(c => {
      expect(healthAlertCategoryIcon(c)).toBeTruthy()
    })
  })
})

describe('burnRatioColor', () => {
  it('returns emerald for ratio <= 1.0', () => {
    expect(burnRatioColor(0.9)).toContain('emerald')
    expect(burnRatioColor(1.0)).toContain('emerald')
  })
  it('returns amber for ratio 1.01-1.1', () => {
    expect(burnRatioColor(1.05)).toContain('amber')
    expect(burnRatioColor(1.1)).toContain('amber')
  })
  it('returns red for ratio > 1.1', () => {
    expect(burnRatioColor(1.15)).toContain('red')
    expect(burnRatioColor(1.5)).toContain('red')
  })
})

describe('burnRatioBg', () => {
  it('returns background classes', () => {
    expect(burnRatioBg(0.9)).toContain('bg-emerald')
    expect(burnRatioBg(1.05)).toContain('bg-amber')
    expect(burnRatioBg(1.2)).toContain('bg-red')
  })
})

describe('varianceColor', () => {
  it('returns emerald for variance <= 0', () => {
    expect(varianceColor(-5)).toContain('emerald')
    expect(varianceColor(0)).toContain('emerald')
  })
  it('returns amber for variance 1-10', () => {
    expect(varianceColor(5)).toContain('amber')
  })
  it('returns red for variance > 10', () => {
    expect(varianceColor(15)).toContain('red')
  })
})

describe('formatBurnRatio', () => {
  it('formats burn ratio with x suffix', () => {
    expect(formatBurnRatio(1.12)).toBe('1.12x')
    expect(formatBurnRatio(0.95)).toBe('0.95x')
    expect(formatBurnRatio(1.0)).toBe('1.00x')
  })
})

// ── Phase 4 Wave 3: BRPD Compliance & Drawing Workflow Utils ──

describe('complianceStatementStatusColor', () => {
  it('returns correct colors for all statuses', () => {
    expect(complianceStatementStatusColor('draft')).toContain('slate')
    expect(complianceStatementStatusColor('under_review')).toContain('blue')
    expect(complianceStatementStatusColor('approved')).toContain('emerald')
    expect(complianceStatementStatusColor('expired')).toContain('amber')
    expect(complianceStatementStatusColor('rejected')).toContain('red')
  })
})

describe('complianceStatementStatusLabel', () => {
  it('returns correct labels', () => {
    expect(complianceStatementStatusLabel('draft')).toBe('Draft')
    expect(complianceStatementStatusLabel('under_review')).toBe('Under Review')
    expect(complianceStatementStatusLabel('approved')).toBe('Approved')
    expect(complianceStatementStatusLabel('expired')).toBe('Expired')
    expect(complianceStatementStatusLabel('rejected')).toBe('Rejected')
  })
})

describe('brpdRequirementStatusColor', () => {
  it('returns correct colors for all statuses', () => {
    expect(brpdRequirementStatusColor('not_started')).toContain('slate')
    expect(brpdRequirementStatusColor('in_progress')).toContain('blue')
    expect(brpdRequirementStatusColor('evidenced')).toContain('cyan')
    expect(brpdRequirementStatusColor('verified')).toContain('emerald')
    expect(brpdRequirementStatusColor('non_compliant')).toContain('red')
  })
})

describe('brpdRequirementStatusLabel', () => {
  it('returns correct labels', () => {
    expect(brpdRequirementStatusLabel('not_started')).toBe('Not Started')
    expect(brpdRequirementStatusLabel('in_progress')).toBe('In Progress')
    expect(brpdRequirementStatusLabel('evidenced')).toBe('Evidenced')
    expect(brpdRequirementStatusLabel('verified')).toBe('Verified')
    expect(brpdRequirementStatusLabel('non_compliant')).toBe('Non-Compliant')
  })
})

describe('brpdChangeTypeLabel', () => {
  it('returns correct labels for all change types', () => {
    expect(brpdChangeTypeLabel('dutyholder_change')).toBe('Dutyholder')
    expect(brpdChangeTypeLabel('gateway_update')).toBe('Gateway')
    expect(brpdChangeTypeLabel('compliance_update')).toBe('Compliance')
    expect(brpdChangeTypeLabel('document_revision')).toBe('Document')
    expect(brpdChangeTypeLabel('requirement_update')).toBe('Requirement')
    expect(brpdChangeTypeLabel('evidence_upload')).toBe('Evidence')
  })
})

describe('brpdChangeTypeColor', () => {
  it('returns distinct colors for each type', () => {
    expect(brpdChangeTypeColor('dutyholder_change')).toContain('purple')
    expect(brpdChangeTypeColor('gateway_update')).toContain('blue')
    expect(brpdChangeTypeColor('compliance_update')).toContain('emerald')
    expect(brpdChangeTypeColor('document_revision')).toContain('amber')
    expect(brpdChangeTypeColor('requirement_update')).toContain('cyan')
    expect(brpdChangeTypeColor('evidence_upload')).toContain('slate')
  })
})

describe('drawingWorkflowStatusColor', () => {
  it('returns correct colors for all statuses', () => {
    expect(drawingWorkflowStatusColor('draft')).toContain('slate')
    expect(drawingWorkflowStatusColor('issued')).toContain('blue')
    expect(drawingWorkflowStatusColor('queried')).toContain('amber')
    expect(drawingWorkflowStatusColor('responded')).toContain('cyan')
    expect(drawingWorkflowStatusColor('closed')).toContain('emerald')
    expect(drawingWorkflowStatusColor('escalated')).toContain('red')
  })
})

describe('drawingWorkflowStatusLabel', () => {
  it('returns correct labels', () => {
    expect(drawingWorkflowStatusLabel('draft')).toBe('Draft')
    expect(drawingWorkflowStatusLabel('issued')).toBe('Issued')
    expect(drawingWorkflowStatusLabel('queried')).toBe('Queried')
    expect(drawingWorkflowStatusLabel('responded')).toBe('Responded')
    expect(drawingWorkflowStatusLabel('closed')).toBe('Closed')
    expect(drawingWorkflowStatusLabel('escalated')).toBe('Escalated')
  })
})

describe('drawingEmailDirectionLabel', () => {
  it('returns Sent for outbound', () => {
    expect(drawingEmailDirectionLabel('outbound')).toBe('Sent')
  })
  it('returns Received for inbound', () => {
    expect(drawingEmailDirectionLabel('inbound')).toBe('Received')
  })
})

describe('drawingEmailDirectionColor', () => {
  it('returns blue for outbound', () => {
    expect(drawingEmailDirectionColor('outbound')).toContain('blue')
  })
  it('returns emerald for inbound', () => {
    expect(drawingEmailDirectionColor('inbound')).toContain('emerald')
  })
})

describe('requirementCategoryLabel', () => {
  it('returns correct labels', () => {
    expect(requirementCategoryLabel('fire')).toBe('Fire')
    expect(requirementCategoryLabel('structural')).toBe('Structural')
    expect(requirementCategoryLabel('safety')).toBe('Safety')
    expect(requirementCategoryLabel('accessibility')).toBe('Accessibility')
    expect(requirementCategoryLabel('environmental')).toBe('Environmental')
    expect(requirementCategoryLabel('design')).toBe('Design')
  })
})

describe('requirementCategoryColor', () => {
  it('returns distinct colors', () => {
    expect(requirementCategoryColor('fire')).toContain('orange')
    expect(requirementCategoryColor('safety')).toContain('red')
    expect(requirementCategoryColor('structural')).toContain('slate')
    expect(requirementCategoryColor('accessibility')).toContain('purple')
    expect(requirementCategoryColor('environmental')).toContain('green')
    expect(requirementCategoryColor('design')).toContain('indigo')
  })
})
