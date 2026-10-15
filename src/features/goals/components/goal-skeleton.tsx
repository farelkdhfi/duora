import { TotalSavingsCardSkeleton } from "./total-savings-card";

export default function GoalSkeleton() {
    return (
        <div className="animate-pulse space-y-5">
            {/* TOTAL SAVINGS */}
            <TotalSavingsCardSkeleton />

            {/* FILTERS + ADD BUTTON */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3 overflow-hidden rounded-full bg-subprimary p-1.5">
                    <div className="h-7 w-10 shrink-0 rounded-full bg-primary" />
                    <div className="h-3 w-12 shrink-0 rounded-full bg-white/10" />
                    <div className="h-3 w-12 shrink-0 rounded-full bg-white/10" />
                    <div className="h-3 w-12 shrink-0 rounded-full bg-white/10" />
                </div>

                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-subprimary">
                    <div className="size-4 rounded bg-white/10" />
                </div>
            </div>

            {/* GOAL COUNT */}
            <div className="px-1">
                <div className="h-3 w-14 rounded-full bg-subprimary" />
            </div>

            {/* GOAL CARDS */}
            <div className="space-y-4">
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="rounded-[1.65rem] border border-white/[0.07] bg-subprimary p-4"
                    >
                        {/* Title + Actions */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="h-4 w-28 rounded-md bg-white/10" />

                            <div className="flex shrink-0 items-center gap-2">
                                <div className="size-7 rounded-full border border-white/[0.07] bg-primary" />
                                <div className="size-7 rounded-full border border-white/[0.07] bg-primary" />
                            </div>
                        </div>

                        {/* Savings + Percentage */}
                        <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="h-4 w-24 rounded-md bg-white/10" />
                            <div className="h-3 w-8 rounded-full bg-white/10" />
                        </div>

                        {/* Progress */}
                        <div className="mt-3 h-[7px] overflow-hidden rounded-full bg-primary">
                            <div
                                className={`h-full rounded-full bg-white/15 ${item === 1 ? 'w-[47%]' : 'w-[10%]'
                                    }`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom navigation spacing */}
            <div className="h-28" />
        </div>
    )
}
