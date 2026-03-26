'use client'

import { cn } from '@/lib/utils'
import {
  getProjectApprovals,
  getProjectIssues,
  getProjectChanges,
  getProjectRisks,
  getProjectMeetings,
  getMeetingActions,
  getProjectDesignRisks,
  getProjectContractEvents,
  getProjectSiteQueries,
} from '@/lib/mock-data'

export function Phase2Warnings({ projectId }: { projectId: string }) {
  const approvals = getProjectApprovals(projectId)
  const issues = getProjectIssues(projectId)
  const changes = getProjectChanges(projectId)
  const riskRegister = getProjectRisks(projectId)
  const meetings = getProjectMeetings(projectId)
  const allActions = meetings.flatMap(m => getMeetingActions(m.id))
  const designRisks = getProjectDesignRisks(projectId)
  const contractEvents = getProjectContractEvents(projectId)
  const siteQueries = getProjectSiteQueries(projectId)

  const pendingApprovals = approvals.filter(a => a.status === 'pending').length
  const openIssues = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length
  const openChanges = changes.filter(c => c.approval_status === 'raised' || c.approval_status === 'under_review').length
  const highRisks = riskRegister.filter(r => r.status === 'open' && (r.probability === 'high' || r.impact === 'high')).length
  const overdueActions = allActions.filter(a => a.status === 'overdue').length
  const openDesignRisks = designRisks.filter(r => r.review_status === 'open').length
  const overdueContractEvents = contractEvents.filter(e => e.status === 'overdue').length
  const openSiteQueries = siteQueries.filter(q => q.status === 'open').length

  const chips: { label: string; count: number; color: string }[] = []
  if (pendingApprovals > 0) chips.push({ label: 'Pending Approvals', count: pendingApprovals, color: 'bg-amber-100 text-amber-700 border-amber-200' })
  if (openIssues > 0) chips.push({ label: 'Open Issues', count: openIssues, color: 'bg-red-100 text-red-700 border-red-200' })
  if (openChanges > 0) chips.push({ label: 'Open Changes', count: openChanges, color: 'bg-blue-100 text-blue-700 border-blue-200' })
  if (highRisks > 0) chips.push({ label: 'High-Priority Risks', count: highRisks, color: 'bg-red-100 text-red-700 border-red-200' })
  if (overdueActions > 0) chips.push({ label: 'Overdue Actions', count: overdueActions, color: 'bg-red-100 text-red-700 border-red-200' })
  if (openDesignRisks > 0) chips.push({ label: 'Open Design Risks', count: openDesignRisks, color: 'bg-violet-100 text-violet-700 border-violet-200' })
  if (overdueContractEvents > 0) chips.push({ label: 'Overdue CA Events', count: overdueContractEvents, color: 'bg-red-100 text-red-700 border-red-200' })
  if (openSiteQueries > 0) chips.push({ label: 'Open Site Queries', count: openSiteQueries, color: 'bg-amber-100 text-amber-700 border-amber-200' })

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(chip => (
        <span key={chip.label} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium', chip.color)}>
          <span className="font-bold">{chip.count}</span>
          {chip.label}
        </span>
      ))}
    </div>
  )
}
