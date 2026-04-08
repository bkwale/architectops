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
- `/fee-quotes` — Fee Quotes listing
- `/fee-quotes/[id]` — Fee Quote detail (line items, terms)
- `/opportunities` — Opportunities & Pipeline
- `/ai` — AI Teammate (global portfolio chat)
- `/projects/[id]/ai` — AI Teammate (project-scoped chat)
- `/portal` — External Collaboration Portal
- `/settings/admin` — Admin Controls (AI governance)
- `/settings/international` — International & Jurisdiction settings
- `/settings/integrations` — Integrations Hub (Xero, Outlook, SharePoint, etc)

### Project sub-routes (`/projects/[id]/...`)
- `/registers` — Issues, Changes & Risk Register
- `/meetings` — Meetings & Actions
- `/design-risks` — Design Risk workspace
- `/contract-admin` — Contract Administration
- `/planning` — Planning & Site Context
- `/tender` — Tender / ITT / Evaluation
- `/site-queries` — Site Queries
- `/building-regs` — Building Regulations
- `/brpd` — BRPD & Dutyholder Coordination
- `/documents` — Documents & Transmittals

## Data Model Summary
- **6 projects**, **5 users**, **107 tasks**
- **Phase 2:** 6 approvals, 6 issues, 4 changes, 5 risk items, 7 meetings, 10 actions, 5 design risks, 2 contract admin records, 5 contract events, 4 planning records, 5 site constraints, 3 tenders, 4 returns, 9 evaluations, 5 site queries
- **Phase 2 Wave 3:** 4 building reg records, 6 inspections, 7 dutyholders, 3 BRPD gateways, 8 documents, 3 transmittals
- **Phase 3 Wave 1:** 5 knowledge articles, 8 CPD records, 8 competencies, 15 user competencies, 4 training plans, 2 jurisdiction packs, 1 org settings, 5 AI source permissions, 3 AI logs
- **Phase 3 Wave 2:** 14 drawing issues, 6 project commercials, 9 cashflow months, 12 staff allocations, 5 staff capacities
- **Phase 3 Wave 3:** 3 fee recommendations, 4 fee quotes, 16 line items, 6 opportunities
- **Phase 3 Wave 4:** 3 AI conversations (8 messages), 10 suggested prompts, 6 integrations, 5 portal invites, 6 shared items
