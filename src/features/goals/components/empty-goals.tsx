'use client'

import { Plus, Target } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useRupiah } from '@/lib/use-rupiah'

interface Prop {
    onCreate: () => void
}

const ONE_MILLION = 1_000_000

export default function EmptyGoals({ onCreate }: Prop) {
    const t = useTranslations('goals.list')
    const te = useTranslations('goals.empty')
    const { rupiahCompact } = useRupiah()

    const threshold = rupiahCompact(ONE_MILLION)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 opacity-30 items-center gap-1 overflow-x-auto rounded-full bg-black p-1 scrollbar-none">
                    <button
                        type="button"
                        className="whitespace-nowrap rounded-full bg-subprimary px-3 py-1.5 text-sm font-semibold text-secondary shadow-[0_2px_8px_-4px_rgba(0,0,0,0.2)] sm:px-3.5 sm:text-xs"
                    >
                        {t('filters.all')}
                    </button>

                    <button
                        type="button"
                        disabled
                        className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-300 sm:px-3.5 sm:text-xs"
                    >
                        {t('filters.newest')}
                    </button>

                    <button
                        type="button"
                        disabled
                        className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-300 sm:px-3.5 sm:text-xs"
                    >
                        {t('filters.under', { amount: threshold })}
                    </button>

                    <button
                        type="button"
                        disabled
                        className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-300 sm:px-3.5 sm:text-xs"
                    >
                        {t('filters.over', { amount: threshold })}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onCreate}
                    aria-label={t('createGoal')}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-secondary transition-all duration-200 hover:scale-105 hover:bg-black active:scale-95"
                >
                    <Plus size={15} strokeWidth={1.8} />
                </button>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-primary p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
                <div className="relative overflow-hidden rounded-[1.7rem] primary p-10 text-center md:p-12">
                    <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/[0.05] blur-[80px]" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-500/[0.06] blur-[80px]" />

                    <div className="relative">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-black shadow-sm">
                            <Target
                                size={21}
                                strokeWidth={1.8}
                                className="text-neutral-400"
                            />
                        </div>

                        <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.02em] text-secondary">
                            {te('title')}
                        </h3>

                        <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-neutral-400">
                            {te('description')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}