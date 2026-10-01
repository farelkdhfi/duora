import { Heart } from "lucide-react"

export default function DashboardGreeting({
  name,
}: {
  name: string
}) {
  return (
    <header>
      <p className="text-sm text-neutral-400">
        Welcome back,
      </p>

      <div className="mt-1 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            {name}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">
            Everything you build together,
            in one place.
          </p>
        </div>

        <Heart
          size={18}
          className="text-black"
          fill="currentColor"
        />
      </div>
    </header>
  )
}