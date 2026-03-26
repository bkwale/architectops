'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PROJECTS, getProjectDesignRisks, getUser } from '@/lib/mock-data'
import { DesignRisk, DesignRiskReviewStatus, RIBA_STAGES, RIBAStage } from '@/lib/types'
import { cn, designRiskStatusColor, formatDate } from '@/lib/utils'

export default function DesignRiskPage() {
  const params = useParams()
  const project = PROJECTS.find(p => p.id === params.id)
  const [filterStatus, setFilterStatus] = useState<DesignRiskReviewStatus | 'all'>('all')

  if (!project) return <div className="p-8 text-center text-slate-400">Project not found.</div>

  const risks = getProjectDesignRisks(project.id)
  const filtered = filterStatus === 'all' ? risks : risks.filter(r => r.review_status === filterStatus)

  const openCount = risks.filter(r => r.review_status === 'open').length
  const reviewCount = risks.filter(r => r.review_status === 'under_review').length
  const significantCount = risks.filter(r => r.unusual_or_significant_flag).length

  const statusFilters: { key: DesignRiskReviewStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'closed', label: 'Closed' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/projects/${project.id}`} className="hover:text-brand-600 transition-colors">{project.name}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Design Risks</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Design Risk Workspace</h1>
        <p className="text-sm text-slate-500 mt-1">{project.name} — Stage {project.current_stage} {RIBA_STAGES[project.current_stage]}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{openCount}</p>
          <p className="text-xs text-red-600 font-medium mt-1">Open</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{reviewCount}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Under Review</p>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-violet-700">{significantCount}</p>
          <p className="text-xs text-violet-600 font-medium mt-1">Significant</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors',
              filterStatus === f.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >{f.label}</button>
        ))}
      </div>

      {/* Risk Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-400">No design risks in this category.</p>
          </div>
        ) : (
          filtered.map(risk => {
            const owner = getUser(risk.owner_user_id)
            return (
              <div key={risk.id} className={cn(
                'bg-white rounded-xl border p-5',
                risk.unusual_or_significant_flag ? 'border-violet-200' : 'border-slate-200'
              )}>
                <div className="flex items-start gap-3">
                  {risk.unusual_or_significant_flag && (
                    <span className="mt-0.5 shrink-0 w-2 h-2 rounded-full bg-violet-500" title="Unusual or significant" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', designRiskStatusColor(risk.review_status))}>
                        {risk.review_status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">Stage {risk.stage_code}</span>
                      {risk.unusual_or_significant_flag && (
                        <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">SIGNIFICANT</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">{risk.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{risk.description}</p>

                    <div className="p-2.5 bg-slate-50 rounded-lg mt-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Mitigation</p>
                      <p className="text-xs text-slate-700">{risk.mitigation}</p>
                    </div>

                    {risk.residual_risk_note && (
                      <div className="p-2.5 bg-amber-50 rounded-lg mt-2">
                        <p className="text-[10px] font-bold text-amber-500 uppercase mb-0.5">Residual Risk</p>
                        <p className="text-xs text-amber-700">{risk.residual_risk_note}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      {owner && <span>Owner: <span className="text-slate-600">{owner.name}</span></span>}
                      <span>Updated: {formatDate(risk.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
