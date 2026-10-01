import { CheckCircle2 } from "lucide-react"

export default function MiniStatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof CheckCircle2
  label: string
  value: string
  accent: 'blue' | 'pink'
}) {
  const isBlue = accent === 'blue'

  const theme = isBlue
    ? {
      icon: 'bg-blue-50 text-blue-500 border-blue-100/60',
      glow: 'bg-blue-100/30',
      dot: 'bg-blue-400',
    }
    : {
      icon: 'bg-pink-50 text-pink-500 border-pink-100/60',
      glow: 'bg-pink-100/30',
      dot: 'bg-pink-400',
    }

  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white p-5 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-24px_rgba(0,0,0,0.18)]">

      {/* ================================================== */}
      {/* AMBIENT */}
      {/* ================================================== */}

      <div className={`pointer-events-none absolute -right-10 -top-10 size-24 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-70 ${theme.glow}`} />


      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative">

        {/* Icon */}

        <div className={`flex size-9 items-center justify-center rounded-[11px] border transition-transform duration-300 group-hover:scale-105 ${theme.icon}`}>
          <Icon
            size={15}
            strokeWidth={2.3}
          />
        </div>


        {/* Label */}

        <div className="mt-4 flex items-center gap-1.5">

          <span className={`size-1.5 rounded-full ${theme.dot}`} />

          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
            {label}
          </p>

        </div>


        {/* Value */}

        <p className="mt-1.5 text-[15px] font-semibold tracking-[-0.025em] text-neutral-800">
          {value}
        </p>

      </div>
    </div>
  )
}