'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Target,
  Wallet,
} from 'lucide-react'

import {
  useGoal,
} from '@/features/goals/queries'

import CreateSavingForm from '@/features/savings/components/create-saving-form'
import SavingsProgress from '@/features/savings/components/savings-progress'
import SavingsHistory from '@/features/savings/components/savings-history'

import {
  useMyRelationshipDetails,
} from '@/features/relationship/queries'

import Checklist from '@/features/goals/components/checklist'


interface GoalDetailPageProps {
  params: Promise<{
    id: string
  }>
}


export default async function GoalDetailPage({
  params,
}: GoalDetailPageProps) {

  const { id } = await params

  return (
    <GoalDetail
      goalId={id}
    />
  )
}


function GoalDetail({
  goalId,
}: {
  goalId: string
}) {

  const {
    data: goal,
    isLoading,
    error,
  } = useGoal(goalId)


  const {
    data: relationship,
  } = useMyRelationshipDetails()


  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="animate-pulse">

        <div className="h-4 w-28 rounded-full bg-neutral-100" />

        <div className="mt-8 h-3 w-20 rounded-full bg-neutral-100" />

        <div className="mt-3 h-10 w-72 rounded-xl bg-neutral-100" />

        <div className="mt-3 h-4 w-96 max-w-full rounded-full bg-neutral-100" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="h-28 rounded-[1.5rem] bg-neutral-100" />

          <div className="h-28 rounded-[1.5rem] bg-neutral-100" />

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* ERROR */
  /* ========================================================= */

  if (error || !goal) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">

        {/* Ambient */}

        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />


        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl">

          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-50">

            <Target
              size={20}
              className="text-rose-400"
            />

          </div>


          <h1 className="mt-5 text-lg font-semibold text-neutral-800">
            Goal not found
          </h1>


          <p className="mt-2 text-sm leading-6 text-neutral-400">
            {error?.message ??
              'This goal may have been deleted or is no longer available.'}
          </p>


          <Link
            href="/goals"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >

            <ArrowLeft size={14} />

            Back to goals

          </Link>

        </div>

      </div>
    )
  }


  return (
    <div>

      {/* =================================================== */}
      {/* BACK */}
      {/* =================================================== */}

      <Link
        href="/goals"
        className="group inline-flex items-center gap-2 text-[13px] font-medium text-neutral-400 transition-colors hover:text-neutral-800"
      >

        <ArrowLeft
          size={15}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />

        Back to goals

      </Link>


      {/* =================================================== */}
      {/* HERO */}
      {/* =================================================== */}

      <section className="relative mt-5 overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 p-7 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-9">

        {/* Ambient */}

        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-pink-100/40 blur-3xl" />


        <div className="relative">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">

              {/* Category */}

              <div className="flex items-center gap-2">

                <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50">

                  <Target
                    size={14}
                    strokeWidth={2}
                    className="text-blue-500"
                  />

                </div>


                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                  {goal.category}
                </p>

              </div>


              {/* Title */}

              <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-neutral-800 md:text-4xl">
                {goal.title}
              </h1>


              {/* Description */}

              {goal.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                  {goal.description}
                </p>
              )}

            </div>


            {/* Goal icon */}

            <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-50 sm:flex">

              <ArrowUpRight
                size={19}
                className="text-neutral-300"
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* META */}
          {/* ================================================= */}

          <div className="mt-8 flex flex-wrap gap-2">

            {goal.target_amount !== null && (

              <div className="flex items-center gap-2 rounded-full bg-blue-50/80 px-3.5 py-2">

                <Target
                  size={13}
                  strokeWidth={2.3}
                  className="text-blue-500"
                />

                <span className="text-[11px] font-semibold text-blue-600">

                  Target Rp{' '}
                  {goal.target_amount.toLocaleString(
                    'id-ID',
                  )}

                </span>

              </div>

            )}


            {goal.deadline && (

              <div className="flex items-center gap-2 rounded-full bg-pink-50/80 px-3.5 py-2">

                <CalendarDays
                  size={13}
                  strokeWidth={2.3}
                  className="text-pink-500"
                />

                <span className="text-[11px] font-medium text-pink-600">

                  {new Date(
                    goal.deadline,
                  ).toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}

                </span>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =================================================== */}
      {/* CHECKLIST */}
      {/* =================================================== */}

      <section className="mt-6">

        <Checklist
          goalId={goal.id}
        />

      </section>


      {/* =================================================== */}
      {/* SAVINGS */}
      {/* =================================================== */}

      {relationship && (
        <>

          {/* ------------------------------------------------- */}
          {/* PROGRESS */}
          {/* ------------------------------------------------- */}

          <section className="mt-6">

            <div className="mb-3 flex items-center gap-2">

              <Wallet
                size={15}
                className="text-blue-500"
              />

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
                Shared savings
              </p>

            </div>


            <SavingsProgress
              goalId={goal.id}
              targetAmount={
                goal.target_amount
              }

            />

          </section>


          {/* ------------------------------------------------- */}
          {/* ADD SAVING */}
          {/* ------------------------------------------------- */}

          <section className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

            <div className="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-blue-100/40 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-16 -left-16 size-36 rounded-full bg-pink-100/30 blur-3xl" />


            <div className="relative">

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
                    Contribute
                  </p>


                  <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
                    Add to your shared savings
                  </h2>

                </div>

              </div>


              <div className="mt-7">

                <CreateSavingForm
                  relationshipId={
                    relationship
                      .relationship
                      .id
                  }
                  goalId={
                    goal.id
                  }
                />

              </div>

            </div>

          </section>


          {/* ------------------------------------------------- */}
          {/* HISTORY */}
          {/* ------------------------------------------------- */}

          <section className="mt-6">

            <div className="mb-3">

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
                Activity
              </p>


              <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
                Savings history
              </h2>

            </div>


            <SavingsHistory
              goalId={goal.id}
            />

          </section>

        </>
      )}

    </div>
  )
}