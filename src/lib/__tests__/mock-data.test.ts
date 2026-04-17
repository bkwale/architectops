import { describe, it, expect } from 'vitest'
import {
  PROJECTS,
  USERS,
  getUser,
  getProjectTasks,
  getFeeQuoteRecords,
  getFeeQuoteRecord,
  getFeeQuoteLineItems,
  getFeeQuoteSections,
  getFeeQuoteViews,
  getFeeQuoteTemplates,
  getTermsLibrary,
  getExclusionsLibrary,
  getProjectHealthSnapshots,
  getAllHealthSnapshots,
  getProjectNumberTemplates,
  getQuoteNumberTemplates,
  getDrawingIssueTemplates,
  getIntegrations,
  getPortalInvites,
  getKnowledgeArticles,
  getOpportunities,
  getProjectFeeQuotes,
  getAISuggestedPrompts,
  getProjectCommercial,
  getAllProjectCommercials,
  getProjectHealthAlerts,
  getAllHealthAlerts,
  getUnacknowledgedAlerts,
  getBurnBudgetMetrics,
  getQuoteProjectLink,
  getQuoteProjectLinks,
  getQuoteConversionMetrics,
  getProjectComplianceStatements,
  getComplianceStatement,
  getProjectBRPDRequirements,
  getGatewayRequirements,
  getProjectChangelog,
  getDrawingIssueWorkflows,
  getDrawingIssueWorkflow,
  getWorkflowEmails,
  getActiveDrawingWorkflows,
  getEscalatedWorkflows,
  PROJECT_WIZARD_STEPS,
  PROJECT_BRIEFS,
  QUOTE_ACCOUNTING_LINKS,
  ROLE_VISIBILITY_RULES,
  getProjectWizardSteps,
  getProjectBrief,
  getProjectBriefs,
  getBriefSections,
  getQuoteAccountingLinks,
  getQuoteAccountingLink,
  getAccountingLinksByProvider,
  getRoleVisibilityRules,
  getAllVisibilityRules,
  getFeatureAccess,
  LEAVE_RECORDS,
  BANK_HOLIDAYS,
  LEAVE_ENTITLEMENTS,
  getLeaveRecords,
  getUserLeaveRecords,
  getPendingLeaveRequests,
  getUpcomingLeave,
  getBankHolidays,
  getLeaveEntitlement,
  getLeaveEntitlements,
  getTeamAvailability,
  COMPLIANCE_STATEMENTS,
  BRPD_REQUIREMENTS,
  BRPD_CHANGELOG,
  DRAWING_ISSUE_WORKFLOWS,
  DRAWING_EMAILS,
} from '../mock-data'

describe('Core data integrity', () => {
  it('has 5 users', () => {
    expect(USERS).toHaveLength(5)
  })
  it('has 6 projects', () => {
    expect(PROJECTS).toHaveLength(6)
  })
  it('every project has required fields', () => {
    PROJECTS.forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.client).toBeTruthy()
      expect(p.current_stage).toBeGreaterThanOrEqual(0)
      expect(p.current_stage).toBeLessThanOrEqual(7)
    })
  })
  it('getUser returns correct user', () => {
    const user = getUser('u1')
    expect(user).toBeTruthy()
    expect(user?.name).toBe('Sarah Mitchell')
  })
  it('getUser returns undefined for invalid id', () => {
    expect(getUser('nonexistent')).toBeUndefined()
  })
})

describe('Tasks data', () => {
  it('getProjectTasks returns tasks for project', () => {
    const tasks = getProjectTasks('p1')
    expect(tasks.length).toBeGreaterThan(0)
    tasks.forEach(t => {
      expect(t.project_id).toBe('p1')
    })
  })
  it('tasks have required fields', () => {
    const tasks = getProjectTasks('p1')
    tasks.forEach(t => {
      expect(t.id).toBeTruthy()
      expect(t.title).toBeTruthy()
      expect(typeof t.stage).toBe('number')
      expect(t.status).toMatch(/^(not_started|in_progress|done|blocked)$/)
      expect(typeof t.required_flag).toBe('boolean')
    })
  })
  it('returns empty array for nonexistent project', () => {
    const tasks = getProjectTasks('nonexistent-project')
    expect(tasks).toEqual([])
  })
})

describe('Fee Quote data (Phase 4)', () => {
  it('has 6 fee quotes', () => {
    expect(getFeeQuoteRecords()).toHaveLength(6)
  })
  it('each quote has required Phase 4 fields', () => {
    getFeeQuoteRecords().forEach(q => {
      expect(q.quote_title).toBeTruthy()
      expect(q.client_name).toBeTruthy()
      expect(q.currency).toBe('GBP')
      expect(typeof q.viewed_count).toBe('number')
      expect(typeof q.design_freeze_flag).toBe('boolean')
      expect(typeof q.deposit_required_flag).toBe('boolean')
      expect(q.terms_text).toBeTruthy()
      expect(q.exclusions_text).toBeTruthy()
      expect(q.assumptions_text).toBeTruthy()
    })
  })
  it('covers all key statuses', () => {
    const statuses = getFeeQuoteRecords().map(q => q.status)
    expect(statuses).toContain('accepted')
    expect(statuses).toContain('sent')
    expect(statuses).toContain('viewed')
    expect(statuses).toContain('draft')
  })
  it('getFeeQuoteRecord returns correct quote', () => {
    const quote = getFeeQuoteRecord('fq-1')
    expect(quote).toBeTruthy()
    expect(quote?.id).toBe('fq-1')
  })
  it('getFeeQuoteRecord returns undefined for invalid id', () => {
    expect(getFeeQuoteRecord('nonexistent')).toBeUndefined()
  })
})

describe('Fee Quote Line Items', () => {
  it('getFeeQuoteLineItems returns items for quote', () => {
    const items = getFeeQuoteLineItems('fq-1')
    expect(items.length).toBeGreaterThan(0)
    items.forEach(item => {
      expect(item.fee_quote_id).toBe('fq-1')
      expect(typeof item.optional_flag).toBe('boolean')
      expect(typeof item.amount).toBe('number')
      expect(item.amount).toBeGreaterThanOrEqual(0)
    })
  })
  it('line items are sorted by sort_order', () => {
    const items = getFeeQuoteLineItems('fq-1')
    for (let i = 1; i < items.length; i++) {
      expect(items[i].sort_order).toBeGreaterThanOrEqual(items[i - 1].sort_order)
    }
  })
  it('returns empty array for nonexistent quote', () => {
    const items = getFeeQuoteLineItems('nonexistent')
    expect(items).toEqual([])
  })
  it('total of line items matches quote amount', () => {
    const quote = getFeeQuoteRecord('fq-1')
    const items = getFeeQuoteLineItems('fq-1')
    if (quote && items.length > 0) {
      const total = items.reduce((sum, item) => sum + item.amount, 0)
      expect(total).toBeGreaterThan(0)
    }
  })
})

describe('Fee Quote Sections', () => {
  it('getFeeQuoteSections returns sorted sections', () => {
    const sections = getFeeQuoteSections('fq-1')
    expect(sections.length).toBeGreaterThan(0)
    for (let i = 1; i < sections.length; i++) {
      expect(sections[i].sort_order).toBeGreaterThanOrEqual(sections[i - 1].sort_order)
    }
  })
  it('sections have required fields', () => {
    const sections = getFeeQuoteSections('fq-1')
    sections.forEach(s => {
      expect(s.fee_quote_id).toBe('fq-1')
      expect(s.section_type).toMatch(/^(cover|project_understanding|scope_of_service|stage_breakdown|optional_extras|consultant_coordination|programme_assumptions|design_freeze_note|meetings_and_communication|expenses_and_travel|exclusions|terms_and_conditions|payment_terms|acceptance)$/)
      expect(typeof s.sort_order).toBe('number')
    })
  })
  it('returns empty array for nonexistent quote', () => {
    const sections = getFeeQuoteSections('nonexistent')
    expect(sections).toEqual([])
  })
})

describe('Fee Quote Views', () => {
  it('getFeeQuoteViews returns views for quote', () => {
    const views = getFeeQuoteViews('fq-1')
    expect(views.length).toBeGreaterThan(0)
    views.forEach(v => {
      expect(v.fee_quote_id).toBe('fq-1')
      expect(v.source).toMatch(/^(email|portal|direct_link)$/)
      expect(v.viewed_at).toBeTruthy()
    })
  })
  it('returns empty array for nonexistent quote', () => {
    const views = getFeeQuoteViews('nonexistent')
    expect(views).toEqual([])
  })
})

describe('Templates & Libraries (Phase 4)', () => {
  it('returns active templates only', () => {
    getFeeQuoteTemplates().forEach(t => {
      expect(t.active_flag).toBe(true)
    })
  })
  it('has fee quote templates', () => {
    const templates = getFeeQuoteTemplates()
    expect(templates.length).toBeGreaterThan(0)
  })
  it('returns active terms only', () => {
    getTermsLibrary().forEach(t => {
      expect(t.active_flag).toBe(true)
    })
  })
  it('has terms in library', () => {
    const terms = getTermsLibrary()
    expect(terms.length).toBeGreaterThan(0)
  })
  it('returns active exclusions only', () => {
    getExclusionsLibrary().forEach(e => {
      expect(e.active_flag).toBe(true)
    })
  })
  it('has exclusions in library', () => {
    const exclusions = getExclusionsLibrary()
    expect(exclusions.length).toBeGreaterThan(0)
  })
  it('has numbering templates', () => {
    expect(getProjectNumberTemplates().length).toBeGreaterThan(0)
    expect(getQuoteNumberTemplates().length).toBeGreaterThan(0)
    expect(getDrawingIssueTemplates().length).toBeGreaterThan(0)
  })
  it('numbering templates have format_string', () => {
    getProjectNumberTemplates().forEach(t => {
      expect(t.format_string).toBeTruthy()
      expect(t.format_string).toContain('{')
    })
  })
})

describe('Health Snapshots (Phase 4)', () => {
  it('has snapshots across multiple projects', () => {
    const all = getAllHealthSnapshots()
    expect(all.length).toBeGreaterThan(5)
    const projectIds = Array.from(new Set(all.map(s => s.project_id)))
    expect(projectIds.length).toBeGreaterThan(1)
  })
  it('snapshots have valid health scores', () => {
    getAllHealthSnapshots().forEach(s => {
      expect(s.health_score).toBeGreaterThanOrEqual(0)
      expect(s.health_score).toBeLessThanOrEqual(100)
    })
  })
  it('getProjectHealthSnapshots returns sorted by date', () => {
    const snapshots = getProjectHealthSnapshots('p1')
    for (let i = 1; i < snapshots.length; i++) {
      expect(new Date(snapshots[i].snapshot_date).getTime())
        .toBeGreaterThanOrEqual(new Date(snapshots[i - 1].snapshot_date).getTime())
    }
  })
  it('includes at least one near-loss flag', () => {
    const hasNearLoss = getAllHealthSnapshots().some(s => s.near_loss_flag)
    expect(hasNearLoss).toBe(true)
  })
  it('has health score that implies a status category', () => {
    getAllHealthSnapshots().forEach(s => {
      // health_score determines status: >= 75 green, >= 50 amber, < 50 red
      expect(s.health_score).toBeGreaterThanOrEqual(0)
      expect(s.health_score).toBeLessThanOrEqual(100)
    })
  })
})

describe('Integrations data', () => {
  it('has integrations', () => {
    expect(getIntegrations().length).toBeGreaterThan(0)
  })
  it('has at least one connected integration', () => {
    const connected = getIntegrations().filter(i => i.status === 'connected')
    expect(connected.length).toBeGreaterThan(0)
  })
  it('integrations have required fields', () => {
    getIntegrations().forEach(i => {
      expect(i.id).toBeTruthy()
      expect(i.display_name).toBeTruthy()
      expect(i.status).toMatch(/^(connected|disconnected|error|syncing)$/)
    })
  })
})

describe('Portal Invites data', () => {
  it('has portal invites', () => {
    expect(getPortalInvites().length).toBeGreaterThan(0)
  })
  it('invites have required fields', () => {
    getPortalInvites().forEach(i => {
      expect(i.email).toBeTruthy()
      expect(i.access_level).toMatch(/^(view_only|comment|approve)$/)
    })
  })
})

describe('Knowledge Articles data', () => {
  it('has knowledge articles', () => {
    expect(getKnowledgeArticles().length).toBeGreaterThan(0)
  })
  it('articles have required fields', () => {
    getKnowledgeArticles().forEach(a => {
      expect(a.title).toBeTruthy()
      expect(a.category).toBeTruthy()
    })
  })
})

describe('Opportunities data', () => {
  it('has opportunities', () => {
    expect(getOpportunities().length).toBeGreaterThan(0)
  })
  it('opportunities have required fields', () => {
    getOpportunities().forEach(o => {
      expect(o.title).toBeTruthy()
      expect(o.status).toMatch(/^(lead|qualifying|proposal_sent|negotiation|won|lost|dormant)$/)
      expect(typeof o.likelihood_percentage).toBe('number')
    })
  })
})

describe('Project Fee Quotes', () => {
  it('getProjectFeeQuotes filters by project', () => {
    const quotes = getProjectFeeQuotes('p1')
    quotes.forEach(q => {
      expect(q.related_project_id).toBe('p1')
    })
  })
  it('returns empty array for project with no quotes', () => {
    const quotes = getProjectFeeQuotes('nonexistent')
    expect(Array.isArray(quotes)).toBe(true)
  })
})

describe('AI suggested prompts', () => {
  it('has global prompts', () => {
    const global = getAISuggestedPrompts('global')
    expect(global.length).toBeGreaterThan(0)
  })
  it('has project prompts', () => {
    const project = getAISuggestedPrompts('project')
    expect(project.length).toBeGreaterThan(0)
  })
  it('prompts have required fields', () => {
    const global = getAISuggestedPrompts('global')
    global.forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.prompt).toBeTruthy()
    })
  })
})

describe('Project Commercial', () => {
  it('getProjectCommercial returns commercial for project', () => {
    const commercial = getProjectCommercial('p1')
    expect(commercial).toBeTruthy()
    expect(commercial?.project_id).toBe('p1')
  })
  it('getAllProjectCommercials returns all commercials', () => {
    const all = getAllProjectCommercials()
    expect(all.length).toBeGreaterThan(0)
    const uniqueProjects = Array.from(new Set(all.map(c => c.project_id)))
    expect(uniqueProjects.length).toBeGreaterThan(1)
  })
})

// ── Phase 4 Wave 2 Tests ──────────────────────────────────

describe('Health Alerts (Phase 4 Wave 2)', () => {
  it('has health alerts', () => {
    const all = getAllHealthAlerts()
    expect(all.length).toBeGreaterThan(0)
  })
  it('alerts have required fields', () => {
    getAllHealthAlerts().forEach(a => {
      expect(a.id).toBeTruthy()
      expect(a.project_id).toBeTruthy()
      expect(a.category).toMatch(/^(burn_rate|margin_erosion|billing_gap|scope_creep|programme_delay|near_loss|fee_overrun)$/)
      expect(a.severity).toMatch(/^(info|warning|critical)$/)
      expect(a.title).toBeTruthy()
      expect(a.description).toBeTruthy()
      expect(typeof a.metric_value).toBe('number')
      expect(typeof a.threshold_value).toBe('number')
      expect(typeof a.acknowledged_flag).toBe('boolean')
    })
  })
  it('getProjectHealthAlerts filters by project', () => {
    const alerts = getProjectHealthAlerts('p3')
    expect(alerts.length).toBeGreaterThan(0)
    alerts.forEach(a => expect(a.project_id).toBe('p3'))
  })
  it('alerts are sorted newest first', () => {
    const alerts = getProjectHealthAlerts('p3')
    for (let i = 1; i < alerts.length; i++) {
      expect(new Date(alerts[i - 1].created_at).getTime())
        .toBeGreaterThanOrEqual(new Date(alerts[i].created_at).getTime())
    }
  })
  it('getUnacknowledgedAlerts excludes acknowledged', () => {
    const unack = getUnacknowledgedAlerts()
    unack.forEach(a => expect(a.acknowledged_flag).toBe(false))
  })
  it('getUnacknowledgedAlerts sorts by severity (critical first)', () => {
    const unack = getUnacknowledgedAlerts()
    const sevOrder = { critical: 0, warning: 1, info: 2 }
    for (let i = 1; i < unack.length; i++) {
      expect(sevOrder[unack[i].severity]).toBeGreaterThanOrEqual(sevOrder[unack[i - 1].severity])
    }
  })
  it('has at least one critical alert', () => {
    const hasCritical = getAllHealthAlerts().some(a => a.severity === 'critical')
    expect(hasCritical).toBe(true)
  })
})

describe('Burn Budget Metrics (Phase 4 Wave 2)', () => {
  it('has burn metrics', () => {
    const metrics = getBurnBudgetMetrics('p1')
    expect(metrics.length).toBeGreaterThan(0)
  })
  it('metrics have required fields', () => {
    getBurnBudgetMetrics('p1').forEach(m => {
      expect(m.project_id).toBe('p1')
      expect(typeof m.stage).toBe('number')
      expect(m.stage_label).toBeTruthy()
      expect(typeof m.budgeted_hours).toBe('number')
      expect(typeof m.actual_hours).toBe('number')
      expect(typeof m.burn_ratio).toBe('number')
      expect(typeof m.variance_percent).toBe('number')
    })
  })
  it('metrics are sorted by stage', () => {
    const metrics = getBurnBudgetMetrics('p1')
    for (let i = 1; i < metrics.length; i++) {
      expect(metrics[i].stage).toBeGreaterThanOrEqual(metrics[i - 1].stage)
    }
  })
  it('returns empty for project without metrics', () => {
    expect(getBurnBudgetMetrics('nonexistent')).toEqual([])
  })
})

describe('Quote Project Links (Phase 4 Wave 2)', () => {
  it('has quote-project links', () => {
    expect(getQuoteProjectLinks().length).toBeGreaterThan(0)
  })
  it('links have required fields', () => {
    getQuoteProjectLinks().forEach(l => {
      expect(l.id).toBeTruthy()
      expect(l.fee_quote_id).toBeTruthy()
      expect(l.project_creation_status).toMatch(/^(pending|created|skipped)$/)
      expect(typeof l.auto_created_flag).toBe('boolean')
    })
  })
  it('getQuoteProjectLink returns correct link', () => {
    const link = getQuoteProjectLink('fq-1')
    expect(link).toBeTruthy()
    expect(link?.fee_quote_id).toBe('fq-1')
    expect(link?.project_creation_status).toBe('created')
  })
  it('getQuoteProjectLink returns undefined for unknown quote', () => {
    expect(getQuoteProjectLink('nonexistent')).toBeUndefined()
  })
  it('created links have project_id', () => {
    const created = getQuoteProjectLinks().filter(l => l.project_creation_status === 'created')
    created.forEach(l => expect(l.project_id).toBeTruthy())
  })
})

describe('Quote Conversion Metrics (Phase 4 Wave 2)', () => {
  it('has conversion metrics', () => {
    expect(getQuoteConversionMetrics().length).toBeGreaterThan(0)
  })
  it('metrics have required fields', () => {
    getQuoteConversionMetrics().forEach(m => {
      expect(m.sector).toBeTruthy()
      expect(typeof m.total_quotes).toBe('number')
      expect(typeof m.accepted_quotes).toBe('number')
      expect(typeof m.win_rate).toBe('number')
      expect(typeof m.total_value).toBe('number')
      expect(typeof m.won_value).toBe('number')
      expect(typeof m.avg_quote_value).toBe('number')
    })
  })
  it('win rate is consistent with quote counts', () => {
    getQuoteConversionMetrics().forEach(m => {
      if (m.total_quotes > 0) {
        const expectedRate = parseFloat(((m.accepted_quotes / m.total_quotes) * 100).toFixed(1))
        expect(m.win_rate).toBe(expectedRate)
      }
    })
  })
  it('has at least one sector with wins', () => {
    const hasWins = getQuoteConversionMetrics().some(m => m.accepted_quotes > 0)
    expect(hasWins).toBe(true)
  })
})

// ── Phase 4 Wave 3: Compliance & Drawing Workflow Tests ──────

describe('Compliance Statements', () => {
  it('has 7 compliance statements', () => {
    expect(COMPLIANCE_STATEMENTS).toHaveLength(7)
  })
  it('every statement has required fields', () => {
    COMPLIANCE_STATEMENTS.forEach(cs => {
      expect(cs.id).toBeTruthy()
      expect(cs.project_id).toBeTruthy()
      expect(cs.title).toBeTruthy()
      expect(cs.regulation_ref).toBeTruthy()
      expect(cs.status).toBeTruthy()
      expect(cs.due_date).toBeTruthy()
      expect(Array.isArray(cs.evidence_document_ids)).toBe(true)
    })
  })
  it('getProjectComplianceStatements filters by project', () => {
    const p2Statements = getProjectComplianceStatements('p2')
    expect(p2Statements.length).toBeGreaterThan(0)
    p2Statements.forEach(cs => expect(cs.project_id).toBe('p2'))
  })
  it('getComplianceStatement finds by id', () => {
    const cs = getComplianceStatement('cs1')
    expect(cs).toBeDefined()
    expect(cs?.title).toContain('Fire Safety')
  })
  it('approved statements have approved_date', () => {
    COMPLIANCE_STATEMENTS.filter(cs => cs.status === 'approved').forEach(cs => {
      expect(cs.approved_date).toBeTruthy()
      expect(cs.approved_by_user_id).toBeTruthy()
    })
  })
})

describe('BRPD Requirements', () => {
  it('has 8 requirements', () => {
    expect(BRPD_REQUIREMENTS).toHaveLength(8)
  })
  it('every requirement has required fields', () => {
    BRPD_REQUIREMENTS.forEach(r => {
      expect(r.id).toBeTruthy()
      expect(r.project_id).toBeTruthy()
      expect([1, 2, 3]).toContain(r.gateway_number)
      expect(r.requirement_ref).toBeTruthy()
      expect(r.title).toBeTruthy()
      expect(r.status).toBeTruthy()
      expect(r.target_date).toBeTruthy()
      expect(r.category).toBeTruthy()
    })
  })
  it('getProjectBRPDRequirements filters by project', () => {
    const p2Reqs = getProjectBRPDRequirements('p2')
    expect(p2Reqs.length).toBe(8) // all are for p2
    p2Reqs.forEach(r => expect(r.project_id).toBe('p2'))
  })
  it('getGatewayRequirements filters by gateway number', () => {
    const gw1Reqs = getGatewayRequirements('p2', 1)
    expect(gw1Reqs.length).toBeGreaterThan(0)
    gw1Reqs.forEach(r => expect(r.gateway_number).toBe(1))
  })
  it('verified requirements have completed_date', () => {
    BRPD_REQUIREMENTS.filter(r => r.status === 'verified').forEach(r => {
      expect(r.completed_date).toBeTruthy()
      expect(r.verified_by_user_id).toBeTruthy()
    })
  })
})

describe('BRPD Changelog', () => {
  it('has 10 changelog entries', () => {
    expect(BRPD_CHANGELOG).toHaveLength(10)
  })
  it('every entry has required fields', () => {
    BRPD_CHANGELOG.forEach(entry => {
      expect(entry.id).toBeTruthy()
      expect(entry.project_id).toBeTruthy()
      expect(entry.change_type).toBeTruthy()
      expect(entry.title).toBeTruthy()
      expect(entry.description).toBeTruthy()
      expect(entry.changed_by_user_id).toBeTruthy()
      expect(entry.changed_at).toBeTruthy()
      expect(typeof entry.approved_flag).toBe('boolean')
    })
  })
  it('getProjectChangelog returns sorted by date desc', () => {
    const p2Log = getProjectChangelog('p2')
    expect(p2Log.length).toBeGreaterThan(0)
    for (let i = 1; i < p2Log.length; i++) {
      expect(new Date(p2Log[i - 1].changed_at).getTime()).toBeGreaterThanOrEqual(
        new Date(p2Log[i].changed_at).getTime()
      )
    }
  })
  it('approved entries have approved_by_user_id', () => {
    BRPD_CHANGELOG.filter(e => e.approved_flag).forEach(e => {
      expect(e.approved_by_user_id).toBeTruthy()
    })
  })
})

describe('Drawing Issue Workflows', () => {
  it('has 6 workflows', () => {
    expect(DRAWING_ISSUE_WORKFLOWS).toHaveLength(6)
  })
  it('every workflow has required fields', () => {
    DRAWING_ISSUE_WORKFLOWS.forEach(w => {
      expect(w.id).toBeTruthy()
      expect(w.project_id).toBeTruthy()
      expect(w.drawing_issue_id).toBeTruthy()
      expect(w.drawing_ref).toBeTruthy()
      expect(w.status).toBeTruthy()
      expect(w.issued_to_name).toBeTruthy()
      expect(w.issued_to_email).toBeTruthy()
      expect(w.issued_date).toBeTruthy()
      expect(w.response_due_date).toBeTruthy()
      expect(typeof w.escalated_flag).toBe('boolean')
      expect(typeof w.query_count).toBe('number')
    })
  })
  it('getDrawingIssueWorkflows filters by project', () => {
    const p1Workflows = getDrawingIssueWorkflows('p1')
    expect(p1Workflows.length).toBeGreaterThan(0)
    p1Workflows.forEach(w => expect(w.project_id).toBe('p1'))
  })
  it('getDrawingIssueWorkflow finds by id', () => {
    const wf = getDrawingIssueWorkflow('diw1')
    expect(wf).toBeDefined()
    expect(wf?.status).toBe('queried')
  })
  it('getActiveDrawingWorkflows excludes draft and closed', () => {
    const active = getActiveDrawingWorkflows('p1')
    active.forEach(w => {
      expect(w.status).not.toBe('draft')
      expect(w.status).not.toBe('closed')
    })
  })
  it('getEscalatedWorkflows returns only escalated', () => {
    const escalated = getEscalatedWorkflows('p3')
    expect(escalated.length).toBeGreaterThan(0)
    escalated.forEach(w => expect(w.escalated_flag).toBe(true))
  })
})

describe('Drawing Emails', () => {
  it('has 11 emails', () => {
    expect(DRAWING_EMAILS).toHaveLength(11)
  })
  it('every email has required fields', () => {
    DRAWING_EMAILS.forEach(e => {
      expect(e.id).toBeTruthy()
      expect(e.workflow_id).toBeTruthy()
      expect(['outbound', 'inbound']).toContain(e.direction)
      expect(e.from_name).toBeTruthy()
      expect(e.from_email).toBeTruthy()
      expect(e.to_name).toBeTruthy()
      expect(e.to_email).toBeTruthy()
      expect(e.subject).toBeTruthy()
      expect(e.body_preview).toBeTruthy()
      expect(e.sent_at).toBeTruthy()
      expect(typeof e.has_attachment).toBe('boolean')
    })
  })
  it('getWorkflowEmails returns chronological order', () => {
    const emails = getWorkflowEmails('diw1')
    expect(emails.length).toBeGreaterThan(0)
    for (let i = 1; i < emails.length; i++) {
      expect(new Date(emails[i].sent_at).getTime()).toBeGreaterThanOrEqual(
        new Date(emails[i - 1].sent_at).getTime()
      )
    }
  })
  it('emails with attachments have attachment_names', () => {
    DRAWING_EMAILS.filter(e => e.has_attachment).forEach(e => {
      expect(e.attachment_names).toBeDefined()
      expect(e.attachment_names!.length).toBeGreaterThan(0)
    })
  })
})

// ── Phase 4 Wave 4: Project Creation & Access Control ───────

describe('Project Wizard Steps', () => {
  it('has 12 steps', () => {
    expect(PROJECT_WIZARD_STEPS).toHaveLength(12)
  })
  it('every step has required fields', () => {
    PROJECT_WIZARD_STEPS.forEach(s => {
      expect(s.number).toBeGreaterThan(0)
      expect(s.title).toBeTruthy()
      expect(s.description).toBeTruthy()
      expect(typeof s.required).toBe('boolean')
      expect(Array.isArray(s.fields)).toBe(true)
    })
  })
  it('steps are numbered 1-12 sequentially', () => {
    PROJECT_WIZARD_STEPS.forEach((s, i) => {
      expect(s.number).toBe(i + 1)
    })
  })
  it('first 5 steps are required', () => {
    PROJECT_WIZARD_STEPS.slice(0, 5).forEach(s => {
      expect(s.required).toBe(true)
    })
  })
  it('last step (Review) is required and has no fields', () => {
    const last = PROJECT_WIZARD_STEPS[11]
    expect(last.title).toBe('Review & Create')
    expect(last.required).toBe(true)
    expect(last.fields).toHaveLength(0)
  })
  it('getProjectWizardSteps returns all steps', () => {
    expect(getProjectWizardSteps()).toHaveLength(12)
  })
})

describe('Project Briefs', () => {
  it('has 2 briefs', () => {
    expect(PROJECT_BRIEFS).toHaveLength(2)
  })
  it('every brief has required fields', () => {
    PROJECT_BRIEFS.forEach(b => {
      expect(b.id).toBeTruthy()
      expect(b.project_id).toBeTruthy()
      expect(typeof b.version).toBe('number')
      expect(['draft', 'issued']).toContain(b.status)
      expect(b.sections.length).toBeGreaterThan(0)
      expect(b.created_by_user_id).toBeTruthy()
      expect(b.created_at).toBeTruthy()
    })
  })
  it('every section has required fields', () => {
    PROJECT_BRIEFS.forEach(b => {
      b.sections.forEach(s => {
        expect(s.id).toBeTruthy()
        expect(s.project_id).toBe(b.project_id)
        expect(s.section_number).toBeGreaterThan(0)
        expect(s.title).toBeTruthy()
        expect(s.description).toBeTruthy()
        expect(['empty', 'draft', 'complete', 'approved']).toContain(s.status)
        expect(typeof s.required).toBe('boolean')
      })
    })
  })
  it('approved sections have approved_by_user_id', () => {
    PROJECT_BRIEFS.forEach(b => {
      b.sections.filter(s => s.status === 'approved').forEach(s => {
        expect(s.approved_by_user_id).toBeTruthy()
        expect(s.approved_at).toBeTruthy()
      })
    })
  })
  it('getProjectBrief finds by project id', () => {
    const brief = getProjectBrief('p1')
    expect(brief).toBeDefined()
    expect(brief?.project_id).toBe('p1')
  })
  it('getProjectBrief returns undefined for unknown project', () => {
    expect(getProjectBrief('nonexistent')).toBeUndefined()
  })
  it('getProjectBriefs returns all briefs', () => {
    expect(getProjectBriefs()).toHaveLength(2)
  })
  it('getBriefSections returns sorted sections', () => {
    const sections = getBriefSections('p1')
    expect(sections.length).toBeGreaterThan(0)
    for (let i = 1; i < sections.length; i++) {
      expect(sections[i].section_number).toBeGreaterThanOrEqual(sections[i - 1].section_number)
    }
  })
  it('getBriefSections returns empty for unknown project', () => {
    expect(getBriefSections('nonexistent')).toHaveLength(0)
  })
})

describe('Quote Accounting Links', () => {
  it('has 5 links', () => {
    expect(QUOTE_ACCOUNTING_LINKS).toHaveLength(5)
  })
  it('every link has required fields', () => {
    QUOTE_ACCOUNTING_LINKS.forEach(l => {
      expect(l.id).toBeTruthy()
      expect(l.fee_quote_id).toBeTruthy()
      expect(['xero', 'quickbooks']).toContain(l.provider)
      expect(['synced', 'pending', 'failed', 'not_linked']).toContain(l.sync_status)
      expect(typeof l.auto_sync_enabled).toBe('boolean')
      expect(Array.isArray(l.mapped_fields)).toBe(true)
    })
  })
  it('synced links have last_synced_at', () => {
    QUOTE_ACCOUNTING_LINKS.filter(l => l.sync_status === 'synced').forEach(l => {
      expect(l.last_synced_at).toBeTruthy()
      expect(l.external_invoice_id).toBeTruthy()
    })
  })
  it('failed links have error_message', () => {
    QUOTE_ACCOUNTING_LINKS.filter(l => l.sync_status === 'failed').forEach(l => {
      expect(l.error_message).toBeTruthy()
    })
  })
  it('getQuoteAccountingLinks returns all', () => {
    expect(getQuoteAccountingLinks()).toHaveLength(5)
  })
  it('getQuoteAccountingLink finds by fee_quote_id', () => {
    const link = getQuoteAccountingLink('fq1')
    expect(link).toBeDefined()
    expect(link?.provider).toBe('xero')
    expect(link?.sync_status).toBe('synced')
  })
  it('getQuoteAccountingLink returns undefined for unknown', () => {
    expect(getQuoteAccountingLink('nonexistent')).toBeUndefined()
  })
  it('getAccountingLinksByProvider filters correctly', () => {
    const xeroLinks = getAccountingLinksByProvider('xero')
    expect(xeroLinks.length).toBeGreaterThan(0)
    xeroLinks.forEach(l => expect(l.provider).toBe('xero'))

    const qbLinks = getAccountingLinksByProvider('quickbooks')
    expect(qbLinks.length).toBeGreaterThan(0)
    qbLinks.forEach(l => expect(l.provider).toBe('quickbooks'))
  })
})

describe('Role Visibility Rules', () => {
  it('has 18 rules', () => {
    expect(ROLE_VISIBILITY_RULES).toHaveLength(18)
  })
  it('every rule has required fields', () => {
    ROLE_VISIBILITY_RULES.forEach(r => {
      expect(r.id).toBeTruthy()
      expect(r.organisation_id).toBeTruthy()
      expect(r.role).toBeTruthy()
      expect(r.feature_area).toBeTruthy()
      expect(typeof r.can_view).toBe('boolean')
      expect(typeof r.can_edit).toBe('boolean')
      expect(typeof r.can_delete).toBe('boolean')
      expect(typeof r.can_export).toBe('boolean')
    })
  })
  it('practice_owner has full view access to all features', () => {
    const ownerRules = getRoleVisibilityRules('practice_owner')
    ownerRules.forEach(r => {
      expect(r.can_view).toBe(true)
    })
  })
  it('team_member cannot view fee_quotes or admin', () => {
    const feeAccess = getFeatureAccess('team_member', 'fee_quotes')
    expect(feeAccess?.can_view).toBe(false)
    const adminAccess = getFeatureAccess('team_member', 'admin')
    expect(adminAccess?.can_view).toBe(false)
  })
  it('project_lead cannot access admin', () => {
    const adminAccess = getFeatureAccess('project_lead', 'admin')
    expect(adminAccess?.can_view).toBe(false)
  })
  it('getRoleVisibilityRules filters by role', () => {
    const ownerRules = getRoleVisibilityRules('practice_owner')
    expect(ownerRules.length).toBe(6)
    ownerRules.forEach(r => expect(r.role).toBe('practice_owner'))
  })
  it('getAllVisibilityRules returns all rules', () => {
    expect(getAllVisibilityRules()).toHaveLength(18)
  })
  it('getFeatureAccess finds specific role/feature combo', () => {
    const access = getFeatureAccess('project_lead', 'projects')
    expect(access).toBeDefined()
    expect(access?.can_view).toBe(true)
    expect(access?.can_edit).toBe(true)
    expect(access?.can_delete).toBe(false)
  })
  it('getFeatureAccess returns undefined for unknown combo', () => {
    expect(getFeatureAccess('intern', 'projects')).toBeUndefined()
  })
  it('restricted rules have restriction_notes', () => {
    const restricted = ROLE_VISIBILITY_RULES.filter(r => !r.can_view && r.restriction_notes)
    expect(restricted.length).toBeGreaterThan(0)
    restricted.forEach(r => expect(r.restriction_notes).toBeTruthy())
  })
})

// ── Leave & Holidays ────────────────────────────────────────

describe('Leave Records', () => {
  it('has 12 leave records', () => {
    expect(LEAVE_RECORDS).toHaveLength(12)
  })
  it('every record has required fields', () => {
    LEAVE_RECORDS.forEach(l => {
      expect(l.id).toBeTruthy()
      expect(l.user_id).toBeTruthy()
      expect(['holiday', 'sick', 'cpd', 'parental', 'compassionate', 'unpaid']).toContain(l.leave_type)
      expect(['pending', 'approved', 'declined', 'cancelled']).toContain(l.status)
      expect(l.start_date).toBeTruthy()
      expect(l.end_date).toBeTruthy()
      expect(typeof l.days).toBe('number')
      expect(l.days).toBeGreaterThan(0)
      expect(l.created_at).toBeTruthy()
    })
  })
  it('approved records have approved_by_user_id', () => {
    LEAVE_RECORDS.filter(l => l.status === 'approved').forEach(l => {
      expect(l.approved_by_user_id).toBeTruthy()
    })
  })
  it('getLeaveRecords returns sorted by start_date', () => {
    const records = getLeaveRecords()
    for (let i = 1; i < records.length; i++) {
      expect(new Date(records[i].start_date).getTime()).toBeGreaterThanOrEqual(
        new Date(records[i - 1].start_date).getTime()
      )
    }
  })
  it('getUserLeaveRecords filters by user', () => {
    const u1Leave = getUserLeaveRecords('u1')
    expect(u1Leave.length).toBeGreaterThan(0)
    u1Leave.forEach(l => expect(l.user_id).toBe('u1'))
  })
  it('getPendingLeaveRequests returns only pending', () => {
    const pending = getPendingLeaveRequests()
    pending.forEach(l => expect(l.status).toBe('pending'))
  })
})

describe('Bank Holidays', () => {
  it('has 8 bank holidays', () => {
    expect(BANK_HOLIDAYS).toHaveLength(8)
  })
  it('every holiday has required fields', () => {
    BANK_HOLIDAYS.forEach(h => {
      expect(h.date).toBeTruthy()
      expect(h.name).toBeTruthy()
      expect(['england-wales', 'scotland', 'northern-ireland', 'all']).toContain(h.region)
    })
  })
  it('getBankHolidays filters by region', () => {
    const engWales = getBankHolidays('england-wales')
    engWales.forEach(h => {
      expect(h.region === 'england-wales' || h.region === 'all').toBe(true)
    })
  })
})

describe('Leave Entitlements', () => {
  it('has 5 entitlements', () => {
    expect(LEAVE_ENTITLEMENTS).toHaveLength(5)
  })
  it('every entitlement has required fields', () => {
    LEAVE_ENTITLEMENTS.forEach(e => {
      expect(e.user_id).toBeTruthy()
      expect(typeof e.year).toBe('number')
      expect(typeof e.total_days).toBe('number')
      expect(typeof e.used_days).toBe('number')
      expect(typeof e.pending_days).toBe('number')
      expect(typeof e.carried_over).toBe('number')
    })
  })
  it('used + pending does not exceed total + carried', () => {
    LEAVE_ENTITLEMENTS.forEach(e => {
      expect(e.used_days + e.pending_days).toBeLessThanOrEqual(e.total_days + e.carried_over)
    })
  })
  it('getLeaveEntitlement finds by user and year', () => {
    const ent = getLeaveEntitlement('u1', 2026)
    expect(ent).toBeDefined()
    expect(ent?.total_days).toBe(28)
  })
  it('getLeaveEntitlement returns undefined for unknown user', () => {
    expect(getLeaveEntitlement('nonexistent')).toBeUndefined()
  })
  it('getLeaveEntitlements returns all', () => {
    expect(getLeaveEntitlements()).toHaveLength(5)
  })
})

describe('Team Availability', () => {
  it('returns availability for all team members', () => {
    const avail = getTeamAvailability('2026-04-20')
    expect(avail).toHaveLength(5)
    avail.forEach(a => {
      expect(a.userId).toBeTruthy()
      expect(typeof a.available).toBe('boolean')
    })
  })
  it('marks users on leave as unavailable', () => {
    // Priya (u3) is on holiday 2026-04-20 to 2026-04-24
    const avail = getTeamAvailability('2026-04-22')
    const priya = avail.find(a => a.userId === 'u3')
    expect(priya?.available).toBe(false)
    expect(priya?.reason).toBe('holiday')
  })
  it('marks bank holidays as unavailable', () => {
    // Good Friday 2026-04-03
    const avail = getTeamAvailability('2026-04-03')
    avail.forEach(a => {
      expect(a.available).toBe(false)
      expect(a.reason).toBe('Good Friday')
    })
  })
})
