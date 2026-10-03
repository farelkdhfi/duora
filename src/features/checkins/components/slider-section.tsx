import { useForm } from "react-hook-form"
import { DailyCheckinFormValues } from "../schemas"

export default function SliderSection({
  label,
  value,
  minLabel,
  maxLabel,
  register,
  name,
  error,
}: {
  label: string
  value: number
  minLabel: string
  maxLabel: string
  register: ReturnType<
    typeof useForm<DailyCheckinFormValues>
  >['register']
  name: 'energy' | 'stress'
  error?: string
}) {
  const percentage = ((value - 1) / 9) * 100

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold tracking-[-0.02em] text-neutral-800">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] text-neutral-400">
            Rate from 1 to 10
          </p>
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-900">
          <span className="text-[11px] font-semibold tabular-nums text-white">
            {value}
          </span>
        </div>
      </div>

      <div className="relative mt-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-neutral-900 transition-all duration-200"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <input
          {...register(name, {
            valueAsNumber: true,
          })}
          type="range"
          min="1"
          max="10"
          step="1"
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-neutral-900 [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/[0.08] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_3px_10px_rgba(0,0,0,0.14)]"
        />
      </div>

      <div className="mt-1 flex items-center justify-between">
        <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-300">
          {minLabel}
        </span>

        <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-300">
          {maxLabel}
        </span>
      </div>

      {error && (
        <p className="mt-2 text-[11px] font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  )
}