'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RIBA_STAGES, RIBAStage, ProjectStatus } from '@/lib/types'
import { STAGE_TEMPLATES } from '@/lib/stage-templates'
import { USERS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function NewProjectPage() {
  const router = useRouter()
  const [selectedStage, setSelectedStage] = useState<RIBAStage>(0)
  const [submitted, setSubmitted] = useState(false)

  const previewTasks = STAGE_TEMPLATES.filter(t => t.stage <= selectedStage)
  const currentStageTasks = STAGE_TEMPLATES.filter(t => t.stage === selectedStage)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In real app: POST to API, create project + auto-generate tasks
    setSubmitted(true)
    setTimeout(() => router.push('/'), 1500)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Project Created</h2>
        <p className="text-sm text-slate-500">{previewTasks.length} tasks auto-generated across stages 0–{selectedStage}.</p>
        <p className="text-xs text-slate-400 mt-2">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">New Project</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Project</h1>
        <p className="text-sm text-slate-500 mt-1">Set up a project and auto-generate RIBA stage tasks.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-900">Project Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Riverside House Extension"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Client Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Harris Family Trust"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description (optional)</label>
            <textarea
              rows={2}
              placeholder="Brief project summary..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Start Date *</label>
              <input
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Target Completion</label>
              <input
                type="date"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Project Lead</label>
              <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white">
                <option value="">Assign later</option>
                {USERS.filter(u => u.role === 'project_lead' || u.role === 'practice_owner').map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RIBA Stage Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Current RIBA Stage *</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tasks will be auto-generated for all stages up to and including the selected stage.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(RIBA_STAGES) as [string, string][]).map(([stage, label]) => {
              const s = Number(stage) as RIBAStage
              const isSelected = s === selectedStage
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStage(s)}
                  className={cn(
                    'text-left p-3 rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <span className={cn(
                    'text-lg font-bold',
                    isSelected ? 'text-brand-700' : 'text-slate-300'
                  )}>
                    {s}
                  </span>
                  <p className={cn(
                    'text-[11px] font-medium leading-tight mt-0.5',
                    isSelected ? 'text-brand-600' : 'text-slate-500'
                  )}>
                    {label}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Task Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Task Preview</h2>
              <p className="text-xs text-slate-400 mt-0.5">{previewTasks.length} tasks will be created automatically</p>
            </div>
            <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              Stages 0–{selectedStage}
            </span>
          </div>

          <div className="space-y-3">
            {Array.from({ length: selectedStage + 1 }, (_, i) => i as RIBAStage).map(stage => {
              const stageTasks = STAGE_TEMPLATES.filter(t => t.stage === stage)
              return (
                <div key={stage}>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Stage {stage}: {RIBA_STAGES[stage]}
                  </p>
                  <div className="space-y-1">
                    {stageTasks.map((task, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-xs"
                      >
                        {task.required_flag && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        )}
                        <span className={cn(
                          'text-slate-700',
                          !task.required_flag && 'ml-3.5'
                        )}>
                          {task.task_title}
                        </span>
                        {task.required_flag && (
                          <span className="text-[10px] font-bold text-brand-600 ml-auto">REQUIRED</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            Create Project
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
