'use client'

import {
  ArrowDownLeft,
  CalendarDays,
  Heart,
  Wallet,
} from 'lucide-react'

import {
  useGoalSavings,
} from '../queries'


interface SavingsHistoryProps {
  goalId: string
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}


function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}


export default function SavingsHistory({
  goalId,
}: SavingsHistoryProps) {

  const {
    data: savings,
    isLoading,
  } = useGoalSavings(goalId)


  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <section className="rounded-[1.75rem] border border-black/[0.05] bg-white p-6">

        <div className="animate-pulse">

          <div className="flex items-center gap-3">

            <div className="size-10 rounded-[14px] bg-neutral-100" />

            <div className="space-y-2">

              <div className="h-2.5 w-20 rounded-full bg-neutral-100" />

              <div className="h-4 w-32 rounded-full bg-neutral-100" />

            </div>

          </div>


          <div className="mt-7 space-y-5">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-3">

                  <div className="size-10 rounded-full bg-neutral-100" />

                  <div className="space-y-2">

                    <div className="h-3 w-24 rounded-full bg-neutral-100" />

                    <div className="h-2.5 w-32 rounded-full bg-neutral-100" />

                  </div>

                </div>


                <div className="h-3 w-20 rounded-full bg-neutral-100" />

              </div>

            ))}

          </div>

        </div>

      </section>
    )
  }


  /* ========================================================= */
  /* EMPTY */
  /* ========================================================= */

  if (!savings?.length) {
    return (
      <section className="rounded-[1.75rem] border border-dashed border-black/[0.08] bg-white p-8">

        <div className="flex flex-col items-center text-center">

          <div className="flex size-11 items-center justify-center rounded-2xl bg-neutral-50">

            <Wallet
              size={18}
              strokeWidth={1.8}
              className="text-neutral-300"
            />

          </div>


          <h3 className="mt-4 text-sm font-semibold text-neutral-700">
            No savings yet
          </h3>


          <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-neutral-400">
            Your contributions will appear here
            as you start saving together.
          </p>

        </div>

      </section>
    )
  }


  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white shadow-[0_15px_40px_-25px_rgba(0,0,0,0.12)]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="relative border-b border-black/[0.05] px-6 py-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-50 to-pink-50">

              <Wallet
                size={17}
                strokeWidth={2}
                className="text-blue-500"
              />

            </div>


            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
                Activity
              </p>


              <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-neutral-800">
                Savings history
              </h2>

            </div>

          </div>


          <div className="rounded-full bg-neutral-50 px-3 py-1.5">

            <span className="text-[10px] font-semibold text-neutral-400">
              {savings.length}{' '}
              {savings.length === 1
                ? 'contribution'
                : 'contributions'}
            </span>

          </div>

        </div>

      </div>


      {/* ===================================================== */}
      {/* LIST */}
      {/* ===================================================== */}

      <div className="px-6">

        {savings.map(
          (saving, index) => {

            const name =
              saving.profile
                ?.display_name ??
              saving.profile
                ?.username ??
              'Unknown'


            const isLast =
              index ===
              savings.length - 1


            return (
              <div
                key={saving.id}
                className={`flex items-center justify-between gap-4 py-5 ${
                  !isLast
                    ? 'border-b border-black/[0.05]'
                    : ''
                }`}
              >

                {/* LEFT */}

                <div className="flex min-w-0 items-center gap-3.5">

                  {/* Avatar */}

                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-pink-50">

                    <span className="text-[12px] font-semibold text-neutral-500">
                      {name
                        .slice(0, 1)
                        .toUpperCase()}
                    </span>


                    <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-emerald-400 text-white">

                      <ArrowDownLeft
                        size={8}
                        strokeWidth={3}
                      />

                    </div>

                  </div>


                  {/* INFO */}

                  <div className="min-w-0">

                    <p className="truncate text-[13px] font-semibold text-neutral-700">
                      {name}
                    </p>


                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-300">

                      <span className="flex items-center gap-1">

                        <CalendarDays
                          size={10}
                          strokeWidth={2}
                        />

                        {formatDate(
                          saving.created_at,
                        )}

                      </span>


                      <span>
                        ·
                      </span>


                      <span>
                        {formatTime(
                          saving.created_at,
                        )}
                      </span>

                    </div>


                    {saving.note && (

                      <p className="mt-1.5 max-w-[260px] truncate text-[11px] italic text-neutral-400">
                        “{saving.note}”
                      </p>

                    )}

                  </div>

                </div>


                {/* RIGHT */}

                <div className="shrink-0 text-right">

                  <p className="text-[13px] font-semibold tabular-nums text-emerald-600">

                    + Rp{' '}

                    {Number(
                      saving.amount,
                    ).toLocaleString(
                      'id-ID',
                    )}

                  </p>


                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] font-medium text-neutral-300">

                    <Heart
                      size={9}
                      fill="currentColor"
                      className="text-pink-300"
                    />

                    saved together

                  </div>

                </div>

              </div>
            )
          },
        )}

      </div>

    </section>
  )
}