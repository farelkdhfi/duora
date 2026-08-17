import SidebarNav from './sidebar-nav'

export default function SidebarDesktop() {
  return (
    <aside className="modal-scroll sticky overflow-y-auto top-0 hidden h-screen w-65 shrink-0 border-r border-black/[0.05] bg-white/80 backdrop-blur-xl md:block">
      <SidebarNav />
    </aside>
  )
}