'use client'

import { UserRound } from 'lucide-react'

import ProfileForm from '@/features/profiles/components/profile-form'
import RelationshipForm from '@/features/relationship/components/relationship-form'
import Header from '@/components/layout/header'

export default function ProfilePage() {
  return (
    <div>
      <Header
        title='Profile'
        description='Update your name and photos'
      />

      <div className="mt-6 max-w-2xl space-y-6 sm:mt-8">
        <ProfileForm />
        <RelationshipForm />
      </div>
    </div>
  )
}