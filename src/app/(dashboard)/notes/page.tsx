'use client'

import { StickyNote } from 'lucide-react'

import NoteBoard from '@/features/notes/components/note-board'
import { useMyRelationshipDetails } from '@/features/relationship/queries'

export default function NotesPage() {
    const { data, isLoading } = useMyRelationshipDetails()

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-3 w-24 rounded-full bg-neutral-100" />
                <div className="mt-3 h-8 w-48 rounded-xl bg-neutral-100" />
                <div className="mt-6 h-96 rounded-[2rem] bg-neutral-100" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-sm text-neutral-400">
                    Kamu perlu terhubung dengan pasangan dulu.
                </p>
            </div>
        )
    }

    const relationshipId = data.relationship.id

    return (
        <div>
            <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-blue-50 sm:size-8">
                    <StickyNote
                        size={13}
                        strokeWidth={2}
                        className="text-pink-500 sm:hidden"
                    />
                    <StickyNote
                        size={15}
                        strokeWidth={2}
                        className="hidden text-pink-500 sm:block"
                    />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                    Together
                </p>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-800 sm:mt-4 sm:text-3xl lg:text-4xl">
                Notes
            </h1>

            <p className="mt-2 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
                Keep the little thoughts and moments you want to remember together.
            </p>

            <section className="mt-6 sm:mt-8">
                <NoteBoard relationshipId={relationshipId} />
            </section>
        </div>
    )
}