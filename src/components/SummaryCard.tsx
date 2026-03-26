interface SummaryCardProps {
  value: number
  label: string
  bgColor?: string
  borderColor?: string
  textColor?: string
  labelColor?: string
}

export function SummaryCard({
  value,
  label,
  bgColor = 'bg-white',
  borderColor = 'border-surface-200',
  textColor = 'text-ink-900',
  labelColor = 'text-ink-400',
}: SummaryCardProps) {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl p-4 text-center shadow-card`}>
      <p className={`text-2xl font-light tracking-tight ${textColor}`}>{value}</p>
      <p className={`text-[11px] ${labelColor} font-medium mt-1.5 tracking-wide`}>{label}</p>
    </div>
  )
}
