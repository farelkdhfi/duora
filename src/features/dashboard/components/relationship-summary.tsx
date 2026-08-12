import { Heart } from 'lucide-react'

interface RelationshipSummaryProps {
  userName: string
  partnerName: string
  daysTogether: number
}

export default function RelationshipSummary({
  userName,
  partnerName,
  daysTogether,
}: RelationshipSummaryProps) {
  return (
    <div className="rounded-3xl border bg-background p-6">
      <div className="flex items-center justify-center gap-5">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>

          <p className="mt-2 text-sm font-medium">
            {userName}
          </p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
          <Heart
            size={16}
            fill="currentColor"
          />
        </div>

        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {partnerName.charAt(0).toUpperCase()}
          </div>

          <p className="mt-2 text-sm font-medium">
            {partnerName}
          </p>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Together for{' '}
        <span className="font-medium text-foreground">
          {daysTogether} days
        </span>{' '}
        ❤️
      </p>
    </div>
  )
}