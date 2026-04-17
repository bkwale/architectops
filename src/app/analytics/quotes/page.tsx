'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getFeeQuoteRecords, getFeeQuoteViews, getUser, PROJECTS } from '@/lib/mock-data'
import { formatCurrency, formatDate, timeAgo, feeQuoteStatusColor, feeQuoteStatusLabel, cn } from '@/lib/utils'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FeeQuoteRecord, FeeQuoteView } from '@/lib/types'

export default function QuotePerformanceAnalytics() {
  const [period, setPeriod] = useState<'all' | '3mo' | '6mo' | '1yr'>('all')

  const quotes = getFeeQuoteRecords()
  const allViews = getFeeQuoteViews('') // We'll filter manually

  // ━━━ KPI CALCULATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const statusCounts = {
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    viewed: quotes.filter(q => q.status === 'viewed').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    declined: quotes.filter(q => q.status === 'declined').length,
    expired: quotes.filter(q => q.status === 'expired').length,
  }

  const statusValues = {
    draft: quotes.filter(q => q.status === 'draft').reduce((sum, q) => sum + q.total_fee, 0),
    sent: quotes.filter(q => q.status === 'sent').reduce((sum, q) => sum + q.total_fee, 0),
    viewed: quotes.filter(q => q.status === 'viewed').reduce((sum, q) => sum + q.total_fee, 0),
    accepted: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total_fee, 0),
    declined: quotes.filter(q => q.status === 'declined').reduce((sum, q) => sum + q.total_fee, 0),
    expired: quotes.filter(q => q.status === 'expired').reduce((sum, q) => sum + q.total_fee, 0),
  }

  // ━━━ CONVERSION FUNNEL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const totalQuotes = quotes.length
  const sentQuotes = quotes.filter(q => q.sent_at).length
  const viewedQuotes = quotes.filter(q => q.viewed_count > 0).length
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length

  const conversionRates = {
    sent: totalQuotes > 0 ? ((sentQuotes / totalQuotes) * 100).toFixed(1) : '0',
    viewed: sentQuotes > 0 ? ((viewedQuotes / sentQuotes) * 100).toFixed(1) : '0',
    accepted: viewedQuotes > 0 ? ((acceptedQuotes / viewedQuotes) * 100).toFixed(1) : '0',
  }

  // ━━━ FOLLOW-UP ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const now = new Date()
  const quoteNeedingFollowUp = quotes.filter(quote => {
    // Sent but not viewed after 3+ days
    if (quote.status === 'sent' && quote.viewed_count === 0 && quote.sent_at) {
      const daysSinceSent = Math.floor((now.getTime() - new Date(quote.sent_at).getTime()) / 86400000)
      return daysSinceSent > 3
    }
    // Viewed but not responded with validity expiring in <7 days
    if (quote.status === 'viewed') {
      const daysUntilExpiry = Math.floor((new Date(quote.valid_until).getTime() - now.getTime()) / 86400000)
      return daysUntilExpiry < 7
    }
    // Any quote expiring within 7 days (and not yet accepted/declined)
    if (!['accepted', 'declined', 'expired', 'superseded'].includes(quote.status)) {
      const daysUntilExpiry = Math.floor((new Date(quote.valid_until).getTime() - now.getTime()) / 86400000)
      return daysUntilExpiry < 7
    }
    return false
  })

  // ━━━ RECENT ACTIVITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const allQuoteViews: Array<FeeQuoteView & { quoteName: string; quoteRef: string }> = []
  quotes.forEach(quote => {
    const viewsForQuote = allViews.filter(v => v.fee_quote_id === quote.id)
    viewsForQuote.forEach(view => {
      allQuoteViews.push({
        ...view,
        quoteName: quote.quote_title,
        quoteRef: quote.quote_reference,
      })
    })
  })

  const recentViews = allQuoteViews
    .sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime())
    .slice(0, 10)

  // ━━━ QUOTE VALUE CHART DATA (for rendering bars) ━━━━━━━━
  const maxFee = Math.max(...quotes.map(q => q.total_fee), 1)

  // ━━━ STATUS COLOR MAP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const statusBgColors: Record<string, string> = {
    draft: 'bg-slate-400',
    sent: 'bg-blue-500',
    viewed: 'bg-indigo-500',
    revised: 'bg-amber-500',
    accepted: 'bg-emerald-500',
    declined: 'bg-red-500',
    expired: 'bg-slate-300',
    superseded: 'bg-violet-500',
  }

  return (
    <div className="max-w-7xl">
      {/* ━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-12">
        <Breadcrumb items={[
          { label: 'Analytics' },
          { label: 'Quote Performance' }
        ]} />
        <h1 className="font-display text-3xl text-ink-900 mt-6 mb-2">Quote Performance</h1>
        <p className="text-[14px] text-ink-400">Track proposals, conversions and revenue pipeline</p>
      </section>

      {/* ━━━ KPI CARDS SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Drafts */}
            <div className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-1 h-8 bg-slate-300 rounded-r-sm"></div>
                <div className="flex-1">
                  <p className="text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Drafts</p>
                </div>
              </div>
              <p className="text-2xl font-light text-ink-900 mb-2">{statusCounts.draft}</p>
              <p className="text-[13px] text-ink-400">{formatCurrency(statusValues.draft)}</p>
            </div>

            {/* Sent */}
            <div className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-1 h-8 bg-blue-500 rounded-r-sm"></div>
                <div className="flex-1">
                  <p className="text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Sent</p>
                </div>
              </div>
              <p className="text-2xl font-light text-ink-900 mb-2">{statusCounts.sent}</p>
              <p className="text-[13px] text-ink-400">{formatCurrency(statusValues.sent)}</p>
            </div>

            {/* Viewed */}
            <div className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-1 h-8 bg-indigo-500 rounded-r-sm"></div>
                <div className="flex-1">
                  <p className="text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Viewed</p>
                </div>
              </div>
              <p className="text-2xl font-light text-ink-900 mb-2">{statusCounts.viewed}</p>
              <p className="text-[13px] text-ink-400">{formatCurrency(statusValues.viewed)}</p>
            </div>

            {/* Accepted */}
            <div className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-1 h-8 bg-emerald-500 rounded-r-sm"></div>
                <div className="flex-1">
                  <p className="text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Accepted</p>
                </div>
              </div>
              <p className="text-2xl font-light text-ink-900 mb-2">{statusCounts.accepted}</p>
              <p className="text-[13px] text-ink-400">{formatCurrency(statusValues.accepted)}</p>
            </div>

            {/* Declined */}
            <div className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-1 h-8 bg-red-500 rounded-r-sm"></div>
                <div className="flex-1">
                  <p className="text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Declined</p>
                </div>
              </div>
              <p className="text-2xl font-light text-ink-900 mb-2">{statusCounts.declined}</p>
              <p className="text-[13px] text-ink-400">{formatCurrency(statusValues.declined)}</p>
            </div>

            {/* Expired */}
            <div className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-1 h-8 bg-slate-300 rounded-r-sm"></div>
                <div className="flex-1">
                  <p className="text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Expired</p>
                </div>
              </div>
              <p className="text-2xl font-light text-ink-900 mb-2">{statusCounts.expired}</p>
              <p className="text-[13px] text-ink-400">{formatCurrency(statusValues.expired)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ QUOTE VALUE CHART ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10 mb-8">
          <h2 className="font-display text-xl text-ink-900 mb-6">Quote Values by Status</h2>
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
            <div className="space-y-3">
              {quotes.slice(0, 12).map((quote) => {
                const barWidth = (quote.total_fee / maxFee) * 100
                const statusColor = statusBgColors[quote.status] || 'bg-slate-400'
                return (
                  <div key={quote.id} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-ink-900">{quote.quote_reference}</p>
                        <p className="text-[12px] text-ink-400">{quote.client_name}</p>
                      </div>
                      <p className="text-[13px] font-medium text-ink-900 ml-4">{formatCurrency(quote.total_fee)}</p>
                    </div>
                    <div className="relative h-6 bg-surface-100 rounded-r-lg overflow-hidden">
                      <div
                        className={cn(statusColor, 'h-full rounded-r-lg transition-all duration-300 flex items-center px-3')}
                        style={{ width: `${Math.max(barWidth, 2)}%` }}
                      >
                        <span className="text-[11px] font-medium text-white truncate">
                          {quote.status && feeQuoteStatusLabel(quote.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CONVERSION FUNNEL ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10 mb-8">
          <h2 className="font-display text-xl text-ink-900 mb-6">Conversion Funnel</h2>
          <div className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm">
            <div className="space-y-6">
              {/* Total Quotes */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink-900 mb-1">Total Quotes</p>
                  <p className="text-[13px] text-ink-400">All quotes in system</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-ink-900">{totalQuotes}</p>
                  <p className="text-[12px] text-ink-400">{formatCurrency(quotes.reduce((sum, q) => sum + q.total_fee, 0))}</p>
                </div>
              </div>
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-400 rounded-xl" style={{ width: '100%' }}></div>
              </div>

              {/* Sent Arrow */}
              <div className="flex items-center justify-center">
                <div className="text-2xl text-ink-300">↓</div>
              </div>

              {/* Sent Quotes */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink-900 mb-1">Sent to Client</p>
                  <p className="text-[13px] text-ink-400">Conversion: {conversionRates.sent}%</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-ink-900">{sentQuotes}</p>
                  <p className="text-[12px] text-ink-400">{formatCurrency(quotes.filter(q => q.sent_at).reduce((sum, q) => sum + q.total_fee, 0))}</p>
                </div>
              </div>
              <div className="h-12 bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500 rounded-xl" style={{ width: `${(sentQuotes / totalQuotes) * 100}%` }}></div>
              </div>

              {/* Viewed Arrow */}
              <div className="flex items-center justify-center">
                <div className="text-2xl text-ink-300">↓</div>
              </div>

              {/* Viewed Quotes */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink-900 mb-1">Viewed by Client</p>
                  <p className="text-[13px] text-ink-400">Conversion: {conversionRates.viewed}%</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-ink-900">{viewedQuotes}</p>
                  <p className="text-[12px] text-ink-400">{formatCurrency(quotes.filter(q => q.viewed_count > 0).reduce((sum, q) => sum + q.total_fee, 0))}</p>
                </div>
              </div>
              <div className="h-12 bg-gradient-to-r from-indigo-200 to-indigo-100 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500 rounded-xl" style={{ width: `${(viewedQuotes / totalQuotes) * 100}%` }}></div>
              </div>

              {/* Accepted Arrow */}
              <div className="flex items-center justify-center">
                <div className="text-2xl text-ink-300">↓</div>
              </div>

              {/* Accepted Quotes */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink-900 mb-1">Accepted by Client</p>
                  <p className="text-[13px] text-ink-400">Final conversion: {conversionRates.accepted}%</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-ink-900">{acceptedQuotes}</p>
                  <p className="text-[12px] text-ink-400">{formatCurrency(quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total_fee, 0))}</p>
                </div>
              </div>
              <div className="h-12 bg-gradient-to-r from-emerald-200 to-emerald-100 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl" style={{ width: `${(acceptedQuotes / totalQuotes) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ QUOTES NEEDING FOLLOW-UP ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10 mb-8">
          <h2 className="font-display text-xl text-ink-900 mb-6">Quotes Needing Follow-Up</h2>
          {quoteNeedingFollowUp.length > 0 ? (
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200 bg-surface-50/50">
                      <th className="text-left px-6 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Quote</th>
                      <th className="text-left px-6 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Client</th>
                      <th className="text-left px-6 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Status</th>
                      <th className="text-right px-6 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Days Since</th>
                      <th className="text-right px-6 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Valid Until</th>
                      <th className="text-left px-6 py-4 text-[11px] text-ink-300 uppercase tracking-[0.08em] font-semibold">Action Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteNeedingFollowUp.map((quote, idx) => {
                      const sentDate = quote.sent_at ? new Date(quote.sent_at) : new Date()
                      const daysSinceSent = Math.floor((now.getTime() - sentDate.getTime()) / 86400000)
                      const daysUntilExpiry = Math.floor((new Date(quote.valid_until).getTime() - now.getTime()) / 86400000)

                      let actionLabel = ''
                      let actionColor = 'bg-slate-100 text-slate-700'

                      if (quote.status === 'sent' && quote.viewed_count === 0) {
                        actionLabel = 'Send Reminder'
                        actionColor = 'bg-amber-100 text-amber-700'
                      } else if (quote.status === 'viewed' && daysUntilExpiry < 7) {
                        actionLabel = 'Follow Up for Decision'
                        actionColor = 'bg-red-100 text-red-700'
                      } else if (daysUntilExpiry < 7) {
                        actionLabel = 'Expiring Soon'
                        actionColor = 'bg-red-100 text-red-700'
                      }

                      return (
                        <tr key={idx} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-[13px] font-medium text-ink-900">{quote.quote_reference}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[13px] text-ink-600">{quote.client_name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn('inline-block px-3 py-1 rounded-full text-[11px] font-medium', feeQuoteStatusColor(quote.status))}>
                              {feeQuoteStatusLabel(quote.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-[13px] text-ink-600">{daysSinceSent} days</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-[13px] text-ink-600">{formatDate(quote.valid_until)}</p>
                            {daysUntilExpiry <= 7 && (
                              <p className="text-[12px] text-red-600 font-medium">{daysUntilExpiry} days remaining</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn('inline-block px-3 py-1 rounded-full text-[11px] font-medium', actionColor)}>
                              {actionLabel}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
              <p className="text-[14px] text-ink-400">No quotes currently need follow-up action</p>
            </div>
          )}
        </div>
      </section>

      {/* ━━━ RECENT ACTIVITY TIMELINE ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-200/60 pt-10 mb-8">
          <h2 className="font-display text-xl text-ink-900 mb-6">Recent Activity</h2>
          {recentViews.length > 0 ? (
            <div className="space-y-0">
              {recentViews.map((view, idx) => (
                <div key={idx} className="bg-white border border-surface-200 border-t-0 first:border-t p-6 hover:bg-surface-50/50 transition-colors group">
                  <div className="flex items-start gap-6">
                    {/* Timeline dot */}
                    <div className="pt-1">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-indigo-100"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <p className="text-[13px] font-medium text-ink-900">
                          {view.viewer_identifier} viewed <span className="font-semibold">{view.quoteRef}</span>
                        </p>
                        <p className="text-[12px] text-ink-400 whitespace-nowrap">{timeAgo(view.viewed_at)}</p>
                      </div>
                      <p className="text-[13px] text-ink-600 mb-3">{view.quoteName}</p>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'inline-block px-2 py-1 rounded text-[11px] font-medium',
                          view.source === 'email' && 'bg-blue-100 text-blue-700',
                          view.source === 'portal' && 'bg-indigo-100 text-indigo-700',
                          view.source === 'direct_link' && 'bg-slate-100 text-slate-600',
                        )}>
                          {view.source === 'email' && 'Email'}
                          {view.source === 'portal' && 'Portal'}
                          {view.source === 'direct_link' && 'Direct Link'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
              <p className="text-[14px] text-ink-400">No recent activity</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
