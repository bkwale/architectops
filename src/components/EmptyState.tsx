interface EmptyStateProps {
  text: string
}

export function EmptyState({ text }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-10 text-center shadow-card">
      <p className="text-[13px] text-ink-300">{text}</p>
    </div>
  )
}
