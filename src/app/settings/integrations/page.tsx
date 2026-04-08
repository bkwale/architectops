'use client'

import { getIntegrations, getIntegrationsByCategory, getUser } from '@/lib/mock-data'
import { Integration, IntegrationStatus } from '@/lib/types'
import { cn, formatDate, integrationStatusColor, integrationStatusLabel, integrationStatusDot } from '@/lib/utils'
import { Breadcrumb } from '@/components/Breadcrumb'

// ── Helper: Get provider icon and color ──────────────────────
function getProviderIcon(provider: string): { bg: string; text: string; letter: string } {
  switch (provider) {
    case 'xero':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', letter: 'X' }
    case 'quickbooks':
      return { bg: 'bg-blue-100', text: 'text-blue-700', letter: 'Q' }
    case 'outlook':
      return { bg: 'bg-blue-100', text: 'text-blue-700', letter: 'O' }
    case 'google_calendar':
      return { bg: 'bg-red-100', text: 'text-red-700', letter: 'G' }
    case 'sharepoint':
      return { bg: 'bg-teal-100', text: 'text-teal-700', letter: 'S' }
    case 'dropbox':
      return { bg: 'bg-blue-100', text: 'text-blue-700', letter: 'D' }
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600', letter: '?' }
  }
}

// ── Helper: Get category label ──────────────────────────────
function getCategoryLabel(category: string): string {
  switch (category) {
    case 'accounting': return 'Accounting'
    case 'calendar': return 'Calendar & Email'
    case 'storage': return 'Document Storage'
    default: return category
  }
}

// ── Helper: Get last sync time for display ──────────────────
function getLastSyncDisplay(lastSyncAt?: string, syncFrequency?: number): string {
  if (!lastSyncAt) return 'Never'
  const date = new Date(lastSyncAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / 60000)
    return `${diffMins}m ago`
  }
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return formatDate(lastSyncAt)
}

// ── Component: Integration Card ─────────────────────────────
function IntegrationCard({ integration }: { integration: Integration }) {
  const { bg, text, letter } = getProviderIcon(integration.provider)
  const user = integration.connected_by_user_id ? getUser(integration.connected_by_user_id) : null

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      {/* Header: Icon + Title + Status */}
      <div className="flex gap-4 mb-4">
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center font-semibold shrink-0', bg, text)}>
          {letter}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-ink-900">{integration.display_name}</h3>
          <p className="text-xs text-ink-400 mt-1 line-clamp-2">{integration.description}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={cn('w-2 h-2 rounded-full', integrationStatusDot(integration.status))} />
          <span className={cn('text-xs font-medium uppercase tracking-[0.05em]', integrationStatusColor(integration.status))}>
            {integrationStatusLabel(integration.status)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-3" />

      {/* Status details and error message */}
      <div className="space-y-2 mb-4">
        {integration.status === 'connected' && user && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-xs text-ink-400">Connected by</p>
              <p className="text-xs text-ink-700 font-medium">{user.name}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-ink-400">Last sync</p>
              <p className="text-xs text-ink-700 font-medium">{getLastSyncDisplay(integration.last_sync_at, integration.sync_frequency_minutes)}</p>
            </div>
            {integration.sync_frequency_minutes && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-ink-400">Sync frequency</p>
                <p className="text-xs text-ink-700 font-medium">Every {integration.sync_frequency_minutes}m</p>
              </div>
            )}
          </>
        )}

        {integration.status === 'error' && integration.config.error_message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700">{integration.config.error_message}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {integration.status === 'connected' ? (
          <>
            <button className="flex-1 px-3 py-2 text-xs font-medium text-ink-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Disconnect
            </button>
            <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors">
              Sync Now
            </button>
          </>
        ) : (
          <button className="w-full px-3 py-2 text-xs font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors">
            Connect
          </button>
        )}
      </div>
    </div>
  )
}

export default function IntegrationsHubPage() {
  const integrations = getIntegrations()

  // Group integrations by category
  const byCategory = {
    accounting: getIntegrationsByCategory('accounting'),
    calendar: getIntegrationsByCategory('calendar'),
    storage: getIntegrationsByCategory('storage'),
  }

  return (
    <div className="max-w-6xl">
      {/* ━━━ BREADCRUMB & HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-12">
        <Breadcrumb
          items={[
            { label: 'Settings' },
            { label: 'Integrations' },
          ]}
        />

        <div className="mt-8">
          <h1 className="font-display text-3xl text-ink-900 mb-2">Integrations</h1>
          <p className="text-sm text-ink-400">
            Connect your practice tools to sync data automatically
          </p>
        </div>
      </section>

      {/* ━━━ ACCOUNTING INTEGRATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pb-12">
        <div className="border-t border-slate-200 pt-8">
          <h2 className="font-display text-xl text-ink-900 mb-4">Accounting</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {byCategory.accounting.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CALENDAR & EMAIL INTEGRATIONS ━━━━━━━━━━━━━━━━━ */}
      <section className="pb-12">
        <div className="border-t border-slate-200 pt-8">
          <h2 className="font-display text-xl text-ink-900 mb-4">Calendar & Email</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {byCategory.calendar.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ DOCUMENT STORAGE INTEGRATIONS ━━━━━━━━━━━━━━━━━ */}
      <section className="pb-16">
        <div className="border-t border-slate-200 pt-8">
          <h2 className="font-display text-xl text-ink-900 mb-4">Document Storage</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {byCategory.storage.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
