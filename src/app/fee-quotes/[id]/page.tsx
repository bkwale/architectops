'use client'

import { useParams } from 'next/navigation'
import { getFeeQuoteRecord, getFeeQuoteLineItems, getProject, getOpportunity } from '@/lib/mock-data'
import { RIBA_STAGES } from '@/lib/types'
import { cn, formatDate, formatCurrency, feeQuoteStatusColor, feeQuoteStatusLabel } from '@/lib/utils'
import { Breadcrumb } from '@/components/Breadcrumb'
import { StatusBadge } from '@/components/StatusBadge'

export default function FeeQuoteDetailPage() {
  const params = useParams()
  const quoteId = params.id as string

  const quote = getFeeQuoteRecord(quoteId)
  const lineItems = getFeeQuoteLineItems(quoteId)
  const relatedProject = quote?.related_project_id ? getProject(quote.related_project_id) : null
  const relatedOpportunity = quote?.related_opportunity_id ? getOpportunity(quote.related_opportunity_id) : null

  if (!quote) {
    return (
      <div className="max-w-6xl">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Fee Quotes', href: '/fee-quotes' },
          { label: 'Not Found' },
        ]} />
        <div className="mt-16 text-center">
          <p className="text-[13px] text-ink-400">Fee quote not found.</p>
        </div>
      </div>
    )
  }

  const relatedName = relatedProject?.name || relatedOpportunity?.title || '—'
  const isExpired = quote.valid_until ? new Date(quote.valid_until) < new Date() : false
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="max-w-6xl">
      {/* ━━━ BREADCRUMB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-10">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Fee Quotes', href: '/fee-quotes' },
          { label: quote.quote_reference },
        ]} />
      </section>

      {/* ━━━ QUOTE HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[2rem] text-ink-900 mb-4">{quote.quote_reference}</h1>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge
                label={feeQuoteStatusLabel(quote.status)}
                colorClass={feeQuoteStatusColor(quote.status)}
              />
              {isExpired && (
                <span className="text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded-md font-medium">
                  EXPIRED
                </span>
              )}
            </div>
            <p className="text-[13px] text-ink-600 mb-1">{relatedName}</p>
            <p className="text-[12px] text-ink-400">{quote.fee_basis}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-[2rem] text-ink-900">
              {formatCurrency(quote.total_fee)}
            </p>
            <p className="text-[11px] text-ink-400 mt-2">Total Fee</p>
          </div>
        </div>
      </section>

      {/* ━━━ EXPIRED BANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isExpired && quote.valid_until && (
        <section className="mb-16">
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-[12px] text-red-800">
              This quote expired on {formatDate(quote.valid_until)}. Consider issuing a new quote if the client is still interested.
            </p>
          </div>
        </section>
      )}

      {/* ━━━ LINE ITEMS TABLE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-surface-300 pt-10">
          <h2 className="font-display text-[1.5rem] text-ink-900 mb-6">Fee Breakdown</h2>

          <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2rem_1fr_2fr_3fr_1fr] gap-6 px-6 py-3 bg-surface-50 border-b border-surface-200">
              <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">#</div>
              <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Stage</div>
              <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Title</div>
              <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em]">Description</div>
              <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em] text-right">Amount</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-surface-100">
              {lineItems.map((item, index) => {
                let typeColor = 'bg-blue-100'
                let typeDotColor = 'bg-blue-500'

                if (item.line_type === 'service') {
                  typeColor = 'bg-green-100'
                  typeDotColor = 'bg-green-500'
                } else if (item.line_type === 'expense') {
                  typeColor = 'bg-amber-100'
                  typeDotColor = 'bg-amber-500'
                } else if (item.line_type === 'discount') {
                  typeColor = 'bg-red-100'
                  typeDotColor = 'bg-red-500'
                }

                const stageName = item.related_stage !== undefined ? RIBA_STAGES[item.related_stage] : '—'

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2rem_1fr_2fr_3fr_1fr] gap-6 px-6 py-4 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', typeDotColor)} />
                    </div>
                    <div className="text-[12px] text-ink-600 font-mono">
                      {stageName}
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-ink-900">{item.title}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-500 line-clamp-2">{item.description || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-mono text-ink-900">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Subtotal Row */}
            <div className="grid grid-cols-[2rem_1fr_2fr_3fr_1fr] gap-6 px-6 py-4 bg-surface-50 border-t border-surface-200 font-semibold">
              <div />
              <div />
              <div />
              <div className="text-[12px] text-ink-600">Subtotal</div>
              <div className="text-right">
                <p className="text-[13px] font-mono text-ink-900">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TERMS & CONDITIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {quote.terms_text && (
        <section className="pb-16">
          <div className="border-t border-surface-200/60 pt-10 mt-10">
            <h3 className="text-[13px] font-semibold text-ink-900 uppercase tracking-[0.1em] mb-4">Terms & Conditions</h3>
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-[12px] text-ink-700 leading-relaxed whitespace-pre-wrap">
                  {quote.terms_text}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ━━━ EXCLUSIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {quote.exclusions_text && (
        <section className="pb-16">
          <div className="border-t border-surface-200/60 pt-10 mt-10">
            <h3 className="text-[13px] font-semibold text-ink-900 uppercase tracking-[0.1em] mb-4">Exclusions</h3>
            <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6">
              <ul className="space-y-2">
                {quote.exclusions_text.split('\n').filter(line => line.trim()).map((exclusion, i) => (
                  <li key={i} className="flex gap-3 text-[12px] text-ink-700">
                    <span className="text-ink-400 shrink-0">•</span>
                    <span>{exclusion.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ━━━ METADATA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-20">
        <div className="border-t border-surface-200/60 pt-10 mt-10">
          <h3 className="text-[13px] font-semibold text-ink-900 uppercase tracking-[0.1em] mb-4">Quote Details</h3>
          <div className="grid grid-cols-3 gap-8 text-[12px]">
            {quote.issued_date && (
              <div>
                <p className="text-ink-400 mb-1">Issued Date</p>
                <p className="text-ink-700 font-mono">{formatDate(quote.issued_date)}</p>
              </div>
            )}
            {quote.valid_until && (
              <div>
                <p className="text-ink-400 mb-1">Valid Until</p>
                <p className="text-ink-700 font-mono">{formatDate(quote.valid_until)}</p>
              </div>
            )}
            {quote.created_by_user_id && (
              <div>
                <p className="text-ink-400 mb-1">Created By</p>
                <p className="text-ink-700">{quote.created_by_user_id}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
