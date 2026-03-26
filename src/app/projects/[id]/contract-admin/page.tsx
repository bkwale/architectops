'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PROJECTS, getProjectContractAdmin, getProjectContractEvents, getUser } from '@/lib/mock-data'
import { cn, contractEventStatusColor, formatDate, isOverdue } from '@/lib/utils'

export default function ContractAdminPage() {
  const params = useParams()
  const project = PROJECTS.find(p => p.id === params.id)

  if (!project) return <div className="p-8 text-center text-slate-400">Project not found.</div>

  const contractAdmin = getProjectContractAdmin(project.id)
  const events = getProjectContractEvents(project.id)
    .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())

  const overdueEvents = events.filter(e => e.status === 'overdue').length
  const openEvents = events.filter(e => e.status === 'issued' || e.status === 'draft').length

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/projects/${project.id}`} className="hover:text-brand-600 transition-colors">{project.name}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Contract Admin</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Contract Administration</h1>
        <p className="text-sm text-slate-500 mt-1">{project.name} — {project.client}</p>
      </div>

      {/* Contract Summary */}
      {contractAdmin ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Contract Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Procurement</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{contractAdmin.procurement_route.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Contract Form</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{contractAdmin.contract_form.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Administrator</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{contractAdmin.administrator_role}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Notes</p>
              <p className="text-xs text-slate-600 mt-0.5">{contractAdmin.notes || '—'}</p>
            </div>
          </div>

          {/* Key Dates */}
          {(() => {
            try {
              const dates = JSON.parse(contractAdmin.key_dates_json)
              return (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Key Dates</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(dates).map(([key, val]) => (
                      <div key={key} className="px-3 py-2 bg-slate-50 rounded-lg">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{key.replace(/_/g, ' ')}</p>
                        <p className="text-xs font-medium text-slate-700">{formatDate(val as string)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            } catch { return null }
          })()}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-900">No contract record</p>
            <p className="text-xs text-amber-700 mt-0.5">Contract administration details have not been set up for this project.</p>
          </div>
        </div>
      )}

      {/* Warning if missing info */}
      {contractAdmin && !contractAdmin.procurement_route && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          Procurement route missing — please update contract details.
        </div>
      )}

      {/* Event Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{events.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Total Events</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{openEvents}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Open</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{overdueEvents}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Overdue</p>
        </div>
      </div>

      {/* Contract Events Register */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Contract Events</h2>
        </div>

        {events.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">No contract events recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map(event => {
              const creator = getUser(event.created_by_user_id)
              return (
                <div key={event.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', contractEventStatusColor(event.status))}>
                          {event.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{event.event_ref}</span>
                        <span className="text-[10px] font-medium text-slate-400">{event.event_type}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span>Issued: {formatDate(event.issue_date)}</span>
                        <span className={cn(isOverdue(event.response_due_date) && event.status !== 'responded' && event.status !== 'closed' ? 'text-red-600 font-medium' : '')}>
                          Response due: {formatDate(event.response_due_date)}
                        </span>
                        {creator && <span>By: {creator.name}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
