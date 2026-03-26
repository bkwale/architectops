import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-ink-300">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-ink-200">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-accent-600 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-ink-500 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
