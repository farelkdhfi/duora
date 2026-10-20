import {
  CalendarDays,
  ChartBarDecreasing,
  Clock,
  File,
  Goal,
  Home,
  Logs,
  NotebookPen,
  Palette,
  Smile,
  User2,
  type LucideIcon,
} from 'lucide-react'

export type NavItemKey =
  | 'overview'
  | 'debates'
  | 'goals'
  | 'planner'
  | 'checkin'
  | 'notes'
  | 'wrapped'
  | 'countdown'
  | 'profile'
  | 'activities'
  | 'qna'
  | 'draw&guess'

export const sidebarNavigation: {
  key: NavItemKey
  href: string
  icon: LucideIcon
}[] = [
  { key: 'overview', href: '/dashboard', icon: Home },
  { key: 'debates', href: '/debates', icon: ChartBarDecreasing },
  { key: 'goals', href: '/goals', icon: Goal },
  { key: 'planner', href: '/planner', icon: CalendarDays },
  { key: 'checkin', href: '/check-in', icon: Smile },
  { key: 'notes', href: '/notes', icon: NotebookPen },
  { key: 'wrapped', href: '/wrapped', icon: File },
  { key: 'countdown', href: '/countdown', icon: Clock },
  { key: 'draw&guess', href: '/draw-guess', icon: Palette },
  { key: 'profile', href: '/profile', icon: User2 },
  { key: 'activities', href: '/activities', icon: Logs },
]

export const moreNavigation: {
  key: NavItemKey
  href: string
}[] = [
  { key: 'notes', href: '/notes' },
  { key: 'checkin', href: '/check-in' },
  { key: 'debates', href: '/debates' },
  { key: 'qna', href: '/qna' },
  { key: 'draw&guess', href: '/draw-guess' },
  { key: 'countdown', href: '/countdown' },
  { key: 'wrapped', href: '/wrapped' },
  { key: 'activities', href: '/activities' },
  { key: 'profile', href: '/profile' },
]