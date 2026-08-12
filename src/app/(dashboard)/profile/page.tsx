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

          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50">
            <UserRound
              size={15}
              strokeWidth={2}
              className="text-blue-500"
            />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
            Account
          </p>

        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-800 sm:text-4xl">
          Profile
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
          Update your name and photo.
        </p>

      </div>


      {/* =================================================== */}
      {/* FORM */}
      {/* =================================================== */}

      <div className="mt-8 max-w-2xl">
        <ProfileForm />
      </div>

    </div>
  )
}