export default function Loading() {
  return (
    <div className="fixed inset-0 z-55 md:left-64">
      <div className="flex h-dvh w-full items-center justify-center bg-neutral-50/95">
        <div className="h-5 w-5 animate-spin rounded-full border border-neutral-200 border-t-neutral-700" />
      </div>
    </div>
  )
}