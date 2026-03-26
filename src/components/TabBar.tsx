import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
  count?: number
}

interface TabBarProps {
  tabs: Tab[]
  activeKey: string
  onSelect: (key: string) => void
}

export function TabBar({ tabs, activeKey, onSelect }: TabBarProps) {
  return (
    <div className="flex gap-1 bg-surface-100 rounded-xl p-1">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onSelect(tab.key)}
          className={cn(
            'flex-1 px-3 py-2 text-[12px] font-medium rounded-lg transition-all',
            activeKey === tab.key
              ? 'bg-white text-ink-900 shadow-card'
              : 'text-ink-400 hover:text-ink-700'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold',
              activeKey === tab.key ? 'bg-accent-50 text-accent-700' : 'bg-surface-200 text-ink-400'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
