'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getFeeQuoteRecords, getProject, getOpportunity, PROJECTS } from '@/lib/mock-data'
import { FeeQuoteRecord, FeeQuoteStatus } from '@/lib/types'
import { cn, formatDate, formatCurrency, feeQuoteStatusColor, feeQuoteStatusLabel } from '@/lib/utils'
import { Breadcrumb } from '@/components/Breadcrumb'
import { SummaryCard } from '@/components/SummaryCard'
import { StatusBadge } from '@/components/StatusBadge'
import { TabBar } from '@/components/TabBar'
import { EmptyState } from '@/components/EmptyState'

export default function FeeQuotesPage() {
  const quotes = getFeeQuoteRecords()
  const [activeTab, setActiveTab] = useState<string>('all')

  // Filter quotes by status
  const filteredQuotes = useMemo(() => {
    if (activeTab === 'all') return quotes
    return quotes.filter(q => q.status === activeTab)
  }, [quotes, activeTab])

  // Calculate summary metrics
  const totalQuotes = quotes.length
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted')
  const acceptedValue = acceptedQuotes.reduce((sum, q) => sum + q.total_fee, 0)
  const draftPendingQuotes = quotes.filter(q => q.status === 'draft' || q.status === 'issued').length
  const conversionRate = totalQuotes > 0 ? Math.round((acceptedQuotes.length / totalQuotes) * 100) : 0

  // Tab counts
  const tabCounts = {
    all: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    issued: quotes.filter(q => q.status === 'issued').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    superseded: quotes.filter(q => q.status === 'superseded').length,
  }

  const tabs = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'draft', label: 'Draft', count: tabCounts.draft },
    { key: 'issued', label: 'Issued', count: tabCounts.issued },
    { key: 'accepted', label: 'Accepted', count: tabCounts.accepted },
    { key: 'superseded', label: 'Superseded', count: tabCounts.superseded },
  ]

  return (
    <div className="max-w-6xl">
      {/* ━━━ BREADCRUMB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-10">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Fee Quotes' },
        ]} />
      </section>

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <h1 className="font-display text-[2rem] text-ink-900">Fee Quotes</h1>
      </section>

      {/* ━━━ SUMMARY CARDS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-300 pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="bg-white border border-surface-200 rounded-2xl p-4 text-center shadow-card">
              <p className="text-2xl font-light tracking-tight text-ink-900">{totalQuotes}</p>
              <p className="text-[11px] text-ink-400 font-medium mt-1.5 tracking-wide">Total Quotes</p>
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl p-4 text-center shadow-card">
              <p className="text-2xl font-light tracking-tight text-ink-900">{formatCurrency(acceptedValue)}</p>
              <p className="text-[11px] text-ink-400 font-medium mt-1.5 tracking-wide">Accepted Value</p>
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl p-4 text-center shadow-card">
              <p className="text-2xl font-light tracking-tight text-ink-900">{draftPendingQuotes}</p>
              <p className="text-[11px] text-ink-400 font-medium mt-1.5 tracking-wide">Draft / Pending</p>
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl p-4 text-center shadow-card">
              <p className="text-2xl font-light tracking-tight text-ink-900">{conversionRate}%</p>
              <p className="text-[11px] text-ink-400 font-medium mt-1.5 tracking-wide">Conversion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TAB BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-10">
        <div className="border-t border-surface-300 pt-10">
          <TabBar tabs={tabs} activeKey={activeTab} onSelect={setActiveTab} />
        </div>
      </section>

      {/* ━━━ QUOTE LIST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-20">
        {filteredQuotes.length === 0 ? (
          <EmptyState text={`No ${activeTab !== 'all' ? activeTab : ''} fee quotes yet.`} />
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => {
              const relatedProject = quote.related_project_id ? getProject(quote.related_project_id) : null
              const relatedOpportunity = quote.related_opportunity_id ? getOpportunity(quote.related_opportunity_id) : null
              const relatedName = relatedProject?.name || relatedOpportunity?.title || '—'

              return (
                <Link
                  key={quote.id}
                  href={`/fee-quotes/${quote.id}`}
                  className="block p-6 bg-white rounded-2xl border border-surface-200 shadow-card hover:border-accent-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[13px] font-semibold text-ink-900">{quote.quote_reference}</span>
                        <StatusBadge
                          label={feeQuoteStatusLabel(quote.status)}
                          colorClass={feeQuoteStatusColor(quote.status)}
                        />
                      </div>
                      <p className="text-[12px] text-ink-400 mb-1">{relatedName}</p>
                      <p className="text-[11px] text-ink-300">{quote.fee_basis}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-[1.75rem] text-ink-900">
                        {formatCurrency(quote.total_fee)}
                      </p>
                      <p className="text-[10px] text-ink-400 mt-1">Total Fee</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                    <div className="flex items-center gap-8 text-[11px]">
                      <div>
                        <span className="text-ink-400">Issued</span>
                        <p className="text-ink-600 font-mono">{quote.issued_date ? formatDate(quote.issued_date) : '—'}</p>
                      </div>
                      {quote.valid_until && (
                        <div>
                          <span className="text-ink-400">Valid Until</span>
                          <p className="text-ink-600 font-mono">{formatDate(quote.valid_until)}</p>
                        </div>
                      )}
                    </div>
                    <span className="text-accent-600 text-[11px] font-medium">View →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
