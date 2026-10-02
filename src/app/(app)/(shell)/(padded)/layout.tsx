export default function PaddedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="p-4 sm:p-5 md:p-6">{children}</div>
}