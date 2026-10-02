import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { ExpiryWarningModal } from '@/features/subscription/components/expiry-warning-modal'
import { ScreenTimeTracker } from '@/features/screen-time/components/screen-time-tracker'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      {children}
      <ExpiryWarningModal />
      <ScreenTimeTracker />
    </>
  )
}