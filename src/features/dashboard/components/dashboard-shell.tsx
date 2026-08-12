import Sidebar from './sidebar'

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111]">

      <div className="flex min-h-screen">

        {/* Sidebar */}

        <Sidebar />

        {/* Main content */}

        <main className="min-w-0 flex-1 bg-neutral-50 p-6">
          {children}
        </main>

      </div>

    </div>
  )
}