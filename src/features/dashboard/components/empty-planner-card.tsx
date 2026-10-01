import { CalendarDays } from "lucide-react";

export default function EmptyPlannerCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-blue-100/60 blur-2xl" />


      <div className="relative">

        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">

          <CalendarDays size={17} />

        </div>


        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-300">
          Next plan
        </p>


        <h2 className="mt-2 text-base font-semibold">
          No upcoming plans
        </h2>


        <p className="mt-1 text-sm leading-5 text-neutral-400">
          Time to plan something together.
        </p>

      </div>

    </div>
  )
}