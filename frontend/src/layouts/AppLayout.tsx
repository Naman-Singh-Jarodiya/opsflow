import { NavLink, Outlet } from 'react-router-dom'
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'My Work', path: '/my-work', icon: BriefcaseBusiness },
  { label: 'Work Items', path: '/work-items', icon: Activity },
  { label: 'Teams', path: '/teams', icon: Users },
]

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-800/80 bg-[#0c0c0f] lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-zinc-800/80 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
                O
              </div>

              <div>
                <p className="text-sm font-semibold tracking-tight">
                  OpsFlow
                </p>
                <p className="text-[11px] text-zinc-500">
                  Operations Platform
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            <p className="mb-3 px-3 pt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Workspace
            </p>

            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}

            <div className="my-5 border-t border-zinc-800/70" />

            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              System
            </p>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`
              }
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          </nav>

          <div className="border-t border-zinc-800/80 p-3">
            <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-zinc-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold">
                NP
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  Nitika Pandey
                </p>
                <p className="truncate text-xs text-zinc-500">
                  Operations Manager
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/80 px-6">
            <p className="text-sm text-zinc-400">
              Operations Workspace
            </p>

            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white" />
            </button>
          </header>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
