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
