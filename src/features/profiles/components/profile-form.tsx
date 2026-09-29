'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Camera,
  Loader2,
} from 'lucide-react'

import {
  useGetMyProfile,
  useUpdateMyAvatar,
  useUpdateMyProfile,
} from '@/features/profiles/queries'

import ProfileSkeleton from './profile-skeleton'

const MAX_FILE_SIZE_MB = 5

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
]

export default function ProfileForm() {
  const {
    data: profile,
    isLoading,
  } = useGetMyProfile()

  const updateProfile = useUpdateMyProfile()
  const updateAvatar = useUpdateMyAvatar()

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [mounted, setMounted] =
    useState(false)

  const [displayName, setDisplayName] =
    useState('')

  const [hasEditedName, setHasEditedName] =
    useState(false)

  const [avatarError, setAvatarError] =
    useState<string | null>(null)

  const [nameSaved, setNameSaved] =
    useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!profile || hasEditedName) {
      return
    }

    setDisplayName(
      profile.display_name ?? '',
    )
  }, [
    profile,
    hasEditedName,
  ])

  const currentName = hasEditedName
    ? displayName
    : (profile?.display_name ?? '')

  const handleNameChange = (
    value: string,
  ) => {
    setHasEditedName(true)
    setDisplayName(value)
    setNameSaved(false)
  }

  const handleNameSave = () => {
    const trimmed =
      currentName.trim()

    if (
      !trimmed ||
      trimmed === profile?.display_name
    ) {
      return
    }

    updateProfile.mutate(
      {
        display_name: trimmed,
      },
      {
        onSuccess: () => {
          setDisplayName(trimmed)
          setHasEditedName(false)
          setNameSaved(true)
        },
      },
    )
  }

  const handleAvatarClick = () => {
    if (updateAvatar.isPending) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0]

    e.target.value = ''

    if (!file) {
      return
    }

    setAvatarError(null)

    if (
      !ACCEPTED_TYPES.includes(
        file.type,
      )
    ) {
      setAvatarError(
        'Use PNG, JPG, or WEBP.',
      )

      return
    }

    if (
      file.size >
      MAX_FILE_SIZE_MB *
        1024 *
        1024
    ) {
      setAvatarError(
        `Max file size is ${MAX_FILE_SIZE_MB}MB.`,
      )

      return
    }

    updateAvatar.mutate(file, {
      onError: () => {
        setAvatarError(
          'Failed to upload photo. Try again.',
        )
      },
    })
  }

  const isNameUnchanged =
    !hasEditedName ||
    !currentName.trim() ||
    currentName.trim() ===
      profile?.display_name

  if (!mounted || isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)]">
      {/* Ambient background */}

      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-blue-100/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-pink-100/30 blur-3xl" />

      <div className="relative p-6 sm:p-7 lg:p-8">
        {/* Header */}

        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-neutral-900 sm:text-xl">
            Profile
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-400">
            Your name and profile photo.
          </p>
        </div>

        {/* Profile preview */}

        <div className="mt-7 flex flex-col gap-5 rounded-[1.5rem] bg-neutral-50/80 p-5 sm:flex-row sm:items-center sm:p-6">
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={
              updateAvatar.isPending
            }
            className="group relative size-20 shrink-0 overflow-hidden rounded-full bg-neutral-200 outline-none ring-1 ring-black/[0.06] transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-neutral-900/20 disabled:cursor-not-allowed"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={
                  profile.display_name ??
                  'Avatar'
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xl font-semibold text-white">
                {(
                  profile?.display_name ??
                  profile?.username ??
                  '?'
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40">
              {updateAvatar.isPending ? (
                <Loader2
                  size={18}
                  className="animate-spin text-white"
                />
              ) : (
                <Camera
                  size={17}
                  strokeWidth={2}
                  className="text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
              )}
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={
              handleAvatarChange
            }
          />

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-neutral-900">
              {profile?.display_name ||
                'Your name'}
            </p>

            {profile?.username && (
              <p className="mt-1 text-sm text-neutral-400">
                @{profile.username}
              </p>
            )}

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={
                updateAvatar.isPending
              }
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-2 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera
                size={12}
                strokeWidth={2.2}
              />

              Change photo
            </button>

            <p className="mt-2 text-[10.5px] text-neutral-400">
              PNG, JPG, or WEBP · Max 5MB
            </p>

            {avatarError && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {avatarError}
              </p>
            )}
          </div>
        </div>

        {/* Name */}

        <div className="mt-7">
          <label
            htmlFor="display_name"
            className="block text-[13px] font-semibold text-neutral-900"
          >
            Display name
          </label>

          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
            <input
              id="display_name"
              type="text"
              value={currentName}
              onChange={(e) =>
                handleNameChange(
                  e.target.value,
                )
              }
              placeholder="Your name"
              maxLength={50}
              className="min-h-12 w-full flex-1 rounded-[14px] border border-black/[0.06] bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900/20 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.04]"
            />

            <button
              type="button"
              onClick={handleNameSave}
              disabled={
                updateProfile.isPending ||
                isNameUnchanged
              }
              className="min-h-12 shrink-0 rounded-[14px] bg-neutral-900 px-6 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
            >
              {updateProfile.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />

                  Saving
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>

          {nameSaved && (
            <p className="mt-2.5 text-xs font-medium text-emerald-500">
              Name updated.
            </p>
          )}

          {updateProfile.isError && (
            <p className="mt-2.5 text-xs font-medium text-red-500">
              Failed to update name. Try again.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}