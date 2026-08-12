'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'

import {
  useGetMyProfile,
  useUpdateMyAvatar,
  useUpdateMyProfile,
} from '@/features/profiles/queries'

const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export default function ProfileForm() {
  const { data: profile, isLoading } = useGetMyProfile()
  const updateProfile = useUpdateMyProfile()
  const updateAvatar = useUpdateMyAvatar()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState('')
  const [hasEditedName, setHasEditedName] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [nameSaved, setNameSaved] = useState(false)

  const currentName = hasEditedName ? displayName : (profile?.display_name ?? '')

  const handleNameChange = (value: string) => {
    setHasEditedName(true)
    setDisplayName(value)
    setNameSaved(false)
  }

  const handleNameSave = () => {
    const trimmed = currentName.trim()

    if (!trimmed || trimmed === profile?.display_name) {
      return
    }

    updateProfile.mutate(
      { display_name: trimmed },
      {
        onSuccess: () => {
          setNameSaved(true)
          setHasEditedName(false)
        },
      },
    )
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''

    if (!file) return

    setAvatarError(null)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setAvatarError('Use PNG, JPG, or WEBP.')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setAvatarError(`Max file size is ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    updateAvatar.mutate(file, {
      onError: () => {
        setAvatarError('Failed to upload photo. Try again.')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-8 text-sm text-neutral-400">
        <span className="size-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-400" />
        Loading...
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-8">

      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-blue-100/60 blur-2xl" />

      <div className="relative w-full max-w-md space-y-8">

        {/* Avatar */}

        <div className="flex flex-col items-center gap-3">

          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={updateAvatar.isPending}
            className="group relative size-24 shrink-0 overflow-hidden rounded-full border border-black/[0.06] bg-gradient-to-br from-blue-50 to-pink-50 disabled:cursor-not-allowed"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name ?? 'Avatar'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-blue-500">
                {(profile?.display_name ?? profile?.username ?? '?')
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
              {updateAvatar.isPending ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <Camera
                  size={18}
                  className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                />
              )}
            </div>

          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={handleAvatarChange}
          />

          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={updateAvatar.isPending}
            className="text-sm font-medium text-blue-500 disabled:opacity-50"
          >
            Change photo
          </button>

          {avatarError && (
            <p className="text-xs text-rose-500">{avatarError}</p>
          )}

        </div>

        {/* Display name */}

        <div className="space-y-2">

          <label
            htmlFor="display_name"
            className="text-sm font-medium text-neutral-700"
          >
            Display name
          </label>

          <div className="flex gap-2">

            <input
              id="display_name"
              type="text"
              value={currentName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="flex-1 rounded-2xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-blue-400"
            />

            <button
              type="button"
              onClick={handleNameSave}
              disabled={
                updateProfile.isPending ||
                !hasEditedName ||
                !currentName.trim() ||
                currentName.trim() === profile?.display_name
              }
              className="shrink-0 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {updateProfile.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Save'
              )}
            </button>

          </div>

          {nameSaved && (
            <p className="text-xs text-emerald-500">Name updated.</p>
          )}

          {updateProfile.isError && (
            <p className="text-xs text-rose-500">
              Failed to update name. Try again.
            </p>
          )}

        </div>

        {profile?.username && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-700">Username</p>
            <p className="text-sm text-neutral-400">@{profile.username}</p>
          </div>
        )}

      </div>

    </div>
  )
}