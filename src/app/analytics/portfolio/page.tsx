'use client'

import Link from 'next/link'
import { getAllProjectCommercials, PROJECTS } from '@/lib/mock-data'
import { commercialHealthColor, commercialHealthDot, formatCurrency, formatPercent } from '@/lib/utils'
import { Breadcrumb } from '@/components/Breadcrumb'

export default function PortfolioHealth() {
  const commercials = getAllProjectCommercials()

  // Health distribution
  const healthyCount = commercials.filter(c => c.health_flag === 'healthy').length
  const watchCount = commercials.filter(c => c.health_flag === 'watch').length
  const atRiskCount = commercials.filter(c => c.health_flag === 'at_risk').length
  const criticalCount = commercials.filter(c => c.health_flag === 'critical').length

  const healthyProjects = commercials.filter(c => c.health_flag === 'healthy').map(c => PROJECTS.find(p => p.id === c.project_id)?.name || 'Unknown')
  const watchProjects = commercials.filter(c => c.health_flag === 'watch').map(c => PROJECTS.find(p => p.id === c.project_id)?.name || 'Unknown')
  const atRiskProjects = commercials.filter(c => c.health_flag === 'at_risk').map(c => PROJECTS.find(p => p.id === c.project_id)?.name || 'Unknown')
  const criticalProjects = commercials.filter(c => c.health_flag === 'critical').map(c => PROJECTS.find(p => p.id === c.project_id)?.name || 'Unknown')

  // Key metrics
  const totalActiveProjects = commercials.length
  const totalAgreedFees = commercials.reduce((sum, c) => sum + c.agreed_fee, 0)
  const avgUtilisation = 78 // Static for now
  const nearLossProjects = commercials.filter(c => c.current_margin_percent < 5).length
  const overspendProjects = commercials.filter(c => c.current_margin_percent < 0).length
  const debtorsValue = commercials.reduce((sum, c) => sum + (c.fee_invoiced - c.fee_paid), 0)

  return (
    <div className="max-w-7xl">
      {/* ━━━ BREADCRUMB & HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-12">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Portfolio Health' }
        ]} />
        <div className="mt-4">
          <h1 className="font-display text-[2rem] text-ink-900 mb-2">Portfolio Health</h1>
          <p className="text-[13px] text-ink-400">High-level view of practice performance and project risk</p>
        </div>

        {/* Navigation links */}
        <div className="flex gap-6 text-[12px] mt-6">
          <Link href="/analytics/commercial" className="text-ink-400 hover:text-accent-600 transition-colors">
            ← Commercial Performance
          </Link>
          <Link href="/analytics/cashflow" className="text-ink-400 hover:text-accent-600 transition-colors">
            Cashflow Forecast →
          </Link>
        </div>
      </section>

      {/* ━━━ HEALTH DISTRIBUTION ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-6">Health Distribution</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Healthy */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold">Healthy</span>
              </div>
              <p className="text-4xl font-light text-emerald-600 mb-4">{healthyCount}</p>
              {healthyProjects.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-surface-200">
                  {healthyProjects.slice(0, 3).map((name, i) => (
                    <p key={i} className="text-[11px] text-ink-600 truncate">{name}</p>
                  ))}
                  {healthyProjects.length > 3 && (
                    <p className="text-[10px] text-ink-300 italic">+{healthyProjects.length - 3} more</p>
                  )}
                </div>
              )}
            </div>

            {/* Watch */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold">Watch</span>
              </div>
              <p className="text-4xl font-light text-amber-600 mb-4">{watchCount}</p>
              {watchProjects.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-surface-200">
                  {watchProjects.slice(0, 3).map((name, i) => (
                    <p key={i} className="text-[11px] text-ink-600 truncate">{name}</p>
                  ))}
                  {watchProjects.length > 3 && (
                    <p className="text-[10px] text-ink-300 italic">+{watchProjects.length - 3} more</p>
                  )}
                </div>
              )}
            </div>

            {/* At Risk */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold">At Risk</span>
              </div>
              <p className="text-4xl font-light text-orange-600 mb-4">{atRiskCount}</p>
              {atRiskProjects.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-surface-200">
                  {atRiskProjects.slice(0, 3).map((name, i) => (
                    <p key={i} className="text-[11px] text-ink-600 truncate">{name}</p>
                  ))}
                  {atRiskProjects.length > 3 && (
                    <p className="text-[10px] text-ink-300 italic">+{atRiskProjects.length - 3} more</p>
                  )}
                </div>
              )}
            </div>

            {/* Critical */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold">Critical</span>
              </div>
              <p className="text-4xl font-light text-red-600 mb-4">{criticalCount}</p>
              {criticalProjects.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-surface-200">
                  {criticalProjects.slice(0, 3).map((name, i) => (
                    <p key={i} className="text-[11px] text-ink-600 truncate">{name}</p>
                  ))}
                  {criticalProjects.length > 3 && (
                    <p className="text-[10px] text-ink-300 italic">+{criticalProjects.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ KEY METRICS GRID ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
              <p className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold mb-3">Total Active Projects</p>
              <p className="text-3xl font-light text-ink-900 mb-1">{totalActiveProjects}</p>
              <p className="text-[10px] text-ink-300">Projects in portfolio</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
              <p className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold mb-3">Total Agreed Fee Value</p>
              <p className="text-3xl font-light text-ink-900 mb-1 font-mono">{formatCurrency(totalAgreedFees)}</p>
              <p className="text-[10px] text-ink-300">Across all contracts</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
              <p className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold mb-3">Avg Utilisation</p>
              <p className="text-3xl font-light text-ink-900 mb-1">{formatPercent(avgUtilisation)}</p>
              <p className="text-[10px] text-ink-300">Team capacity</p>
            </div>

            <div className={`rounded-2xl border shadow-card p-5 ${nearLossProjects > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-surface-200'}`}>
              <p className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold mb-3">Near-Loss Projects</p>
              <p className={`text-3xl font-light mb-1 ${nearLossProjects > 0 ? 'text-amber-600' : 'text-ink-900'}`}>{nearLossProjects}</p>
              <p className="text-[10px] text-ink-400">Margin &lt; 5%</p>
            </div>

            <div className={`rounded-2xl border shadow-card p-5 ${overspendProjects > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-surface-200'}`}>
              <p className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold mb-3">Overspend Projects</p>
              <p className={`text-3xl font-light mb-1 ${overspendProjects > 0 ? 'text-red-600' : 'text-ink-900'}`}>{overspendProjects}</p>
              <p className="text-[10px] text-ink-400">Negative margin</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5">
              <p className="text-[11px] text-ink-400 uppercase tracking-[0.08em] font-semibold mb-3">Debtors Value</p>
              <p className="text-3xl font-light text-ink-900 mb-1 font-mono">{formatCurrency(debtorsValue)}</p>
              <p className="text-[10px] text-ink-300">Invoiced but not paid</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ PROJECT RISK MATRIX ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-6">Project Risk Matrix</h2>
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50">
                    <th className="text-left px-5 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Project</th>
                    <th className="text-center px-5 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Health</th>
                    <th className="text-center px-5 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Overspend</th>
                    <th className="text-center px-5 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Margin</th>
                    <th className="text-right px-5 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Recovery %</th>
                  </tr>
                </thead>
                <tbody>
                  {commercials.map((commercial, i) => {
                    const project = PROJECTS.find(p => p.id === commercial.project_id)
                    const isOverspend = commercial.current_margin_percent < 0
                    const isLowMargin = commercial.current_margin_percent < 5 && commercial.current_margin_percent >= 0
                    const recovery = commercial.agreed_fee > 0 ? (commercial.fee_invoiced / commercial.agreed_fee) : 0
                    const recoveryStatus = recovery >= 0.9 ? 'green' : recovery >= 0.7 ? 'amber' : 'red'

                    return (
                      <tr key={i} className="border-b border-surface-200 hover:bg-surface-50/50 transition-colors">
                        <td className="px-5 py-4 text-[12px] font-medium text-ink-900">{project?.name || 'Unknown'}</td>

                        {/* Health */}
                        <td className="text-center px-5 py-4">
                          <div className="inline-flex items-center gap-1.5">
                            {commercialHealthDot(commercial.health_flag)}
                            <span className="text-[10px] font-medium capitalize">{commercial.health_flag}</span>
                          </div>
                        </td>

                        {/* Overspend */}
                        <td className="text-center px-5 py-4">
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{
                            backgroundColor: isOverspend ? '#fee2e2' : '#f0fdf4'
                          }}>
                            <span style={{ color: isOverspend ? '#dc2626' : '#16a34a' }} className="text-[12px] font-bold">
                              {isOverspend ? '!' : '✓'}
                            </span>
                          </div>
                        </td>

                        {/* Margin */}
                        <td className="text-center px-5 py-4">
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{
                            backgroundColor: isOverspend ? '#fee2e2' : isLowMargin ? '#fef3c7' : '#f0fdf4'
                          }}>
                            <span style={{
                              color: isOverspend ? '#dc2626' : isLowMargin ? '#d97706' : '#16a34a'
                            }} className="text-[12px] font-bold">
                              {isOverspend ? '!' : isLowMargin ? '⚠' : '✓'}
                            </span>
                          </div>
                        </td>

                        {/* Fee Recovery */}
                        <td className="text-right px-5 py-4">
                          <div className="inline-flex flex-col items-end gap-1">
                            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{
                              backgroundColor: recoveryStatus === 'green' ? '#f0fdf4' : recoveryStatus === 'amber' ? '#fef3c7' : '#fee2e2'
                            }}>
                              <span style={{
                                color: recoveryStatus === 'green' ? '#16a34a' : recoveryStatus === 'amber' ? '#d97706' : '#dc2626'
                              }} className="text-[11px] font-bold">
                                {recoveryStatus === 'green' ? '✓' : recoveryStatus === 'amber' ? '⚠' : '!'}
                              </span>
                            </div>
                            <span className="text-[10px] text-ink-400 font-mono">{formatPercent(recovery)}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
