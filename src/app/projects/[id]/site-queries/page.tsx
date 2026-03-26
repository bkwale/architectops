'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PROJECTS, getProjectSiteQueries, getUser } from '@/lib/mock-data'
import { SiteQueryStatus } from '@/lib/types'
import { cn, siteQueryStatusColor, formatDate, isOverdue } from '@/lib/utils'

type FilterTab = SiteQueryStatus | 'all'

export default function SiteQueriesPage() {
  const params = useParams()
  const project = PROJECTS.find(p => p.id === params.id)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  if (!project) return <div className="p-8 text-center text-slate-400">Project not found.</div>

  const queries = getProjectSiteQueries(project.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const filtered = activeTab === 'all' ? queries : queries.filter(q => q.status === activeTab)

  const openCount = queries.filter(q => q.status === 'open').length
  const respondedCount = queries.filter(q => q.status === 'responded').length
  const overdueCount = queries.filter(q => q.status === 'open' && isOverdue(q.due_date)).length

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: queries.length },
    { key: 'open', label: 'Open', count: openCount },
    { key: 'responded', label: 'Responded', count: respondedCount },
    { key: 'closed', label: 'Closed', count: queries.filter(q => q.status === 'closed').length },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/projects/${project.id}`} className="hover:text-brand-600 transition-colors">{project.name}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Site Queries</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Site Queries</h1>
        <p className="text-sm text-slate-500 mt-1">{project.name} — site-to-office workflow</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{openCount}</p>
          <p className="text-xs text-red-600 font-medium mt-1">Open</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{respondedCount}</p>
          <p className="text-xs text-blue-600 font-medium mt-1">Responded</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{overdueCount}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Overdue</p>
        </div>
      </div>

      {/* Quick-add form (mobile-friendly) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Raise a Query</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Query title..."
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <textarea
            placeholder="Describe the query..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-3">
            <input
              type="date"
              className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button className="px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
              Submit Query
            </button>
          </div>
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

      {/* Query List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-400">No queries in this category.</p>
          </div>
        ) : (
          filtered.map(query => {
            const raisedBy = getUser(query.raised_by_user_id)
            const owner = getUser(query.owner_user_id)
            const overdue = query.status === 'open' && isOverdue(query.due_date)

            return (
              <div key={query.id} className={cn(
                'bg-white rounded-xl border p-5',
                overdue ? 'border-red-200' : 'border-slate-200'
              )}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', siteQueryStatusColor(query.status))}>
                    {query.status}
                  </span>
                  {overdue && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">OVERDUE</span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-900">{query.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{query.description}</p>

                {query.response_notes && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg mt-3">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mb-0.5">Response</p>
                    <p className="text-xs text-emerald-800">{query.response_notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                  {raisedBy && <span>Raised by: <span className="text-slate-600">{raisedBy.name}</span></span>}
                  {owner && <span>Owner: <span className="text-slate-600">{owner.name}</span></span>}
                  <span className={cn(overdue ? 'text-red-600 font-medium' : '')}>
                    Due: {formatDate(query.due_date)}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
