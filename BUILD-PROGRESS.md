# ArchitectOps — Build Progress

## Phase 1 — COMPLETE
Core RIBA stage tracking, project dashboards, task management, risk detection engine.

## Phase 2 — COMPLETE

### Wave 1 (Complete)
- Approvals queue
- Registers (Issues, Changes, Risk Register)
- Meetings & Actions
- Enhanced practice dashboard

### Wave 2 (Complete)
- Design Risk workspace
- Contract Administration
- Planning & Site Context
- Tender / ITT / Evaluation
- Site Queries

### Wave 3 (Complete — built in Phase 3 Wave 1)
- Building Regulations: `/projects/[id]/building-regs`
- BRPD / Dutyholder Coordination: `/projects/[id]/brpd`
- Enhanced Documents Register: `/projects/[id]/documents`

## Phase 3

### Wave 1 — Foundation (COMPLETE)
| Feature | Route | Status |
|---------|-------|--------|
| Building Regulations | `/projects/[id]/building-regs` | Done |
| BRPD / Dutyholders | `/projects/[id]/brpd` | Done |
| Enhanced Documents | `/projects/[id]/documents` | Done |
| Knowledge Base Library | `/knowledge` | Done |
| Knowledge Article Detail | `/knowledge/[id]` | Done |
| CPD Dashboard | `/cpd` | Done |
| Competence Matrix | `/cpd/competence` | Done |
| Training Plans | `/cpd/training` | Done |
| Admin Controls | `/settings/admin` | Done |
| International Settings | `/settings/international` | Done |

**Types added:** 25+ new interfaces and type aliases
**Mock data:** 13 new data arrays, 22 new helper functions
**Sidebar:** Updated with Knowledge Base, CPD & Training, Settings sections
**Project workspaces:** Added Building Regs, BRPD, Documents links

### Wave 2 — Intelligence (COMPLETE)
| Feature | Route | Status |
|---------|-------|--------|
| Drawing Issue Intelligence | `/analytics/drawing-issues` | Done |
| Commercial Analytics | `/analytics/commercial` | Done |
| Cashflow Forecast | `/analytics/cashflow` | Done |
| Portfolio Health Dashboard | `/analytics/portfolio` | Done |
| Staffing Forecasts | `/staffing` | Done |

**Types added:** 8 new interfaces (DrawingIssueRecord, ProjectCommercial, CashflowForecast, StaffAllocation, StaffCapacity, etc.)
**Mock data:** 5 new data arrays (14 drawing issues, 6 project commercials, 9 cashflow months, 12 allocations, 5 capacities), 9 helper functions
**Sidebar:** Added Analytics section (Portfolio, Commercial, Cashflow, Drawing Issues) + Staffing nav item

### Wave 3 — Commercial (COMPLETE)
| Feature | Route | Status |
|---------|-------|--------|
| Fee Recommendations | `/fee-recommendations` | Done |
| Fee Quote Builder | `/fee-quotes` + `/fee-quotes/[id]` | Done |
| Opportunities / Proposals | `/opportunities` | Done |

**Types added:** FeeRecommendation, FeeQuoteRecord, FeeQuoteStatus, FeeQuoteLineItem, Opportunity, OpportunityStatus
**Mock data:** 3 fee recommendations, 4 fee quotes with 16 line items, 6 opportunities, 9 helper functions
**Utils:** feeQuoteStatusColor/Label, opportunityStatusColor/Label, confidenceBadgeColor, formatCurrency/formatPercent reused
**Sidebar:** Added Commercial section (Fee Benchmarks, Fee Quotes, Opportunities)

### Wave 4 — AI & Integrations (COMPLETE)
| Feature | Route | Status |
|---------|-------|--------|
| AI Teammate (Global Chat) | `/ai` | Done |
| AI Teammate (Project Panel) | `/projects/[id]/ai` | Done |
| Integrations Hub (Xero/QB/Outlook/etc) | `/settings/integrations` | Done |
| External Collaboration Portal | `/portal` | Done |

**Types added:** AIConversation, AIMessage, AISource, AISuggestedPrompt, Integration, IntegrationProvider, IntegrationStatus, PortalInvite, PortalSharedItem, PortalAccessLevel
**Mock data:** 3 AI conversations (8 messages), 10 suggested prompts, 6 integrations (accounting/calendar/storage), 5 portal invites, 6 shared items, 12 helper functions
**Utils:** integrationStatusColor/Label/Dot, portalAccessLabel/Color, portalItemTypeIcon, timeAgo
**Sidebar:** Added AI Teammate, Portal (Navigate); Integrations (Settings)

## Phase 4 — IN PROGRESS

### Wave 1 — Commercial Foundation (COMPLETE)
| Feature | Route | Status |
|---------|-------|--------|
| Enhanced Fee Quote Builder | `/fee-quotes/[id]/edit` | Done |
| Fee Quote Analytics | `/analytics/quotes` | Done |
| Numbering & Templates Admin | `/settings/numbering` | Done |
| Fee Quotes List (rebuilt) | `/fee-quotes` | Done |

**Types updated:** FeeQuoteRecord (22 new fields), FeeQuoteLineItem (10 new fields), FeeQuoteStatus (8 statuses), Task (5 new fields)
**Types added:** FeeQuoteSection, FeeQuoteView, FeeQuoteTemplate, TermsLibraryItem, ExclusionsLibraryItem, ProjectHealthSnapshot, TaskScheduleMetric, ProjectNumberTemplate, QuoteNumberTemplate, DrawingIssueTemplate, QuoteSectionType
**Mock data:** 6 fee quotes (all statuses), 19 line items, 11 quote sections, 10 view tracking entries, 3 templates, 4 terms library, 5 exclusions library, 17 health snapshots, 7 numbering templates, 10 new helper functions
**Utils:** Updated feeQuoteStatusColor/Label (8 statuses), added quoteSectionTypeLabel, numberingPreview, quoteNeedsFollowUp, healthScoreColor/Bg
**Sidebar:** Added Quote Performance (Analytics), Numbering (Settings)

### Wave 2 — Health Engine (COMPLETE)
| Feature | Route | Status |
|---------|-------|--------|
| Project Health 2.0 (scorecards, alerts, burn vs budget) | `/projects/[id]/health` | Done |
| Portfolio Health & Commercial Analytics 2.0 | `/analytics/portfolio` (upgrade) | Done |
| Quote-to-Project Linking (acceptance → project creation) | `/fee-quotes/[id]` (upgrade) | Done |
| Quote Analytics Dashboard | `/analytics/quotes` (upgrade) | Done |

**Types added:** ProjectHealthAlert, BurnBudgetMetric, QuoteProjectLink, QuoteConversionMetric, HealthAlertSeverity, HealthAlertCategory
**Mock data:** 9 health alerts, 9 burn-budget metrics, 5 quote-project links, 5 conversion metrics, 7 new helper functions
**Utils:** healthAlertSeverityColor/Dot, healthAlertCategoryLabel/Icon, burnRatioColor/Bg, varianceColor, formatBurnRatio
**Project workspace:** Added Health link to project dashboard
**Upgrades:** Portfolio (health trends, alert summary, at-risk deep dive), Quote detail (project linking workflow), Quote analytics (win rate by sector, pipeline forecast, time-to-accept)

### Wave 3 — Compliance (COMPLETE)
| Feature | Route | Status |
|---------|-------|--------|
| BRPD Workspace 2.0 (compliance statements, requirements tracker) | `/projects/[id]/brpd` (upgrade) | Done |
| BRPD Changelog & Document Control | `/projects/[id]/brpd/changelog` | Done |
| Drawing Issue & Email Workflow | `/projects/[id]/drawing-issues` | Done |

**Types added:** ComplianceStatement, ComplianceStatementStatus, BRPDRequirement, BRPDRequirementStatus, BRPDChangelogEntry, BRPDChangeType, DrawingIssueWorkflow, DrawingWorkflowStatus, DrawingEmail, DrawingEmailDirection
**Mock data:** 7 compliance statements, 8 BRPD requirements, 10 changelog entries, 6 drawing workflows, 11 drawing emails, 10 helper functions
**Utils:** complianceStatementStatusColor/Label, brpdRequirementStatusColor/Label, brpdChangeTypeLabel/Color, drawingWorkflowStatusColor/Label, drawingEmailDirectionLabel/Color, requirementCategoryLabel/Color
**Project workspaces:** Added BRPD Changelog, Drawing Issues links

### Wave 4 — Project Creation (NOT STARTED)
| Feature | Route | Status |
|---------|-------|--------|
| New Project / Brief Creation 2.0 (12-step wizard) | `/projects/new` (upgrade) | Pending |
| Project Brief Document Builder | `/projects/[id]/brief` | Pending |
| Xero / QuickBooks Quote Linkage | `/settings/integrations` (upgrade) | Pending |
| Role-Based Visibility Controls | `/settings/admin` (upgrade) | Pending |

## Current Route Map

### Top-level routes
- `/` — Practice Overview Dashboard
- `/projects` — Projects listing
- `/projects/new` — New project form
- `/projects/[id]` — Project dashboard
- `/approvals` — Approvals queue
- `/knowledge` — Knowledge Base library
- `/knowledge/[id]` — Knowledge article detail
- `/cpd` — CPD Dashboard
- `/cpd/competence` — Competence Matrix
- `/cpd/training` — Training Plans
- `/staffing` — Staffing Forecast & Utilisation
- `/analytics/portfolio` — Portfolio Health Dashboard
- `/analytics/commercial` — Commercial Performance
- `/analytics/cashflow` — Cashflow Forecast
- `/analytics/drawing-issues` — Drawing Issue Intelligence
- `/fee-recommendations` — Fee Benchmarks & Recommendations
- `/fee-quotes` — Fee Quotes dashboard (rebuilt Phase 4)
- `/fee-quotes/[id]` — Fee Quote detail (line items, terms)
- `/fee-quotes/[id]/edit` — Fee Quote visual builder (Phase 4)
- `/analytics/quotes` — Quote Performance analytics (Phase 4)
- `/opportunities` — Opportunities & Pipeline
- `/ai` — AI Teammate (global portfolio chat)
- `/projects/[id]/ai` — AI Teammate (project-scoped chat)
- `/portal` — External Collaboration Portal
- `/settings/admin` — Admin Controls (AI governance)
- `/settings/international` — International & Jurisdiction settings
- `/settings/integrations` — Integrations Hub (Xero, Outlook, SharePoint, etc)
- `/settings/numbering` — Numbering & Templates Admin (Phase 4)

### Project sub-routes (`/projects/[id]/...`)
- `/registers` — Issues, Changes & Risk Register
- `/meetings` — Meetings & Actions
- `/design-risks` — Design Risk workspace
- `/contract-admin` — Contract Administration
- `/planning` — Planning & Site Context
- `/tender` — Tender / ITT / Evaluation
- `/site-queries` — Site Queries
- `/building-regs` — Building Regulations
- `/brpd` — BRPD & Dutyholder Coordination (Phase 4 upgrade)
- `/brpd/changelog` — BRPD Changelog & Document Control (Phase 4)
- `/drawing-issues` — Drawing Issue & Email Workflow (Phase 4)
- `/documents` — Documents & Transmittals
- `/health` — Project Health Scorecard (Phase 4)

## Data Model Summary
- **6 projects**, **5 users**, **107 tasks**
- **Phase 2:** 6 approvals, 6 issues, 4 changes, 5 risk items, 7 meetings, 10 actions, 5 design risks, 2 contract admin records, 5 contract events, 4 planning records, 5 site constraints, 3 tenders, 4 returns, 9 evaluations, 5 site queries
- **Phase 2 Wave 3:** 4 building reg records, 6 inspections, 7 dutyholders, 3 BRPD gateways, 8 documents, 3 transmittals
- **Phase 3 Wave 1:** 5 knowledge articles, 8 CPD records, 8 competencies, 15 user competencies, 4 training plans, 2 jurisdiction packs, 1 org settings, 5 AI source permissions, 3 AI logs
- **Phase 3 Wave 2:** 14 drawing issues, 6 project commercials, 9 cashflow months, 12 staff allocations, 5 staff capacities
- **Phase 3 Wave 3:** 3 fee recommendations, 4 fee quotes, 16 line items, 6 opportunities
- **Phase 3 Wave 4:** 3 AI conversations (8 messages), 10 suggested prompts, 6 integrations, 5 portal invites, 6 shared items
- **Phase 4 Wave 1:** 6 fee quotes (all statuses), 19 line items, 11 quote sections, 10 view tracking entries, 3 quote templates, 4 terms library items, 5 exclusions library items, 17 health snapshots, 3 project number templates, 1 quote number template, 3 drawing issue templates
- **Phase 4 Wave 2:** 9 health alerts, 9 burn-budget metrics, 5 quote-project links, 5 conversion metrics
- **Phase 4 Wave 3:** 7 compliance statements, 8 BRPD requirements, 10 changelog entries, 6 drawing workflows, 11 drawing emails
