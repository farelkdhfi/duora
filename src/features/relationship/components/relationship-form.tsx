// features/relationship/components/relationship-form.tsx

'use client'

import { useEffect, useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'

import { useMyRelationshipDetails, useUpdateRelationship } from '../queries'

function SectionIcon({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'flex size-8 shrink-0 items-center justify-center',
        'rounded-[11px]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export default function RelationshipForm() {
  const { data, isLoading } = useMyRelationshipDetails()
  const updateRelationship = useUpdateRelationship()

  const [name, setName] = useState('')
  const [startedAt, setStartedAt] = useState('')
  const [hasEdited, setHasEdited] = useState(false)
  const [saved, setSaved] = useState(false)

  const relationship = data?.relationship

  useEffect(() => {
    if (!relationship || hasEdited) return

    setName(relationship.name ?? '')
    setStartedAt(relationship.started_at ?? '')
  }, [relationship, hasEdited])

  function handleNameChange(value: string) {
    setHasEdited(true)
    setName(value)
    setSaved(false)
  }

  function handleDateChange(value: string) {
    setHasEdited(true)
    setStartedAt(value)
    setSaved(false)
  }

  const isUnchanged =
    !hasEdited ||
    (name.trim() === relationship?.name &&
      startedAt === (relationship?.started_at ?? ''))

  function handleSave() {
    const trimmedName = name.trim()

    if (!trimmedName || isUnchanged) return

    updateRelationship.mutate(
      {
        relationshipName: trimmedName,
        startedAt: startedAt || null,
      },
      {
        onSuccess: () => {
          setHasEdited(false)
          setSaved(true)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-[28px] border border-black/[0.06] bg-white p-5 sm:p-8">
        <div className="h-3 w-24 rounded-full bg-neutral-100" />
        <div className="mt-3 h-5 w-48 rounded-lg bg-neutral-100" />
        <div className="mt-8 h-12 rounded-2xl bg-neutral-100" />
        <div className="mt-4 h-12 rounded-2xl bg-neutral-100" />
      </div>
    )
  }

  if (!relationship) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_50px_-24px_rgba(0,0,0,0.16)]">
      {/* AMBIENT */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-pink-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-100/40 blur-3xl" />

      {/* TOP ACCENT */}
      <div className="relative h-[3px] bg-gradient-to-r from-pink-400 via-neutral-900 to-blue-400" />

      <div className="relative p-5 sm:p-8 lg:p-10">
        {/* HEADER */}
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:text-[11px]">
            Relationship
          </p>

          <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[23px]">
            Your story together
          </h2>

          <p className="mt-1.5 max-w-md text-[12.5px] leading-relaxed text-neutral-400 sm:text-[13px]">
            Update your relationship name and the day it all began.
          </p>
        </div>

        <div className="my-7 h-px bg-black/[0.05] sm:my-9" />

        {/* RELATIONSHIP NAME */}
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <SectionIcon className="bg-pink-50">
              <Heart size={15} strokeWidth={2.25} className="text-pink-500" fill="currentColor" />
            </SectionIcon>

            <div>
              <label
                htmlFor="relationship_name"
                className="block text-[13px] font-semibold text-neutral-900"
              >
                Relationship name
              </label>

              <p className="mt-0.5 text-[11px] text-neutral-400">
                A name for you and your partner.
              </p>
            </div>
          </div>

          <input
            id="relationship_name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Tika & Farel"
            maxLength={50}
            className="min-h-12 w-full rounded-[16px] border border-black/[0.06] bg-neutral-50 px-4 py-3 text-[14px] text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900/20 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.04]"
          />
        </div>

        <div className="my-6 h-px bg-black/[0.045]" />

        {/* STARTED AT */}
        <div>
          <label
            htmlFor="started_at"
            className="block text-[13px] font-semibold text-neutral-900"
          >
            Together since
          </label>

          <p className="mt-0.5 text-[11px] text-neutral-400">
            The date your relationship began.
          </p>

          <input
            id="started_at"
            type="date"
            value={startedAt}
            onChange={(e) => handleDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="mt-3 min-h-12 w-full rounded-[16px] border border-black/[0.06] bg-neutral-50 px-4 py-3 text-[14px] text-neutral-900 outline-none transition-all duration-200 focus:border-neutral-900/20 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.04]"
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="mt-7">
          <button
            type="button"
            onClick={handleSave}
            disabled={updateRelationship.isPending || isUnchanged}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-neutral-900 px-6 text-[13px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
          >
            {updateRelationship.isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </button>
        </div>

        {saved && (
          <div className="mt-3 flex items-center gap-2 text-[12px] font-medium text-emerald-500">
            <span className="flex size-4 items-center justify-center rounded-full bg-emerald-50">
              ✓
            </span>
            Relationship updated successfully.
          </div>
        )}

        {updateRelationship.isError && (
          <div className="mt-3 rounded-[14px] border border-red-100 bg-red-50/70 px-3.5 py-2.5">
            <p className="text-[12px] font-medium text-red-500">
              Failed to update. Try again.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}