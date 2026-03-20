import { HealthStatus, TaskStatus, RiskSeverity } from './types'

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function healthColor(h: HealthStatus): string {
  switch (h) {
    case 'green': return 'bg-emerald-100 text-emerald-800'
    case 'amber': return 'bg-amber-100 text-amber-800'
    case 'red': return 'bg-red-100 text-red-800'
  }
}

export function healthDot(h: HealthStatus): string {
  switch (h) {
    case 'green': return 'bg-emerald-500'
    case 'amber': return 'bg-amber-500'
    case 'red': return 'bg-red-500'
  }
}

export function statusLabel(s: TaskStatus): string {
  switch (s) {
    case 'not_started': return 'Not Started'
    case 'in_progress': return 'In Progress'
    case 'done': return 'Done'
    case 'blocked': return 'Blocked'
  }
}

export function statusColor(s: TaskStatus): string {
  switch (s) {
    case 'not_started': return 'bg-slate-100 text-slate-600'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'done': return 'bg-emerald-100 text-emerald-700'
    case 'blocked': return 'bg-red-100 text-red-700'
  }
}

export function severityColor(s: RiskSeverity): string {
  switch (s) {
    case 'low': return 'bg-slate-100 text-slate-600 border-slate-200'
    case 'medium': return 'bg-amber-50 text-amber-800 border-amber-200'
    case 'high': return 'bg-red-50 text-red-800 border-red-200'
  }
}

export function severityDot(s: RiskSeverity): string {
  switch (s) {
    case 'low': return 'bg-slate-400'
    case 'medium': return 'bg-amber-500'
    case 'high': return 'bg-red-500'
  }
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}
