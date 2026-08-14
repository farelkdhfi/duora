'use client'

import { UserRound } from 'lucide-react'

import ProfileForm from '@/features/profiles/components/profile-form'

export default function ProfilePage() {
  return (
    <div>

      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <div>

        <div className="flex items-center gap-2">

          <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-8">
            <UserRound
              size={13}
              strokeWidth={2}
              className="text-black sm:hidden"
            />
            <UserRound
              size={15}
              strokeWidth={2}
              className="hidden text-black sm:block"
            />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
            Account
          </p>

        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-800 sm:mt-4 sm:text-3xl lg:text-4xl">
          Profile
        </h1>

        <p className="mt-2 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
          Update your name and photo.
        </p>

      </div>


      {/* =================================================== */}
      {/* FORM */}
      {/* =================================================== */}

      <div className="mt-6 max-w-2xl sm:mt-8">
        <ProfileForm />
      </div>

    </div>
  )
}