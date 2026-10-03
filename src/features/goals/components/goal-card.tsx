'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Trash2, Target } from 'lucide-react'

import type { Goal } from '../types'
import type { SavingTransactionWithProfile } from '@/features/savings/types'
import { useDeleteGoal } from '../queries'

interface GoalCardProps {
  goal: Goal
  savings?: SavingTransactionWithProfile[]
}

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export default function GoalCard({ goal, savings = [] }: GoalCardProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const deleteGoalMutation = useDeleteGoal(goal.relationship_id)

  const target = goal.target_amount ?? 0

  const totalSaved = savings.reduce((sum, saving) => sum + saving.amount, 0)

  const progress = target > 0 ? Math.min(100, Math.round((totalSaved / target) * 100)) : 0

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsConfirming(true)
  }

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteGoalMutation.mutate(goal.id)
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsConfirming(false)
  }

  if (isConfirming) {
    return (
      <div className="flex min-h-[190px] w-full flex-col justify-center rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] sm:min-h-[200px] sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-400">
            <Trash2 size={16} strokeWidth={1.8} />
          </div>

          <h3 className="mt-3 max-w-[240px] truncate text-[15px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[16px]">
            Delete “{goal.title}”?
          </h3>

          <p className="mt-1 text-[10px] text-neutral-400 sm:text-[11px]">
            This action cannot be undone.
          </p>

          <div className="mt-4 flex w-full max-w-[260px] gap-2">
            <button type="button" onClick={handleCancelDelete} disabled={deleteGoalMutation.isPending} className="flex h-9 flex-1 items-center justify-center rounded-full border border-black/[0.06] bg-white px-4 text-[10px] font-semibold text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-[11px]">
              Cancel
            </button>

            <button type="button" onClick={handleConfirmDelete} disabled={deleteGoalMutation.isPending} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-red-500 px-4 text-[10px] font-semibold text-white transition hover:bg-red-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-[11px]">
              <Trash2 size={11} strokeWidth={2} />
              {deleteGoalMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link href={`/goals/${goal.id}`} className="group block w-full rounded-[1.5rem] border border-black/[0.06] bg-white p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(0,0,0,0.07)] active:scale-[0.99] sm:p-5">
      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <h3 className="min-w-0 truncate pr-3 text-sm font-semibold leading-tight tracking-[-0.03em] text-neutral-900 sm:text-[19px]">
            {goal.title}
          </h3>

          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" aria-label="Delete goal" onClick={handleDeleteClick} className="flex size-7 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 transition hover:bg-red-50 hover:text-red-500 active:scale-95 sm:opacity-60 sm:group-hover:opacity-100">
              <Trash2 size={12} strokeWidth={2} />
            </button>

            <div className="flex size-7 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white">
              <ArrowUpRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        <div className="mt-1">
          {target > 0 ? (
            <>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-none text-neutral-800 sm:text-[24px]">
                    {formatRupiah(totalSaved)}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="mt-0.5 text-xs tracking-[-0.03em] text-neutral-800 sm:text-base">
                    {progress}%
                  </p>
                </div>
              </div>

              <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-linear-to-r from-pink-200 via-blue-100 to-blue-200 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5 border-t border-black/[0.05] pt-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
                <Target size={12} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[9px] font-medium text-neutral-600">
                  No target set yet
                </p>
                <p className="truncate text-[8px] text-neutral-400">
                  Add a target to start tracking
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}