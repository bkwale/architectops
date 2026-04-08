'use client'

import { USERS, getAllCompetencies, getUserCompetencies, getCompetency } from '@/lib/mock-data'
import { Competency, UserCompetency } from '@/lib/types'
import { cn, proficiencyLabel, proficiencyColor } from '@/lib/utils'
import { Breadcrumb } from '@/components/Breadcrumb'

export default function CompetenceMatrix() {
  const competencies = getAllCompetencies()
  const users = USERS

  // Build matrix: user -> competency -> proficiency
  const matrix: Record<string, Record<string, UserCompetency | undefined>> = {}

  users.forEach(user => {
    matrix[user.id] = {}
    const userComps = getUserCompetencies(user.id)
    competencies.forEach(comp => {
      const uc = userComps.find(c => c.competency_id === comp.id)
      matrix[user.id][comp.id] = uc
    })
  })

  // Proficiency levels for legend
  const proficiencyLevels: Array<'none' | 'basic' | 'intermediate' | 'advanced' | 'expert'> = ['none', 'basic', 'intermediate', 'advanced', 'expert']

  return (
    <div className="max-w-6xl">
      {/* Breadcrumb */}
      <section className="pb-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'CPD & Training', href: '/cpd' },
          { label: 'Competence Matrix' },
        ]} />
      </section>

      {/* Hero */}
      <section className="pb-16">
        <h1 className="font-display text-[2rem] leading-tight text-ink-900">
          Competence Matrix
        </h1>
      </section>

      {/* Legend */}
      <section className="pb-12">
        <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-card">
          <p className="text-[11px] text-ink-400 uppercase tracking-[0.1em] font-semibold mb-4">Proficiency Levels</p>
          <div className="flex flex-wrap gap-4">
            {proficiencyLevels.map(level => (
              <div key={level} className="flex items-center gap-2">
                <div className={cn('w-4 h-4 rounded-full', proficiencyColor(level).replace('text-', 'bg-'))} />
                <span className="text-[12px] text-ink-600">{proficiencyLabel(level)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matrix Table */}
      <section className="pb-16">
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200/60">
                <th className="px-6 py-4 text-left text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold sticky left-0 bg-white">Team Member</th>
                {competencies.map(comp => (
                  <th
                    key={comp.id}
                    className="px-4 py-4 text-center text-[10px] text-ink-300 uppercase tracking-[0.08em] font-semibold whitespace-nowrap"
                  >
                    {comp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-surface-200/60 hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4 text-[12px] font-semibold text-ink-900 sticky left-0 bg-inherit">
                    <div>
                      <p>{user.name}</p>
                      <p className="text-[10px] text-ink-400 font-normal">{user.role}</p>
                    </div>
                  </td>
                  {competencies.map(comp => {
                    const userComp = matrix[user.id]?.[comp.id]
                    const level = userComp?.proficiency_level || 'none'
                    const isGap = (level === 'none' || level === 'basic')

                    return (
                      <td key={`${user.id}-${comp.id}`} className="px-4 py-4 text-center">
                        <div className={cn(
                          'inline-flex items-center justify-center w-8 h-8 rounded-full transition-all',
                          proficiencyColor(level),
                          isGap && 'ring-2 ring-offset-1 ring-amber-400'
                        )}>
                          <span className="text-[10px] font-bold opacity-0">•</span>
                        </div>
                        <p className="text-[9px] text-ink-400 mt-1">{proficiencyLabel(level)}</p>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Legend for Gaps */}
      <section className="pb-16">
        <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-card">
          <p className="text-[11px] text-ink-400 uppercase tracking-[0.1em] font-semibold mb-2">Legend</p>
          <p className="text-[12px] text-ink-600">
            <span className="inline-block w-4 h-4 rounded-full ring-2 ring-offset-1 ring-amber-400 bg-amber-100 align-middle" /> indicates a gap (basic or no proficiency)
          </p>
        </div>
      </section>

      {/* Competency Categories */}
      <section className="pb-16">
        <div className="border-t border-surface-200 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-8">Competencies by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from(new Set(competencies.map(c => c.category))).map(category => (
              <div
                key={category}
                className="bg-white rounded-2xl border border-surface-200 p-5 shadow-card"
              >
                <h3 className="text-[13px] font-semibold text-ink-900 mb-4">{category}</h3>
                <div className="space-y-3">
                  {competencies.filter(c => c.category === category).map(comp => (
                    <div key={comp.id}>
                      <p className="text-[12px] font-medium text-ink-900">{comp.name}</p>
                      <p className="text-[11px] text-ink-400 mt-1">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
