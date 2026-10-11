import { X } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
    title: string
    text: string
}

export default function HeaderWithoutShell({
    title,
    text
}: HeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{title}</p>
                <h1 className="mt-1 text-[25px] capitalize font-medium leading-tight tracking-[-0.045em] text-neutral-950 sm:text-[29px]">
                    {text}
                </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Link href="/dashboard" aria-label="Back to dashboard" className="flex size-9 items-center justify-center rounded-full border border-black/[0.05] bg-neutral-800 text-white shadow-sm transition-all duration-200 hover:bg-white hover:text-neutral-900 active:scale-95">
                    <X className="size-4" strokeWidth={1.8} />
                </Link>
            </div>
        </div>
    )
}