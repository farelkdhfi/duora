'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Camera,
  CircleUserRound,
  Loader2,
  UserRound,
} from 'lucide-react'

import {
  useGetMyProfile,
  useUpdateMyAvatar,
  useUpdateMyProfile,
} from '@/features/profiles/queries'

const MAX_FILE_SIZE_MB = 5

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
]

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

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-[13px] text-neutral-400">
        <span className="size-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800" />

        Loading your profile...
      </div>
    </div>
  )
}

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

  /*
   * Only render profile-dependent UI after
   * the client has mounted.
   *
   * This prevents hydration mismatch when
   * profile data is resolved on the client.
   */
  useEffect(() => {
    setMounted(true)
  }, [])

  /*
   * Sync the local input with profile data.
   *
   * Important:
   * - only sync when user hasn't started editing
   * - prevents overwriting what the user is typing
   */
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

    /*
     * Reset input value so the same
     * file can be selected again.
     */
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

  /*
   * Don't render dynamic profile data
   * before hydration is complete.
   */
  if (!mounted || isLoading) {
    return <LoadingState />
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_50px_-24px_rgba(0,0,0,0.16)]">
      {/* ================================================= */}
      {/* AMBIENT */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-pink-100/40 blur-3xl" />

      {/* ================================================= */}
      {/* TOP ACCENT */}
      {/* ================================================= */}

      <div className="relative h-[3px] bg-gradient-to-r from-blue-400 via-neutral-900 to-pink-400" />

      <div className="relative p-5 sm:p-8 lg:p-10">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative">
          <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-blue-100/40 blur-3xl" />

          <div className="relative flex items-start gap-3.5 sm:gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:text-[11px]">
                Account
              </p>

              <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[23px]">
                Your partner can see your photos
              </h2>

              <p className="mt-1.5 max-w-md text-[12.5px] leading-relaxed text-neutral-400 sm:text-[13px]">
                Update your name and photo.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <div className="my-7 h-px bg-black/[0.05] sm:my-9" />

        {/* ================================================= */}
        {/* AVATAR */}
        {/* ================================================= */}

        <div className="rounded-[22px] border border-black/[0.04] bg-neutral-50/80 p-5 sm:p-6">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">

            {/* Avatar */}

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={
                updateAvatar.isPending
              }
              className="group relative size-24 shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-neutral-100 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.25)] outline-none ring-1 ring-black/[0.06] transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-neutral-900/20 disabled:cursor-not-allowed"
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
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-700 text-2xl font-semibold text-white">
                  {(
                    profile?.display_name ??
                    profile?.username ??
                    '?'
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {/* Hover overlay */}

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/45">
                {updateAvatar.isPending ? (
                  <Loader2
                    size={20}
                    className="animate-spin text-white"
                  />
                ) : (
                  <Camera
                    size={19}
                    strokeWidth={2.2}
                    className="text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                )}
              </div>
            </button>

            {/* Hidden file input */}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              className="hidden"
              onChange={
                handleAvatarChange
              }
            />

            {/* Avatar info */}

            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                {profile?.display_name ||
                  'Your name'}
              </p>

              {profile?.username && (
                <p className="mt-1 text-[12.5px] text-neutral-400">
                  @{profile.username}
                </p>
              )}

              <button
                type="button"
                onClick={
                  handleAvatarClick
                }
                disabled={
                  updateAvatar.isPending
                }
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-2.5 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera
                  size={12}
                  strokeWidth={2.3}
                />

                Change photo
              </button>

              <p className="mt-2 text-[10.5px] text-neutral-400">
                PNG, JPG, or WEBP · Max 5MB
              </p>

              {avatarError && (
                <p className="mt-2 text-[12px] font-medium text-red-500">
                  {avatarError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <div className="my-7 h-px bg-black/[0.05] sm:my-9" />

        {/* ================================================= */}
        {/* DISPLAY NAME */}
        {/* ================================================= */}

        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <SectionIcon className="bg-pink-50">
              <CircleUserRound
                size={15}
                strokeWidth={2.25}
                className="text-pink-500"
              />
            </SectionIcon>

            <div>
              <label
                htmlFor="display_name"
                className="block text-[13px] font-semibold text-neutral-900"
              >
                Display name
              </label>

              <p className="mt-0.5 text-[11px] text-neutral-400">
                This is how your partner will see you.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
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
              className="min-h-12 w-full flex-1 rounded-[16px] border border-black/[0.06] bg-neutral-50 px-4 py-3 text-[14px] text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900/20 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.04]"
            />

            <button
              type="button"
              onClick={handleNameSave}
              disabled={
                updateProfile.isPending ||
                isNameUnchanged
              }
              className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[16px] bg-neutral-900 px-6 text-[13px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>

          {/* Success */}

          {nameSaved && (
            <div className="mt-3 flex items-center gap-2 text-[12px] font-medium text-emerald-500">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-50">
                ✓
              </span>

              Name updated successfully.
            </div>
          )}

          {/* Error */}

          {updateProfile.isError && (
            <div className="mt-3 rounded-[14px] border border-red-100 bg-red-50/70 px-3.5 py-2.5">
              <p className="text-[12px] font-medium text-red-500">
                Failed to update name. Try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}