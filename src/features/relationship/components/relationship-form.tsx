'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  Loader2,
} from 'lucide-react'

import {
  useMyRelationshipDetails,
  useUpdateRelationship,
} from '../queries'

export default function RelationshipForm() {
  const {
    data,
    isLoading,
  } = useMyRelationshipDetails()

  const updateRelationship = useUpdateRelationship()

  const [name, setName] = useState('')

  const [startedAt, setStartedAt] = useState('')

  const [hasEdited, setHasEdited] = useState(false)

  const [saved, setSaved] = useState(false)

  const relationship = data?.relationship

  useEffect(() => {
    if (!relationship || hasEdited) {
      return
    }

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
    (
      name.trim() === relationship?.name &&
      startedAt === (relationship?.started_at ?? '')
    )

  function handleSave() {
    const trimmedName = name.trim()

    if (!trimmedName || isUnchanged) {
      return
    }

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
      <div className="animate-pulse">
        <div className="h-5 w-40 rounded-lg bg-subprimary" />

        <div className="mt-2 h-4 w-64 rounded-lg bg-subprimary" />

        <div className="mt-7 h-12 rounded-[14px] bg-subprimary" />

        <div className="mt-5 h-12 rounded-[14px] bg-subprimary" />

        <div className="mt-5 h-12 w-24 rounded-[14px] bg-subprimary" />
      </div>
    )
  }

  if (!relationship) {
    return null
  }

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.03em] text-secondary sm:text-xl">
          Relationship
        </h2>

        <p className="mt-1 text-sm leading-6 text-description">
          The details of your shared space.
        </p>
      </div>

      <div className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="relationship_name"
            className="block text-[13px] font-semibold text-secondary"
          >
            Relationship name
          </label>

          <input
            id="relationship_name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Tika & Farel"
            maxLength={50}
            className="mt-2.5 min-h-12 w-full rounded-[14px] border border-white/[0.08] bg-subprimary/40 px-4 py-3 text-sm text-secondary outline-none transition-all duration-200 placeholder:text-description focus:border-white/20 focus:bg-primary focus:ring-4 focus:ring-white/[0.04]"
          />
        </div>

        <div>
          <label
            htmlFor="started_at"
            className="block text-[13px] font-semibold text-secondary"
          >
            Together since
          </label>

          <input
            id="started_at"
            type="date"
            value={startedAt}
            onChange={(e) => handleDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="mt-2.5 min-h-12 w-full rounded-[14px] border border-white/[0.08] bg-subprimary/40 px-4 py-3 text-sm text-secondary outline-none transition-all duration-200 focus:border-white/20 focus:bg-primary focus:ring-4 focus:ring-white/[0.04] [color-scheme:dark]"
          />
        </div>

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={
              updateRelationship.isPending ||
              isUnchanged
            }
            className="h-11 rounded-full bg-subprimary px-6 text-sm font-semibold text-secondary transition-all duration-200 hover:bg-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {updateRelationship.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Saving
              </span>
            ) : (
              'Save changes'
            )}
          </button>

          {saved && (
            <p className="text-xs font-medium text-emerald-500">
              Relationship updated.
            </p>
          )}

          {updateRelationship.isError && (
            <p className="text-xs font-medium text-red-500">
              Failed to update. Try again.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}