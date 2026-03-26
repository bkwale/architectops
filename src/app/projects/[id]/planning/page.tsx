'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PROJECTS, getProjectPlanningRecords, getProjectSiteConstraints } from '@/lib/mock-data'
import { cn, formatDate, severityColor, severityDot } from '@/lib/utils'
import { RIBA_STAGES } from '@/lib/types'

export default function PlanningPage() {
  const params = useParams()
  const project = PROJECTS.find(p => p.id === params.id)

  if (!project) return <div className="p-8 text-center text-slate-400">Project not found.</div>

  const records = getProjectPlanningRecords(project.id)
  const constraints = getProjectSiteConstraints(project.id)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/projects/${project.id}`} className="hover:text-brand-600 transition-colors">{project.name}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Planning</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Planning & Site Context</h1>
        <p className="text-sm text-slate-500 mt-1">{project.name} — {project.client}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{records.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Planning Records</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{constraints.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Site Constraints</p>
        </div>
      </div>

      {/* Planning Records */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Planning Records</h2>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">No planning records.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map(record => (
              <div key={record.id} className="p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-700 uppercase">
                    {record.record_type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{record.reference}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{record.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{record.description}</p>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold',
                    record.status.includes('Approved') ? 'bg-emerald-100 text-emerald-700' :
                    record.status.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                    record.status.includes('Feedback') ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  )}>
                    {record.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  {record.date_submitted && <span>Submitted: {formatDate(record.date_submitted)}</span>}
                  {record.date_determined && <span>Determined: {formatDate(record.date_determined)}</span>}
                </div>

                {record.notes && (
                  <div className="p-2.5 bg-slate-50 rounded-lg mt-2">
                    <p className="text-xs text-slate-600">{record.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Site Constraints */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Site Constraints</h2>
        </div>

        {constraints.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">No site constraints recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {constraints.map(constraint => (
              <div key={constraint.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className={cn('w-3 h-3 rounded-full mt-1 shrink-0', severityDot(constraint.severity))} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase border', severityColor(constraint.severity))}>
                        {constraint.severity}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase">{constraint.constraint_type}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">{constraint.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{constraint.description}</p>

                    {constraint.mitigation && (
                      <div className="p-2.5 bg-slate-50 rounded-lg mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Mitigation</p>
                        <p className="text-xs text-slate-700">{constraint.mitigation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
