'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PROJECTS, getProjectIssues, getProjectChanges, getProjectRisks, getUser } from '@/lib/mock-data'
import { cn, issueStatusColor, changeStatusColor, riskRegisterStatusColor, riskScoreColor, formatDate } from '@/lib/utils'

type RegisterTab = 'issues' | 'changes' | 'risks'

export default function ProjectRegistersPage() {
  const params = useParams()
  const project = PROJECTS.find(p => p.id === params.id)
  const [activeTab, setActiveTab] = useState<RegisterTab>('issues')

  if (!project) {
    return <div className="p-8 text-center text-slate-400">Project not found.</div>
  }

  const issues = getProjectIssues(project.id)
  const changes = getProjectChanges(project.id)
  const risks = getProjectRisks(project.id)

  const tabs: { key: RegisterTab; label: string; count: number }[] = [
    { key: 'issues', label: 'Issues', count: issues.length },
    { key: 'changes', label: 'Changes', count: changes.length },
    { key: 'risks', label: 'Risk Register', count: risks.length },
  ]

  const openIssues = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length
  const openChanges = changes.filter(c => c.approval_status === 'raised' || c.approval_status === 'under_review').length
  const openRisks = risks.filter(r => r.status === 'open').length

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-brand-600 transition-colors">Projects</Link>
        <span>/</span>
        <Link href={`/projects/${project.id}`} className="hover:text-brand-600 transition-colors">{project.name}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Registers</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Issues, Changes & Risks</h1>
        <p className="text-sm text-slate-500 mt-1">{project.name} — {project.client}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{openIssues}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Open Issues</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{openChanges}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Open Changes</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{openRisks}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Open Risks</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors',
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
            <span className={cn(
              'ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold',
              activeTab === tab.key ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'issues' && (
        <div className="space-y-3">
          {issues.length === 0 ? (
            <EmptyState text="No issues recorded." />
          ) : (
            issues.map(issue => {
              const owner = getUser(issue.owner_user_id)
              return (
                <div key={issue.id} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', issueStatusColor(issue.status))}>
                          {issue.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase">{issue.issue_type}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">{issue.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{issue.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        {owner && <span>Owner: <span className="text-slate-600">{owner.name}</span></span>}
                        <span>Raised: {formatDate(issue.raised_date)}</span>
                        {issue.resolved_date && <span>Resolved: {formatDate(issue.resolved_date)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'changes' && (
        <div className="space-y-3">
          {changes.length === 0 ? (
            <EmptyState text="No changes recorded." />
          ) : (
            changes.map(change => {
              const initiator = getUser(change.initiated_by_user_id)
              return (
                <div key={change.id} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', changeStatusColor(change.approval_status))}>
                        {change.approval_status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase">{change.change_type}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">{change.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{change.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {change.commercial_effect_note && (
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Commercial Effect</p>
                          <p className="text-xs text-slate-700">{change.commercial_effect_note}</p>
                        </div>
                      )}
                      {change.programme_effect_note && (
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Programme Effect</p>
                          <p className="text-xs text-slate-700">{change.programme_effect_note}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      {initiator && <span>Raised by: <span className="text-slate-600">{initiator.name}</span></span>}
                      <span>{formatDate(change.date_raised)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="space-y-3">
          {risks.length === 0 ? (
            <EmptyState text="No risks in register." />
          ) : (
            risks.map(risk => {
              const owner = getUser(risk.owner_user_id)
              return (
                <div key={risk.id} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start gap-3">
                    {/* Risk Score Dot */}
                    <div className={cn('w-3 h-3 rounded-full mt-1 shrink-0', riskScoreColor(risk.probability, risk.impact))} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', riskRegisterStatusColor(risk.status))}>
                          {risk.status}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase">{risk.risk_type}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">{risk.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{risk.description}</p>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">Probability:</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase">{risk.probability}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">Impact:</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase">{risk.impact}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Mitigation</p>
                        <p className="text-xs text-slate-700">{risk.mitigation}</p>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        {owner && <span>Owner: <span className="text-slate-600">{owner.name}</span></span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  )
}
