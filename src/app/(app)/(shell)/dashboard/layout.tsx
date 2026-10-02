export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="p-0 md:p-6">{children}</div>
}