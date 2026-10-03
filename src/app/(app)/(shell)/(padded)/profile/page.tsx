'use client'

import Header from '@/components/layout/header'
import ProfileForm from '@/features/profiles/components/profile-form'
import RelationshipForm from '@/features/relationship/components/relationship-form'

export default function ProfilePage() {
  return (
    <div>
      <Header
        title="Profile"
        description="Manage your profile and relationship"
      />

      <div className="mt-6 max-w-2xl sm:mt-8">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)]">
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-blue-100/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-pink-100/25 blur-3xl" />

          <div className="relative p-6 sm:p-7 lg:p-8">
            <ProfileForm />

            <div className="my-8 h-px bg-black/[0.06] sm:my-9" />

            <RelationshipForm />
          </div>
        </section>
      </div>
    </div>
  )
}