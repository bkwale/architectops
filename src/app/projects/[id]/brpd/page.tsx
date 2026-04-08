'use client'

import { useParams } from 'next/navigation'
import { getProject, getProjectDutyholders, getProjectGateways } from '@/lib/mock-data'
import { DutyholderRecord, BRPDGateway, ComplianceStatus } from '@/lib/types'
import { cn, formatDate, complianceStatusColor, gatewayStatusColor, dutyholderRoleLabel } from '@/lib/utils'
import { Breadcrumb } from '@/components/Breadcrumb'
import { SummaryCard } from '@/components/SummaryCard'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'

export default function BRPDPage() {
  const params = useParams()
  const project = getProject(params.id as string)

  if (!project) {
    return <EmptyState text="Project not found." />
  }

  const dutyholders = getProjectDutyholders(project.id)
  const gateways = getProjectGateways(project.id)

  // Calculate compliance statistics
  const compliantCount = dutyholders.filter(d => d.compliance_status === 'compliant').length
  const pendingCount = dutyholders.filter(d => d.compliance_status === 'pending_review').length
  const nonCompliantCount = dutyholders.filter(d => d.compliance_status === 'non_compliant').length

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── SECTION 1: DUTYHOLDER REGISTER ── */}
      <div>
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: project.name, href: `/projects/${project.id}` },
          { label: 'BRPD & Dutyholders' },
        ]} />

        <div className="mt-6">
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900">BRPD & Dutyholder Coordination</h1>
          <p className="text-sm text-ink-400 mt-1">Manage Building Safety Act roles and compliance records</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <SummaryCard
            value={dutyholders.length}
            label="Total Dutyholders"
            bgColor="bg-surface-50"
            borderColor="border-surface-200"
            textColor="text-ink-900"
            labelColor="text-ink-400"
          />
          <SummaryCard
            value={compliantCount}
            label="Compliant"
            bgColor="bg-emerald-50"
            borderColor="border-emerald-200"
            textColor="text-emerald-700"
            labelColor="text-emerald-600"
          />
          <SummaryCard
            value={pendingCount}
            label="Pending Review"
            bgColor="bg-amber-50"
            borderColor="border-amber-200"
            textColor="text-amber-700"
            labelColor="text-amber-600"
          />
        </div>

        {/* Dutyholder Table */}
        <div className="mt-8">
          {dutyholders.length === 0 ? (
            <EmptyState text="No dutyholders assigned to this project yet." />
          ) : (
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-50 border-b border-surface-200/60">
                    <tr>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Role</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Organisation</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Contact Name</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Appointed</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Compliance</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dutyholders.map((dh, idx) => (
                      <tr
                        key={dh.id}
                        className={cn(
                          'bg-white',
                          idx !== dutyholders.length - 1 && 'border-b border-surface-200/60'
                        )}
                      >
                        <td className="px-5 py-4">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold text-ink-600 bg-surface-100">
                            {dutyholderRoleLabel(dh.role)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-ink-700">
                          {dh.organisation_name}
                        </td>
                        <td className="px-5 py-4 text-ink-700">
                          {dh.contact_name}
                        </td>
                        <td className="px-5 py-4 text-ink-500">
                          {formatDate(dh.appointed_date)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge
                            label={dh.compliance_status.replace(/_/g, ' ')}
                            colorClass={complianceStatusColor(dh.compliance_status)}
                          />
                        </td>
                        <td className="px-5 py-4 text-ink-500 max-w-sm">
                          {dh.notes ? (
                            <span className="truncate inline-block" title={dh.notes}>
                              {dh.notes}
                            </span>
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 2: BRPD GATEWAYS ── */}
      <div className="border-t border-surface-200/60 pt-10 mt-10">
        <h2 className="text-lg sm:text-xl font-display font-bold text-ink-900">BRPD Gateways</h2>
        <p className="text-sm text-ink-400 mt-1">Building Safety Act Stage 3, 4, and 5 submission milestones</p>

        {gateways.length === 0 ? (
          <div className="mt-8">
            <EmptyState text="No BRPD gateways configured for this project yet. Gateways are required under the Building Safety Act for higher-risk building work." />
          </div>
        ) : (
          <div className="mt-8">
            {/* Gateway Timeline */}
            <div className="flex gap-4 items-start mb-8">
              {[1, 2, 3].map((gatewayNum) => {
                const gateway = gateways.find(g => g.gateway_number === (gatewayNum as 1 | 2 | 3))
                const isActive = gateway !== undefined

                return (
                  <div key={gatewayNum} className="flex-1">
                    {/* Connecting line */}
                    {gatewayNum < 3 && (
                      <div className="absolute h-0.5 bg-surface-200 mt-5 ml-[calc(50%+8px)] w-[calc((100vw/3)-2rem)]" />
                    )}

                    {/* Gateway node */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-4 relative z-10',
                      isActive
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-200 text-ink-400'
                    )}>
                      {gatewayNum}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Gateway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((gatewayNum) => {
                const gateway = gateways.find(g => g.gateway_number === (gatewayNum as 1 | 2 | 3))

                if (!gateway) {
                  return (
                    <div
                      key={gatewayNum}
                      className="bg-surface-50 rounded-2xl border border-surface-200 p-5 text-center"
                    >
                      <p className="text-sm font-semibold text-ink-400">Gateway {gatewayNum}</p>
                      <p className="text-xs text-ink-300 mt-1">Not configured</p>
                    </div>
                  )
                }

                return (
                  <div
                    key={gateway.id}
                    className="bg-white rounded-2xl border border-surface-200 shadow-card p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Gateway {gateway.gateway_number}</p>
                        <h3 className="text-sm font-semibold text-ink-900 mt-1">{gateway.title}</h3>
                      </div>
                    </div>

                    <p className="text-xs text-ink-500 mb-4">{gateway.description}</p>

                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-[10px] text-ink-400 uppercase font-semibold mb-0.5">Target Date</p>
                        <p className="text-sm text-ink-700">{formatDate(gateway.target_date)}</p>
                      </div>
                      {gateway.completed_date && (
                        <div>
                          <p className="text-[10px] text-ink-400 uppercase font-semibold mb-0.5">Completed</p>
                          <p className="text-sm text-emerald-700">{formatDate(gateway.completed_date)}</p>
                        </div>
                      )}
                    </div>

                    <StatusBadge
                      label={gateway.status.replace(/_/g, ' ')}
                      colorClass={gatewayStatusColor(gateway.status)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
