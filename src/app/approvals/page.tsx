'use client'

import { useState } from 'react'
import Link from 'next/link'
import { APPROVALS, getUser, getProject } from '@/lib/mock-data'
import { ApprovalStatus } from '@/lib/types'
import { cn, approvalStatusColor, approvalStatusLabel, formatDate } from '@/lib/utils'

type FilterTab = 'pending' | 'returned' | 'approved' | 'all'

export default function ApprovalsQueuePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('pending')

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'pending', label: 'Awaiting Review', count: APPROVALS.filter(a => a.status === 'pending').length },
    { key: 'returned', label: 'Returned', count: APPROVALS.filter(a => a.status === 'returned').length },
    { key: 'approved', label: 'Recently Approved', count: APPROVALS.filter(a => a.status === 'approved').length },
    { key: 'all', label: 'All', count: APPROVALS.length },
  ]

  const filtered = activeTab === 'all'
    ? APPROVALS
    : APPROVALS.filter(a => a.status === activeTab)

  // Sort: pending first (by date), then returned, then approved
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Approvals</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Approvals Queue</h1>
        <p className="text-sm text-slate-500 mt-1">Tasks and documents awaiting your review</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{tabs[0].count}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Pending</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{tabs[1].count}</p>
          <p className="text-xs text-red-600 font-medium mt-1">Returned</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{tabs[2].count}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Approved</p>
        </div>
      </div>

      {/* Tab Filter */}
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

      {/* Approval Items */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-400">No items in this category.</p>
          </div>
        ) : (
          sorted.map(approval => {
            const submitter = getUser(approval.submitted_by_user_id)
            const project = getProject(approval.project_id)
            const reviewer = getUser(approval.reviewer_user_id)

            return (
              <div
                key={approval.id}
                className={cn(
                  'bg-white rounded-xl border p-5 transition-colors',
                  approval.status === 'pending' ? 'border-amber-200 hover:border-amber-300' :
                  approval.status === 'returned' ? 'border-red-200 hover:border-red-300' :
                  'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', approvalStatusColor(approval.status))}>
                        {approvalStatusLabel(approval.status)}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase">
                        {approval.item_type}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 truncate">{approval.item_title}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                      {project && (
                        <Link href={`/projects/${project.id}`} className="hover:text-brand-600 transition-colors">
                          {project.name}
                        </Link>
                      )}
                      {submitter && <span>Submitted by <span className="text-slate-600">{submitter.name}</span></span>}
                      <span>{formatDate(approval.submitted_at)}</span>
                    </div>

                    {approval.reviewer_comments && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs font-medium text-red-800 mb-0.5">Review Comments</p>
                        <p className="text-xs text-red-700">{approval.reviewer_comments}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {approval.status === 'pending' && (
                      <>
                        <button className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                          Return
                        </button>
                      </>
                    )}
                    {approval.status === 'approved' && approval.reviewed_at && (
                      <span className="text-[11px] text-slate-400">
                        Approved {formatDate(approval.reviewed_at)}
                      </span>
                    )}
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
