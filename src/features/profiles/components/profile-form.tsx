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

import { useTranslations } from 'next-intl'
import { getProfileErrorKey } from '@/features/profiles/errors'

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

type AvatarErrorKey = 'invalidType' | 'tooLarge'

export default function ProfileForm() {
  const t = useTranslations('profile.form')
  const tc = useTranslations('common')
  const te = useTranslations('profile.errors')

  const {
    data: profile,
    isLoading,
  } = useGetMyProfile()

  const updateProfile = useUpdateMyProfile()
  const updateAvatar = useUpdateMyAvatar()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [mounted, setMounted] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [hasEditedName, setHasEditedName] = useState(false)
  const [avatarError, setAvatarError] = useState<AvatarErrorKey | null>(null)
  const [nameSaved, setNameSaved] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!profile || hasEditedName) {
      return
    }

    setDisplayName(profile.display_name ?? '')
  }, [profile, hasEditedName])

  const currentName = hasEditedName
    ? displayName
    : (profile?.display_name ?? '')

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
    const file = e.target.files?.[0]

    e.target.value = ''

    if (!file) {
      return
    }

    setAvatarError(null)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setAvatarError('invalidType')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setAvatarError('tooLarge')
      return
    }

    updateAvatar.mutate(file)
  }

  const isNameUnchanged =
    !hasEditedName ||
    !currentName.trim() ||
    currentName.trim() === profile?.display_name

  if (!mounted || isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div>
      <div className="flex flex-col items-center rounded-[1.5rem] bg-subprimary/40 p-6 text-center sm:p-8">
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={updateAvatar.isPending}
          className="group relative size-35 shrink-0 overflow-hidden rounded-full bg-subprimary outline-none ring-1 ring-white/[0.08] transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? t('avatarAlt')}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-subprimary text-2xl font-semibold text-secondary">
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
                size={20}
                className="animate-spin text-secondary"
              />
            ) : (
              <Camera
                size={18}
                strokeWidth={2}
                className="text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
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

        <div className="mt-4 flex flex-col items-center">
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-secondary">
            {profile?.display_name || t('yourName')}
          </p>

          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={updateAvatar.isPending}
            className="mt-4 h-11 inline-flex items-center justify-center gap-1.5 rounded-full bg-subprimary px-6 text-sm font-semibold text-secondary transition-all duration-200 hover:bg-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateAvatar.isPending ? (
              <>
                <Loader2
                  size={12}
                  className="animate-spin"
                />
                {t('uploading')}
              </>
            ) : (
              <>
                <Camera
                  size={12}
                  strokeWidth={2.2}
                />
                {t('changePhoto')}
              </>
            )}
          </button>

          <p className="mt-2 text-[10.5px] text-description">
            {t('photoHint', { max: MAX_FILE_SIZE_MB })}
          </p>

          {avatarError && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {t(`avatarErrors.${avatarError}`, {
                max: MAX_FILE_SIZE_MB,
              })}
            </p>
          )}

          {!avatarError && updateAvatar.isError && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {te(getProfileErrorKey(updateAvatar.error))}
            </p>
          )}
        </div>
      </div>

      <div className="mt-7">
        <label
          htmlFor="display_name"
          className="block text-[13px] font-semibold text-secondary"
        >
          {t('displayName')}
        </label>

        <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
          <input
            id="display_name"
            type="text"
            value={currentName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={t('yourName')}
            maxLength={50}
            className="min-h-12 w-full flex-1 rounded-[14px] border border-white/[0.08] bg-subprimary/40 px-4 py-3 text-sm text-secondary outline-none transition-all duration-200 placeholder:text-description focus:border-white/20 focus:bg-primary focus:ring-4 focus:ring-white/[0.04]"
          />

          <button
            type="button"
            onClick={handleNameSave}
            disabled={
              updateProfile.isPending ||
              isNameUnchanged
            }
            className="h-11 shrink-0 rounded-full bg-subprimary px-6 text-sm font-semibold text-secondary transition-all duration-200 hover:bg-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {updateProfile.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                {t('saving')}
              </span>
            ) : (
              tc('save')
            )}
          </button>
        </div>

        {nameSaved && (
          <p className="mt-2.5 text-xs font-medium text-emerald-500">
            {t('nameSaved')}
          </p>
        )}

        {updateProfile.isError && (
          <p className="mt-2.5 text-xs font-medium text-red-500">
            {te(getProfileErrorKey(updateProfile.error))}
          </p>
        )}
      </div>
    </div>
  )
}