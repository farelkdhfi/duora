// app/goals/[id]/page.tsx — TANPA 'use client', boleh async
import GoalDetail from '@/features/goals/components/goal-detail'


interface GoalDetailPageProps {
  params: Promise<{
    id: string
  }>
}


export default async function GoalDetailPage({
  params,
}: GoalDetailPageProps) {

  const { id } = await params

  return (
    <GoalDetail
      goalId={id}
    />
  )
}