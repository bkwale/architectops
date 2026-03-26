'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: GridIcon },
  { href: '/projects', label: 'Projects', icon: FolderIcon },
  { href: '/approvals', label: 'Approvals', icon: CheckCircleIcon },
]

const SECONDARY_ITEMS = [
  { href: '/projects/new', label: 'New Project', icon: PlusIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white shadow-card border border-surface-200"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5 text-ink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-ink-900/10 backdrop-blur-sm z-30" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-72 bg-white border-r border-surface-200 z-40 transition-transform duration-200 flex flex-col',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-6 pb-5">
          <Link href="/" className="flex items-center gap-3.5" onClick={() => setOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm tracking-tight">AO</span>
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-ink-900 leading-tight tracking-tight">ArchitectOps</h1>
              <p className="text-[10px] text-ink-400 font-medium tracking-[0.15em] uppercase mt-0.5">Project Control</p>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-surface-200" />

        {/* Primary Nav */}
        <nav className="px-4 pt-5 space-y-0.5 flex-1">
          <p className="text-[10px] font-semibold text-ink-300 uppercase tracking-[0.12em] px-3 mb-2">Navigate</p>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium',
                  isActive
                    ? 'bg-accent-50 text-accent-700'
                    : 'text-ink-500 hover:bg-surface-100 hover:text-ink-900'
                )}
              >
                <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-accent-500' : 'text-ink-300')} />
                {item.label}
              </Link>
            )
          })}

          <div className="pt-4">
            <p className="text-[10px] font-semibold text-ink-300 uppercase tracking-[0.12em] px-3 mb-2">Actions</p>
            {SECONDARY_ITEMS.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium',
                    isActive
                      ? 'bg-accent-50 text-accent-700'
                      : 'text-ink-500 hover:bg-surface-100 hover:text-ink-900'
                  )}
                >
                  <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-accent-500' : 'text-ink-300')} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center text-xs font-semibold text-ink-500">SM</div>
            <div>
              <p className="text-[13px] font-medium text-ink-700">Sarah Mitchell</p>
              <p className="text-[11px] text-ink-400">Practice Owner</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ── Inline SVG Icons ────────────────────────────────────────

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  )
}
