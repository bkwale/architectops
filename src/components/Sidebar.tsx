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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-ink-900 shadow-elevated"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar — dark, quiet, architectural */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-72 bg-ink-900 z-40 transition-transform duration-200 flex flex-col',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="px-7 pt-8 pb-7">
          <Link href="/" className="flex items-center gap-3.5" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-[13px] tracking-tight font-display">A</span>
            </div>
            <div>
              <h1 className="font-display text-[17px] text-white leading-tight tracking-tight">ArchitectOps</h1>
              <p className="text-[9px] text-white/30 font-medium tracking-[0.2em] uppercase mt-0.5">Project Control</p>
            </div>
          </Link>
        </div>

        {/* Primary Nav */}
        <nav className="px-4 flex-1">
          <p className="text-[9px] font-semibold text-white/20 uppercase tracking-[0.18em] px-3 mb-3">Navigate</p>
          <div className="space-y-0.5">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  )}
                >
                  <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-white/80' : 'text-white/25')} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-8">
            <p className="text-[9px] font-semibold text-white/20 uppercase tracking-[0.18em] px-3 mb-3">Actions</p>
            <div className="space-y-0.5">
              {SECONDARY_ITEMS.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    )}
                  >
                    <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-white/80' : 'text-white/25')} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Thin divider */}
        <div className="mx-7 border-t border-white/8" />

        {/* Footer */}
        <div className="px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-semibold text-white/60">SM</div>
            <div>
              <p className="text-[12px] font-medium text-white/70">Sarah Mitchell</p>
              <p className="text-[10px] text-white/25">Practice Owner</p>
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
