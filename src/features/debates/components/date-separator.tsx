interface DateSeparatorProps {
  date: string
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const isToday =
    date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    date.toDateString() ===
    yesterday.toDateString()

  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year:
      date.getFullYear() !== now.getFullYear()
        ? 'numeric'
        : undefined,
  })
}

export default function DateSeparator({
  date,
}: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center py-3">
      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[10px] font-medium text-description">
        {formatDateLabel(date)}
      </span>
    </div>
  )
}