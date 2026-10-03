import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  Users,
  X,
} from 'lucide-react'
import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '../context/AuthContext'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'My Work',
    href: '/my-work',
    icon: ListTodo,
  },
  {
    name: 'Work Items',
    href: '/work-items',
    icon: ListTodo,
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Users,
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function getRoleLabel(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] =
    useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const displayName =
    user?.name ?? 'OpsFlow User'

  const initials =
    getInitials(displayName) || 'OF'

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r-2 border-white/10 bg-[#0d0d10]">
        <div className="flex h-[76px] items-center border-b-2 border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black shadow-[0_0_30px_rgba(255,255,255,0.12)]">
              O
            </div>

            <div>
              <div className="text-[15px] font-bold tracking-tight">
                OpsFlow
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                Operations
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Workspace
          </div>

          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'border border-white/10 bg-white/[0.08] text-white'
                      : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200',
                  ].join(' ')
                }
              >
                <Icon className="h-[17px] w-[17px]" />
                <span>{item.name}</span>
              </NavLink>
            )
          })}

          <div className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Manage
          </div>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'border border-white/10 bg-white/[0.08] text-white'
                  : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200',
              ].join(' ')
            }
          >
            <Settings className="h-[17px] w-[17px]" />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="border-t-2 border-white/10 p-3">
          <div className="relative">
            {profileOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 overflow-hidden rounded-2xl border-2 border-white/10 bg-[#151519] shadow-2xl">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setProfileOpen((open) => !open)
              }
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.05]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">
                  {displayName}
                </p>

                <p className="truncate text-xs text-zinc-500">
                  {user
                    ? getRoleLabel(user.role)
                    : 'User'}
                </p>
              </div>

              <ChevronDown
                className={[
                  'h-4 w-4 shrink-0 text-zinc-600 transition',
                  profileOpen
                    ? 'rotate-180'
                    : '',
                ].join(' ')}
              />
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-[250px] min-h-screen min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-end border-b-2 border-white/10 bg-[#09090b]/90 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-[17px] w-[17px]" />

              <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </button>

            <div className="h-7 w-px bg-white/10" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold">
                {initials}
              </div>

              <div className="hidden xl:block">
                <p className="max-w-[160px] truncate text-xs font-semibold text-zinc-200">
                  {displayName}
                </p>

                <p className="text-[10px] text-zinc-600">
                  {user
                    ? getRoleLabel(user.role)
                    : 'User'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-76px)]">
          <Outlet />
        </div>
      </main>

      {profileOpen && (
        <button
          type="button"
          aria-label="Close profile menu"
          onClick={() => setProfileOpen(false)}
          className="fixed inset-0 z-30 cursor-default"
        >
          <X className="hidden" />
        </button>
      )}
    </div>
  )
}

export default AppLayout