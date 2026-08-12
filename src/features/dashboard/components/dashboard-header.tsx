'use client'

interface DashboardHeaderProps {
  name: string
}

export default function DashboardHeader({
  name,
}: DashboardHeaderProps) {
  const hour = new Date().getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening'

  return (
    <div>
      <p className="text-sm text-neutral-400">
        {greeting}
      </p>

      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        Hi, {name} ❤️
      </h1>

      <p className="mt-2 text-sm text-neutral-500">
        Here’s what’s happening between you two today.
      </p>
    </div>
  )
}