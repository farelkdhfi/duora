'use client'

import { StickyNote } from 'lucide-react'

import NoteBoard from '@/features/notes/components/note-board'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import Header from '@/components/layout/header'

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
            <Header 
            title='notes' 
            description='Keep the little thoughts and moments you want to remember together.' 
            icon={StickyNote}
            />

            <section className="mt-6 sm:mt-8">
                <NoteBoard relationshipId={relationshipId} />
            </section>
        </div>
    )
}