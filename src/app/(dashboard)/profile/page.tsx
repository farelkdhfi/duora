'use client'

import { UserRound } from 'lucide-react'

import ProfileForm from '@/features/profiles/components/profile-form'
import Header from '@/components/layout/header'

export default function ProfilePage() {
  return (
    <div>

      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <Header
        title='Profile'
        description='Update your name and photos'
        icon={UserRound}
      />


      {/* =================================================== */}
      {/* FORM */}
      {/* =================================================== */}

      <div className="mt-6 max-w-2xl sm:mt-8">
        <ProfileForm />
      </div>

    </div>
  )
}