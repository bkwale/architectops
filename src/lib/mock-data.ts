import { User, Project, Task, RIBAStage, ApprovalRequest, Issue, Change, RiskRegisterItem, Meeting, MeetingAction, DesignRisk, ContractAdminRecord, ContractEvent, PlanningRecord, SiteConstraint, TenderRecord, TenderReturn, TenderEvaluation, SiteQuery } from './types'
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

// ── Phase 2: Approvals ──────────────────────────────────────

export const APPROVALS: ApprovalRequest[] = [
  {
    id: 'apr1', project_id: 'p1', item_type: 'task', item_id: 't5',
    item_title: 'Review planning submission package',
    submitted_by_user_id: 'u4', reviewer_user_id: 'u1',
    status: 'pending', submitted_at: d(-2),
    created_at: d(-2), updated_at: d(-2),
  },
  {
    id: 'apr2', project_id: 'p2', item_type: 'document', item_id: 'doc1',
    item_title: 'Concept Design Report v2',
    submitted_by_user_id: 'u3', reviewer_user_id: 'u1',
    status: 'pending', submitted_at: d(-5),
    created_at: d(-5), updated_at: d(-5),
  },
  {
    id: 'apr3', project_id: 'p3', item_type: 'task', item_id: 't15',
    item_title: 'Complete technical design information',
    submitted_by_user_id: 'u2', reviewer_user_id: 'u1',
    status: 'returned', submitted_at: d(-10), reviewed_at: d(-7),
    reviewer_comments: 'Missing structural coordination details. Please update sections 3.2 and 4.1.',
    created_at: d(-10), updated_at: d(-7),
  },
  {
    id: 'apr4', project_id: 'p5', item_type: 'document', item_id: 'doc2',
    item_title: 'Green Roof Specification',
    submitted_by_user_id: 'u2', reviewer_user_id: 'u1',
    status: 'approved', submitted_at: d(-14), reviewed_at: d(-12),
    created_at: d(-14), updated_at: d(-12),
  },
  {
    id: 'apr5', project_id: 'p4', item_type: 'task', item_id: 't20',
    item_title: 'Prepare project brief',
    submitted_by_user_id: 'u3', reviewer_user_id: 'u1',
    status: 'pending', submitted_at: d(-1),
    created_at: d(-1), updated_at: d(-1),
  },
  {
    id: 'apr6', project_id: 'p1', item_type: 'document', item_id: 'doc3',
    item_title: 'Heritage Impact Assessment',
    submitted_by_user_id: 'u2', reviewer_user_id: 'u1',
    status: 'approved', submitted_at: d(-20), reviewed_at: d(-18),
    created_at: d(-20), updated_at: d(-18),
  },
]

// ── Phase 2: Issues ─────────────────────────────────────────

export const ISSUES: Issue[] = [
  {
    id: 'iss1', project_id: 'p1', issue_type: 'Design Coordination',
    title: 'Structural beam clashes with existing window opening',
    description: 'Steel beam at first floor level conflicts with listed window that must be retained.',
    owner_user_id: 'u2', status: 'open', raised_date: d(-5),
  },
  {
    id: 'iss2', project_id: 'p1', issue_type: 'Planning',
    title: 'Conservation officer queries on rear elevation material',
    description: 'LPA conservation officer has raised concerns about proposed zinc cladding.',
    owner_user_id: 'u2', status: 'in_progress', raised_date: d(-12),
  },
  {
    id: 'iss3', project_id: 'p3', issue_type: 'Site',
    title: 'Asbestos found in ceiling void above reception',
    description: 'Survey revealed asbestos-containing materials not on original report.',
    owner_user_id: 'u2', status: 'open', raised_date: d(-3),
  },
  {
    id: 'iss4', project_id: 'p5', issue_type: 'Construction',
    title: 'Foundation depth exceeded specification',
    description: 'Ground conditions required deeper foundations than designed. 300mm additional excavation.',
    owner_user_id: 'u4', status: 'resolved', raised_date: d(-20), resolved_date: d(-8),
  },
  {
    id: 'iss5', project_id: 'p2', issue_type: 'Client',
    title: 'Client wants additional retail unit in ground floor layout',
    description: 'Meridian has asked whether the commercial ground floor can be subdivided into 2 units.',
    owner_user_id: 'u3', status: 'open', raised_date: d(-7),
  },
  {
    id: 'iss6', project_id: 'p3', issue_type: 'Programme',
    title: 'Summer works window at risk due to delayed approvals',
    description: 'Building control submission delay may push main works past school holiday window.',
    owner_user_id: 'u2', status: 'in_progress', raised_date: d(-15),
  },
]

// ── Phase 2: Changes ────────────────────────────────────────

export const CHANGES: Change[] = [
  {
    id: 'chg1', project_id: 'p1', change_type: 'Design',
    title: 'Switch from zinc to lead cladding on rear elevation',
    description: 'Conservation officer preference. Lead more appropriate for Grade II context.',
    initiated_by_user_id: 'u2', date_raised: d(-10),
    commercial_effect_note: 'Additional £3,200 material cost. Lead more labour-intensive to install.',
    programme_effect_note: 'No programme impact — specialist subcontractor available.',
    approval_status: 'approved',
  },
  {
    id: 'chg2', project_id: 'p3', change_type: 'Scope',
    title: 'Add acoustic treatment to hall ceiling',
    description: 'Surrey CC request for improved acoustics in main hall. Not in original brief.',
    initiated_by_user_id: 'u2', date_raised: d(-8),
    commercial_effect_note: 'Approx £8,500 additional. Provisional sum to be agreed.',
    programme_effect_note: '1 week additional in hall fit-out phase.',
    approval_status: 'under_review',
  },
  {
    id: 'chg3', project_id: 'p5', change_type: 'Design',
    title: 'Increase roof insulation to 0.11 U-value',
    description: 'Client wants improved thermal performance beyond Building Regs minimum.',
    initiated_by_user_id: 'u4', date_raised: d(-18),
    commercial_effect_note: '£1,800 uplift in insulation specification.',
    programme_effect_note: 'None — same installation method.',
    approval_status: 'approved',
  },
  {
    id: 'chg4', project_id: 'p2', change_type: 'Client Brief',
    title: 'Subdivide ground floor commercial into two units',
    description: 'Client requests two smaller retail units instead of one large commercial space.',
    initiated_by_user_id: 'u3', date_raised: d(-4),
    commercial_effect_note: 'Additional partition, M&E separation. Estimate £15,000-20,000.',
    programme_effect_note: 'May require revised planning application — 8-12 week delay risk.',
    approval_status: 'raised',
  },
]

// ── Phase 2: Risk Register ──────────────────────────────────

export const RISK_REGISTER: RiskRegisterItem[] = [
  {
    id: 'rr1', project_id: 'p1', risk_type: 'Planning',
    title: 'Listed building consent refusal',
    description: 'Conservation officer may not support proposed contemporary rear extension.',
    probability: 'medium', impact: 'high', owner_user_id: 'u2',
    mitigation: 'Pre-app dialogue ongoing. Material change to lead cladding addresses key concern.',
    status: 'open',
  },
  {
    id: 'rr2', project_id: 'p3', risk_type: 'Programme',
    title: 'School holiday works window missed',
    description: 'Main hall works must complete during summer break. Delay to BC submission threatens this.',
    probability: 'high', impact: 'high', owner_user_id: 'u2',
    mitigation: 'Escalate BC submission. Prepare phasing plan B for term-time works if needed.',
    status: 'open',
  },
  {
    id: 'rr3', project_id: 'p2', risk_type: 'Commercial',
    title: 'Ground floor subdivision triggers new planning application',
    description: 'Change to two retail units may constitute material amendment to planning consent.',
    probability: 'high', impact: 'medium', owner_user_id: 'u3',
    mitigation: 'Seek pre-application advice from LPA before committing to design change.',
    status: 'open',
  },
  {
    id: 'rr4', project_id: 'p5', risk_type: 'Site',
    title: 'Ground conditions worse than survey predicted',
    description: 'Initial foundation excavation showed softer ground at formation level.',
    probability: 'low', impact: 'medium', owner_user_id: 'u4',
    mitigation: 'Deeper foundations already installed. Monitoring settlement.',
    status: 'mitigated',
  },
  {
    id: 'rr5', project_id: 'p4', risk_type: 'Budget',
    title: 'Community consultation delays briefing stage',
    description: 'Southwark community engagement process may extend Stage 1 timeline.',
    probability: 'medium', impact: 'low', owner_user_id: 'u3',
    mitigation: 'Build 4-week buffer into programme for consultation period.',
    status: 'open',
  },
]

// ── Phase 2: Meetings ───────────────────────────────────────

export const MEETINGS: Meeting[] = [
  {
    id: 'm1', project_id: 'p1', meeting_type: 'design_team',
    title: 'Design Team Meeting #14',
    meeting_date: d(-3), location: 'Studio Mitchell Office',
    organiser_user_id: 'u2',
    notes: 'Reviewed coordinated layout. Agreed to progress MEP coordination next week.',
  },
  {
    id: 'm2', project_id: 'p1', meeting_type: 'client_review',
    title: 'Client Review — Stage 3 Progress',
    meeting_date: d(-10), location: 'Client Residence',
    organiser_user_id: 'u2',
    notes: 'Client happy with layout progression. Concerned about rear elevation materials.',
  },
  {
    id: 'm3', project_id: 'p3', meeting_type: 'site_meeting',
    title: 'Site Visit — Asbestos Assessment',
    meeting_date: d(-2), location: 'Weybridge Primary School',
    organiser_user_id: 'u2',
    notes: 'Specialist surveyor confirmed ACMs in ceiling void. R&D survey booked.',
  },
  {
    id: 'm4', project_id: 'p2', meeting_type: 'client_review',
    title: 'Client Briefing — Concept Options',
    meeting_date: d(-7), location: 'Meridian Developments Office',
    organiser_user_id: 'u3',
    notes: 'Presented 3 massing options. Client prefers Option B with ground floor subdivision.',
  },
  {
    id: 'm5', project_id: 'p5', meeting_type: 'contractor',
    title: 'Contractor Progress Meeting #8',
    meeting_date: d(-1), location: 'Dulwich Site',
    organiser_user_id: 'u2',
    notes: 'Green roof substrate delivery confirmed for next Thursday. Glazing on programme.',
  },
  {
    id: 'm6', project_id: 'p4', meeting_type: 'consultant',
    title: 'Consultant Kick-off Meeting',
    meeting_date: d(-14), location: 'Teams Call',
    organiser_user_id: 'u3',
    notes: 'Structural and M&E consultants appointed. Agreed scope and fee basis.',
  },
  {
    id: 'm7', project_id: 'p3', meeting_type: 'design_team',
    title: 'Design Team Meeting #22',
    meeting_date: d(2), location: 'Studio Mitchell Office',
    organiser_user_id: 'u2',
    notes: '',
  },
]

// ── Phase 2: Meeting Actions ────────────────────────────────

export const MEETING_ACTIONS: MeetingAction[] = [
  { id: 'ma1', meeting_id: 'm1', action_description: 'Issue updated coordinated layout to structural engineer', assigned_to_user_id: 'u2', due_date: d(2), status: 'open' },
  { id: 'ma2', meeting_id: 'm1', action_description: 'Confirm M&E consultant availability for coordination workshop', assigned_to_user_id: 'u4', due_date: d(5), status: 'open' },
  { id: 'ma3', meeting_id: 'm2', action_description: 'Prepare rear elevation material samples for client review', assigned_to_user_id: 'u2', due_date: d(-3), status: 'overdue' },
  { id: 'ma4', meeting_id: 'm3', action_description: 'Obtain asbestos R&D survey quote', assigned_to_user_id: 'u2', due_date: d(3), status: 'open' },
  { id: 'ma5', meeting_id: 'm3', action_description: 'Notify Surrey CC of asbestos discovery', assigned_to_user_id: 'u2', due_date: d(0), status: 'done' },
  { id: 'ma6', meeting_id: 'm4', action_description: 'Develop Option B with subdivided ground floor', assigned_to_user_id: 'u3', due_date: d(10), status: 'open' },
  { id: 'ma7', meeting_id: 'm4', action_description: 'Check planning implications of unit subdivision', assigned_to_user_id: 'u5', due_date: d(5), status: 'open' },
  { id: 'ma8', meeting_id: 'm5', action_description: 'Confirm green roof membrane spec with supplier', assigned_to_user_id: 'u4', due_date: d(4), status: 'open' },
  { id: 'ma9', meeting_id: 'm6', action_description: 'Share site survey data pack with consultants', assigned_to_user_id: 'u3', due_date: d(-7), status: 'done' },
  { id: 'ma10', meeting_id: 'm6', action_description: 'Agree consultant fee proposals', assigned_to_user_id: 'u1', due_date: d(-3), status: 'overdue' },
]

// ── Phase 2 Wave 2: Design Risks ────────────────────────────

export const DESIGN_RISKS: DesignRisk[] = [
  {
    id: 'dr1', project_id: 'p1', stage_code: 3,
    title: 'Structural intervention at party wall',
    description: 'New steel frame bears onto existing party wall. Risk of differential movement and cracking to neighbour property.',
    unusual_or_significant_flag: true,
    mitigation: 'Independent structural survey of party wall. Movement joints at interface. Party wall agreement in place.',
    residual_risk_note: 'Monitor during construction. Pre-condition survey completed.',
    owner_user_id: 'u2', review_status: 'under_review',
    created_at: d(-15), updated_at: d(-3),
  },
  {
    id: 'dr2', project_id: 'p1', stage_code: 3,
    title: 'Flat roof drainage falls insufficient',
    description: 'Existing structure limits achievable falls on new flat roof extension. Risk of ponding.',
    unusual_or_significant_flag: false,
    mitigation: 'Tapered insulation to achieve 1:60 minimum falls. Secondary outlet specified.',
    owner_user_id: 'u4', review_status: 'accepted',
    created_at: d(-20), updated_at: d(-10),
  },
  {
    id: 'dr3', project_id: 'p3', stage_code: 4,
    title: 'Acoustic separation between classrooms below spec',
    description: 'Existing block walls may not achieve BB93 requirements after refurbishment.',
    unusual_or_significant_flag: true,
    mitigation: 'Acoustic testing before works. IWL system to be specified if needed.',
    owner_user_id: 'u2', review_status: 'open',
    created_at: d(-8), updated_at: d(-2),
  },
  {
    id: 'dr4', project_id: 'p2', stage_code: 2,
    title: 'Daylight to rear habitable rooms',
    description: 'Massing Option B reduces daylight factor to rear bedrooms below BRE minimum.',
    unusual_or_significant_flag: false,
    mitigation: 'Daylight study commissioned. May require layout adjustment or larger window openings.',
    owner_user_id: 'u3', review_status: 'open',
    created_at: d(-6), updated_at: d(-4),
  },
  {
    id: 'dr5', project_id: 'p5', stage_code: 5,
    title: 'Green roof waterproofing warranty gap',
    description: 'Main roof and green roof supplier warranties do not overlap. 10-year gap in cover.',
    unusual_or_significant_flag: true,
    mitigation: 'Negotiate combined warranty. Alternatively, require collateral warranty from green roof installer.',
    residual_risk_note: 'Client accepts risk if combined warranty not achievable.',
    owner_user_id: 'u2', review_status: 'under_review',
    created_at: d(-12), updated_at: d(-1),
  },
]

// ── Phase 2 Wave 2: Contract Administration ─────────────────

export const CONTRACT_ADMIN_RECORDS: ContractAdminRecord[] = [
  {
    id: 'ca1', project_id: 'p3',
    procurement_route: 'traditional', contract_form: 'JCT_MW',
    administrator_role: 'Contract Administrator — Studio Mitchell Architects',
    key_dates_json: JSON.stringify({ possession: d(-30), practical_completion: d(45), defects_end: d(410) }),
    notes: 'Minor works contract. Single-stage tender completed.',
  },
  {
    id: 'ca2', project_id: 'p5',
    procurement_route: 'design_and_build', contract_form: 'JCT_DB',
    administrator_role: 'Employer Agent — Studio Mitchell Architects',
    key_dates_json: JSON.stringify({ possession: d(-60), practical_completion: d(30), defects_end: d(395) }),
    notes: 'D&B contract with employer requirements. Novated design team.',
  },
]

export const CONTRACT_EVENTS: ContractEvent[] = [
  {
    id: 'ce1', project_id: 'p3', event_type: 'Architect Instruction',
    event_ref: 'AI-001', title: 'Asbestos removal — revised specification',
    description: 'Instruction to contractor to proceed with licensed asbestos removal in ceiling void.',
    issue_date: d(-2), response_due_date: d(5),
    status: 'issued', created_by_user_id: 'u2',
    created_at: d(-2), updated_at: d(-2),
  },
  {
    id: 'ce2', project_id: 'p3', event_type: 'Extension of Time',
    event_ref: 'EOT-001', title: 'EOT claim — asbestos discovery delay',
    description: 'Contractor claims 2-week extension due to unforeseen asbestos.',
    issue_date: d(-1), response_due_date: d(12),
    status: 'issued', created_by_user_id: 'u2',
    created_at: d(-1), updated_at: d(-1),
  },
  {
    id: 'ce3', project_id: 'p5', event_type: 'Architect Instruction',
    event_ref: 'AI-003', title: 'Increase roof insulation specification',
    description: 'Revised insulation build-up to achieve 0.11 U-value as per client instruction.',
    issue_date: d(-14), response_due_date: d(-7),
    status: 'responded', created_by_user_id: 'u2',
    created_at: d(-14), updated_at: d(-6),
  },
  {
    id: 'ce4', project_id: 'p5', event_type: 'Interim Valuation',
    event_ref: 'IV-004', title: 'Interim Valuation #4',
    description: 'Monthly valuation for payment certification.',
    issue_date: d(-5), response_due_date: d(-1),
    status: 'overdue', created_by_user_id: 'u2',
    created_at: d(-5), updated_at: d(-5),
  },
  {
    id: 'ce5', project_id: 'p3', event_type: 'Architect Instruction',
    event_ref: 'AI-002', title: 'Acoustic ceiling treatment to main hall',
    description: 'Instruction to include acoustic treatment per change request.',
    issue_date: d(-4), response_due_date: d(10),
    status: 'draft', created_by_user_id: 'u2',
    created_at: d(-4), updated_at: d(-4),
  },
]

// ── Phase 2 Wave 2: Planning Records ────────────────────────

export const PLANNING_RECORDS: PlanningRecord[] = [
  {
    id: 'pl1', project_id: 'p1', record_type: 'Full Planning Application',
    reference: '2025/LB/0342', title: 'Two-storey rear extension and loft conversion',
    description: 'Full planning application including heritage statement.',
    date_submitted: '2025-11-15', date_determined: '2026-02-20',
    status: 'Approved with conditions',
    notes: 'Condition 3 requires materials sample panel before commencement.',
  },
  {
    id: 'pl2', project_id: 'p1', record_type: 'Listed Building Consent',
    reference: '2025/LB/0343', title: 'Internal and external alterations to Grade II listed dwelling',
    description: 'LBC application for structural alterations and new openings.',
    date_submitted: '2025-11-15',
    status: 'Pending determination',
    notes: 'Conservation officer site visit scheduled.',
  },
  {
    id: 'pl3', project_id: 'p2', record_type: 'Pre-application',
    reference: 'PRE/2025/0089', title: 'Pre-app for 12-unit mixed-use development',
    description: 'Pre-application meeting with LPA planning officer.',
    date_submitted: '2025-12-01', date_determined: '2026-01-15',
    status: 'Feedback received',
    notes: 'Positive on principle. Height concerns on south elevation.',
  },
  {
    id: 'pl4', project_id: 'p4', record_type: 'Pre-application',
    reference: 'PRE/2026/0015', title: 'Community hub feasibility discussion',
    description: 'Initial planning guidance meeting with Southwark planning team.',
    date_submitted: '2026-02-10',
    status: 'Meeting scheduled',
  },
]

export const SITE_CONSTRAINTS: SiteConstraint[] = [
  {
    id: 'sc1', project_id: 'p1', constraint_type: 'Listed Building',
    title: 'Grade II Listed — Harris House',
    description: 'Property is Grade II listed. All external and structural changes require LBC.',
    severity: 'high',
    mitigation: 'LBC application submitted alongside planning. Heritage consultant engaged.',
  },
  {
    id: 'sc2', project_id: 'p1', constraint_type: 'Conservation Area',
    title: 'Riverside Conservation Area',
    description: 'Site within designated conservation area. Enhanced design scrutiny applies.',
    severity: 'medium',
    mitigation: 'Design approach follows conservation area guidance. Materials palette agreed with CO.',
  },
  {
    id: 'sc3', project_id: 'p3', constraint_type: 'Access',
    title: 'School operational during partial works',
    description: 'School remains operational during Phase 1 works. Strict safeguarding requirements.',
    severity: 'high',
    mitigation: 'Hoarding and segregated access routes. DBS checks for all site operatives.',
  },
  {
    id: 'sc4', project_id: 'p2', constraint_type: 'Flood Risk',
    title: 'Flood Zone 2 — partial site coverage',
    description: 'Rear portion of site within Environment Agency Flood Zone 2.',
    severity: 'medium',
    mitigation: 'FRA completed. Finished floor levels raised 300mm above predicted flood level.',
  },
  {
    id: 'sc5', project_id: 'p5', constraint_type: 'Trees',
    title: 'Protected oak tree (TPO)',
    description: 'Mature oak on south boundary covered by TPO. Root protection area extends into build zone.',
    severity: 'medium',
    mitigation: 'Foundation design uses mini-piles to avoid root zone. Arboricultural method statement approved.',
  },
]

// ── Phase 2 Wave 2: Tenders ─────────────────────────────────

export const TENDER_RECORDS: TenderRecord[] = [
  {
    id: 'tr1', project_id: 'p3',
    tender_name: 'Main Works Contract — Weybridge School Refurb',
    procurement_route: 'Single-stage selective', itt_issue_date: '2025-12-01', return_date: '2026-01-15',
    status: 'awarded',
    notes: 'Awarded to Meridian Construction Ltd. 4 tenders received.',
  },
  {
    id: 'tr2', project_id: 'p5',
    tender_name: 'Garden Studio — D&B Contract',
    procurement_route: 'Negotiated D&B', itt_issue_date: '2025-09-15', return_date: '2025-10-10',
    status: 'awarded',
    notes: 'Negotiated with Patterson Build Ltd on D&B basis.',
  },
  {
    id: 'tr3', project_id: 'p1',
    tender_name: 'Riverside House Extension — Main Contract',
    procurement_route: 'Single-stage selective', itt_issue_date: d(14), return_date: d(42),
    status: 'preparation',
    notes: 'Tender pack in preparation. 5 contractors on shortlist.',
  },
]

export const TENDER_RETURNS: TenderReturn[] = [
  {
    id: 'tret1', tender_record_id: 'tr1', bidder_name: 'Meridian Construction Ltd',
    return_date: '2026-01-14', compliance_status: 'Compliant',
    price_summary: '£342,500', notes: 'Lowest compliant tender.',
  },
  {
    id: 'tret2', tender_record_id: 'tr1', bidder_name: 'Oakwood Builders',
    return_date: '2026-01-15', compliance_status: 'Compliant',
    price_summary: '£368,200', notes: 'Good quality submission. Higher programme risk.',
  },
  {
    id: 'tret3', tender_record_id: 'tr1', bidder_name: 'Summit Projects',
    return_date: '2026-01-15', compliance_status: 'Non-compliant',
    price_summary: '£310,000', notes: 'Excluded provisional sums. Non-compliant.',
  },
  {
    id: 'tret4', tender_record_id: 'tr1', bidder_name: 'Hayfield Contracting',
    return_date: '2026-01-13', compliance_status: 'Compliant',
    price_summary: '£385,900', notes: 'Highest tender. Strong quality score.',
  },
]

export const TENDER_EVALUATIONS: TenderEvaluation[] = [
  { id: 'te1', tender_return_id: 'tret1', criterion_name: 'Price', weighting: 60, score: 95, evaluator_user_id: 'u1', notes: 'Lowest price.' },
  { id: 'te2', tender_return_id: 'tret1', criterion_name: 'Quality', weighting: 30, score: 78, evaluator_user_id: 'u2', notes: 'Good methodology.' },
  { id: 'te3', tender_return_id: 'tret1', criterion_name: 'Programme', weighting: 10, score: 80, evaluator_user_id: 'u2', notes: 'Achievable programme.' },
  { id: 'te4', tender_return_id: 'tret2', criterion_name: 'Price', weighting: 60, score: 72, evaluator_user_id: 'u1' },
  { id: 'te5', tender_return_id: 'tret2', criterion_name: 'Quality', weighting: 30, score: 85, evaluator_user_id: 'u2', notes: 'Strongest quality submission.' },
  { id: 'te6', tender_return_id: 'tret2', criterion_name: 'Programme', weighting: 10, score: 65, evaluator_user_id: 'u2', notes: '2 weeks longer than others.' },
  { id: 'te7', tender_return_id: 'tret4', criterion_name: 'Price', weighting: 60, score: 55, evaluator_user_id: 'u1' },
  { id: 'te8', tender_return_id: 'tret4', criterion_name: 'Quality', weighting: 30, score: 90, evaluator_user_id: 'u2', notes: 'Excellent quality.' },
  { id: 'te9', tender_return_id: 'tret4', criterion_name: 'Programme', weighting: 10, score: 85, evaluator_user_id: 'u2' },
]

// ── Phase 2 Wave 2: Site Queries ────────────────────────────

export const SITE_QUERIES: SiteQuery[] = [
  {
    id: 'sq1', project_id: 'p5', title: 'Foundation depth at point F3',
    description: 'Contractor requests clarification on foundation depth at grid intersection F3 — drawing shows 1200mm but ground conditions suggest 1500mm needed.',
    raised_by_user_id: 'u4', owner_user_id: 'u2', due_date: d(3),
    status: 'open', created_at: d(-1), updated_at: d(-1),
  },
  {
    id: 'sq2', project_id: 'p5', title: 'DPM overlap detail at threshold',
    description: 'How should DPM lap be detailed at the sliding door threshold where it meets external drainage channel?',
    raised_by_user_id: 'u4', owner_user_id: 'u2', due_date: d(5),
    status: 'open', created_at: d(-2), updated_at: d(-2),
  },
  {
    id: 'sq3', project_id: 'p5', title: 'Structural steel finish in exposed area',
    description: 'Exposed steel beam in studio — should this be intumescent painted or left as galvanised?',
    raised_by_user_id: 'u4', owner_user_id: 'u2', due_date: d(-2),
    status: 'responded', response_notes: 'Intumescent paint to achieve 60min fire rating. Colour RAL 9005 to match joinery.',
    created_at: d(-7), updated_at: d(-2),
  },
  {
    id: 'sq4', project_id: 'p3', title: 'Ceiling void access hatch locations',
    description: 'Asbestos survey requires additional access hatches in corridors. Confirm positions.',
    raised_by_user_id: 'u2', owner_user_id: 'u2', due_date: d(1),
    status: 'open', created_at: d(-3), updated_at: d(-3),
  },
  {
    id: 'sq5', project_id: 'p3', title: 'Fire door ironmongery spec',
    description: 'Existing fire doors being replaced. Confirm ironmongery schedule for FD30S doors.',
    raised_by_user_id: 'u4', owner_user_id: 'u2', due_date: d(-5),
    status: 'closed', response_notes: 'Ironmongery schedule issued as drawing SK-42 Rev A.',
    created_at: d(-14), updated_at: d(-5),
  },
]

// ── Lookup Helpers ──────────────────────────────────────────

export function getProjectTasks(projectId: string): Task[] {
  return ALL_TASKS.filter(t => t.project_id === projectId)
}

export function getUser(userId: string): User | undefined {
  return USERS.find(u => u.id === userId)
}

export function getProject(projectId: string): Project | undefined {
  return PROJECTS.find(p => p.id === projectId)
}

export function getProjectApprovals(projectId: string): ApprovalRequest[] {
  return APPROVALS.filter(a => a.project_id === projectId)
}

export function getProjectIssues(projectId: string): Issue[] {
  return ISSUES.filter(i => i.project_id === projectId)
}

export function getProjectChanges(projectId: string): Change[] {
  return CHANGES.filter(c => c.project_id === projectId)
}

export function getProjectRisks(projectId: string): RiskRegisterItem[] {
  return RISK_REGISTER.filter(r => r.project_id === projectId)
}

export function getProjectMeetings(projectId: string): Meeting[] {
  return MEETINGS.filter(m => m.project_id === projectId)
}

export function getMeetingActions(meetingId: string): MeetingAction[] {
  return MEETING_ACTIONS.filter(a => a.meeting_id === meetingId)
}

export function getProjectDesignRisks(projectId: string): DesignRisk[] {
  return DESIGN_RISKS.filter(r => r.project_id === projectId)
}

export function getProjectContractAdmin(projectId: string): ContractAdminRecord | undefined {
  return CONTRACT_ADMIN_RECORDS.find(c => c.project_id === projectId)
}

export function getProjectContractEvents(projectId: string): ContractEvent[] {
  return CONTRACT_EVENTS.filter(e => e.project_id === projectId)
}

export function getProjectPlanningRecords(projectId: string): PlanningRecord[] {
  return PLANNING_RECORDS.filter(p => p.project_id === projectId)
}

export function getProjectSiteConstraints(projectId: string): SiteConstraint[] {
  return SITE_CONSTRAINTS.filter(s => s.project_id === projectId)
}

export function getProjectTenders(projectId: string): TenderRecord[] {
  return TENDER_RECORDS.filter(t => t.project_id === projectId)
}

export function getTenderReturns(tenderRecordId: string): TenderReturn[] {
  return TENDER_RETURNS.filter(r => r.tender_record_id === tenderRecordId)
}

export function getTenderEvaluations(tenderReturnId: string): TenderEvaluation[] {
  return TENDER_EVALUATIONS.filter(e => e.tender_return_id === tenderReturnId)
}

export function getProjectSiteQueries(projectId: string): SiteQuery[] {
  return SITE_QUERIES.filter(q => q.project_id === projectId)
}
