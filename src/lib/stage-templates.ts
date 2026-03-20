import { RIBAStage } from './types'

export interface StageTemplate {
  stage: RIBAStage
  task_title: string
  task_description: string
  required_flag: boolean
  sort_order: number
}

export const STAGE_TEMPLATES: StageTemplate[] = [
  // Stage 0 — Strategic Definition
  { stage: 0, task_title: 'Confirm project objectives', task_description: 'Agree core project objectives with client and key stakeholders.', required_flag: true, sort_order: 1 },
  { stage: 0, task_title: 'Record initial client brief', task_description: 'Document the initial brief including aspirations, budget range and key dates.', required_flag: true, sort_order: 2 },
  { stage: 0, task_title: 'Identify key constraints', task_description: 'Record site, planning, budget and programme constraints.', required_flag: false, sort_order: 3 },
  { stage: 0, task_title: 'Confirm procurement route', task_description: 'Agree initial procurement strategy assumptions.', required_flag: false, sort_order: 4 },

  // Stage 1 — Preparation & Briefing
  { stage: 1, task_title: 'Prepare project brief', task_description: 'Develop detailed project brief from initial client brief.', required_flag: true, sort_order: 1 },
  { stage: 1, task_title: 'Confirm site information', task_description: 'Collate site survey, topographical and environmental data.', required_flag: true, sort_order: 2 },
  { stage: 1, task_title: 'Define project programme', task_description: 'Set initial programme assumptions and key milestones.', required_flag: true, sort_order: 3 },
  { stage: 1, task_title: 'Appoint consultant team', task_description: 'Confirm consultant appointments and scope of services.', required_flag: false, sort_order: 4 },
  { stage: 1, task_title: 'Prepare feasibility studies', task_description: 'Undertake any required feasibility or options studies.', required_flag: false, sort_order: 5 },

  // Stage 2 — Concept Design
  { stage: 2, task_title: 'Develop concept proposals', task_description: 'Prepare initial design concepts responding to brief.', required_flag: true, sort_order: 1 },
  { stage: 2, task_title: 'Review planning strategy', task_description: 'Assess planning requirements and pre-application advice.', required_flag: true, sort_order: 2 },
  { stage: 2, task_title: 'Coordinate initial consultant input', task_description: 'Integrate structural, M&E and other consultant input into concept.', required_flag: false, sort_order: 3 },
  { stage: 2, task_title: 'Prepare outline specification', task_description: 'Draft initial material and specification strategy.', required_flag: false, sort_order: 4 },
  { stage: 2, task_title: 'Client concept sign-off', task_description: 'Present concept design to client for approval.', required_flag: true, sort_order: 5 },

  // Stage 3 — Spatial Coordination
  { stage: 3, task_title: 'Develop coordinated design', task_description: 'Progress design to coordinated stage with all consultants.', required_flag: true, sort_order: 1 },
  { stage: 3, task_title: 'Review planning submission package', task_description: 'Prepare and review drawings and documents for planning.', required_flag: true, sort_order: 2 },
  { stage: 3, task_title: 'Confirm key spatial decisions', task_description: 'Lock critical spatial relationships, floor areas and layouts.', required_flag: true, sort_order: 3 },
  { stage: 3, task_title: 'Cost plan review', task_description: 'Review cost plan against design development.', required_flag: false, sort_order: 4 },

  // Stage 4 — Technical Design
  { stage: 4, task_title: 'Complete technical design information', task_description: 'Prepare full technical design package for construction.', required_flag: true, sort_order: 1 },
  { stage: 4, task_title: 'Coordinate consultant technical input', task_description: 'Integrate all consultant technical packages.', required_flag: true, sort_order: 2 },
  { stage: 4, task_title: 'Review issue package', task_description: 'QA review of issue drawings and specifications.', required_flag: true, sort_order: 3 },
  { stage: 4, task_title: 'Prepare construction issue drawings', task_description: 'Finalise drawings for tender or construction issue.', required_flag: false, sort_order: 4 },
  { stage: 4, task_title: 'Building control submission', task_description: 'Submit building regulations application or initial notice.', required_flag: false, sort_order: 5 },

  // Stage 5 — Manufacturing & Construction
  { stage: 5, task_title: 'Record construction queries', task_description: 'Log and respond to RFIs and site queries.', required_flag: true, sort_order: 1 },
  { stage: 5, task_title: 'Monitor site information flow', task_description: 'Track information required and issued schedules.', required_flag: true, sort_order: 2 },
  { stage: 5, task_title: 'Review progress against design intent', task_description: 'Conduct site inspections and monitor design compliance.', required_flag: false, sort_order: 3 },
  { stage: 5, task_title: 'Review material submissions', task_description: 'Approve contractor material and product submissions.', required_flag: false, sort_order: 4 },

  // Stage 6 — Handover
  { stage: 6, task_title: 'Prepare handover items', task_description: 'Compile O&M manuals, as-builts and handover documentation.', required_flag: true, sort_order: 1 },
  { stage: 6, task_title: 'Record outstanding defects', task_description: 'Document snagging list and outstanding defect actions.', required_flag: true, sort_order: 2 },
  { stage: 6, task_title: 'Final inspection and sign-off', task_description: 'Conduct final inspection and confirm practical completion.', required_flag: false, sort_order: 3 },

  // Stage 7 — Use
  { stage: 7, task_title: 'Record post-completion review', task_description: 'Conduct post-occupancy evaluation and review.', required_flag: true, sort_order: 1 },
  { stage: 7, task_title: 'Capture lessons learned', task_description: 'Document lessons learned for practice knowledge base.', required_flag: false, sort_order: 2 },
]
