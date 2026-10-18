'use client'

import { useTranslations } from 'next-intl'

import NoteBoard from '@/features/notes/components/note-board'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import Header from '@/components/layout/header'

export default function NotesPage() {
    const t = useTranslations('notes.page')
    const { data, isLoading } = useMyRelationshipDetails()

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-3 w-24 rounded-full bg-subprimary" />
                <div className="mt-3 h-8 w-48 rounded-xl bg-subprimary" />
                <div className="mt-6 h-96 rounded-[2rem] bg-subprimary" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-sm text-description">
                    {t('noRelationship')}
                </p>
            </div>
        )
    }

    const relationshipId = data.relationship.id

    return (
        <div>
            <Header
                title={t('title')}
                description={t('description')}
            />

            <section className="mt-6 sm:mt-8">
                <NoteBoard relationshipId={relationshipId} />
            </section>
        </div>
    )
}