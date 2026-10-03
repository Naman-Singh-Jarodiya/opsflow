import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from 'lucide-react'

const stats = [
  {
    label: 'Open work',
    value: '24',
    change: '+4 this week',
    icon: AlertCircle,
    glow: 'bg-blue-500',
    iconColor: 'text-blue-300',
  },
  {
    label: 'In progress',
    value: '12',
    change: '5 due today',
    icon: Clock3,
    glow: 'bg-cyan-500',
    iconColor: 'text-cyan-300',
  },
  {
    label: 'High priority',
    value: '7',
    change: '3 need attention',
    icon: ArrowUpRight,
    glow: 'bg-violet-500',
    iconColor: 'text-violet-300',
  },
  {
    label: 'Resolved today',
    value: '18',
    change: '+12% from yesterday',
    icon: CheckCircle2,
    glow: 'bg-emerald-500',
    iconColor: 'text-emerald-300',
  },
]

const workItems = [
  {
    id: '#1042',
    title: 'Payment gateway timeout investigation',
    team: 'Payments',
    status: 'In Progress',
    priority: 'Urgent',
    owner: 'RK',
    due: 'Today',
  },
  {
    id: '#1041',
    title: 'Warehouse inventory sync failing',
    team: 'Operations',
    status: 'Blocked',
    priority: 'High',
    owner: 'AS',
    due: 'Today',
  },
  {
    id: '#1038',
    title: 'Update customer escalation workflow',
    team: 'Support',
    status: 'Open',
    priority: 'High',
    owner: 'MP',
    due: 'Tomorrow',
  },
  {
    id: '#1035',
    title: 'Review vendor onboarding request',
    team: 'Procurement',
    status: 'Open',
    priority: 'Medium',
    owner: 'NV',
    due: 'Oct 6',
  },
]

const activities = [
  {
    text: 'Rahul moved Payment gateway timeout investigation to In Progress',
    time: '12 min ago',
    initials: 'RK',
  },
  {
    text: 'Ananya assigned Warehouse inventory sync to herself',
    time: '28 min ago',
    initials: 'AS',
  },
  {
    text: 'Manisha changed escalation workflow priority to High',
    time: '1 hr ago',
    initials: 'MP',
  },
  {
    text: 'Nikhil resolved Vendor access request',
    time: '2 hrs ago',
    initials: 'NV',
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'In Progress':
      'border-blue-300/45 bg-blue-500/15 text-blue-200',

    Blocked:
      'border-red-300/45 bg-red-500/10 text-red-200',

    Open:
      'border-slate-300/35 bg-slate-800/70 text-slate-200',
  }

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium ${
        styles[status] ?? styles.Open
      }`}
    >
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Urgent: 'text-red-300',
    High: 'text-violet-300',
    Medium: 'text-blue-300',
    Low: 'text-slate-400',
  }

  return (
    <span
      className={`text-xs font-medium ${
        styles[priority] ?? 'text-slate-400'
      }`}
    >
      {priority}
    </span>
  )
}

export default function Dashboard() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#070810]">

      {/* =========================================================
          VIBRANT AMBIENT BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-48 -top-56 h-[720px] w-[720px] rounded-full bg-indigo-500/[0.34] blur-[130px]" />

        <div className="absolute -right-48 -top-40 h-[680px] w-[680px] rounded-full bg-blue-500/[0.30] blur-[135px]" />

        <div className="absolute bottom-[-300px] left-[18%] h-[720px] w-[720px] rounded-full bg-violet-500/[0.25] blur-[145px]" />

        <div className="absolute bottom-[-250px] right-[-120px] h-[620px] w-[620px] rounded-full bg-cyan-400/[0.18] blur-[135px]" />

        <div className="absolute left-[42%] top-[25%] h-[420px] w-[420px] rounded-full bg-blue-600/[0.08] blur-[150px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,8,16,0.06)_45%,rgba(7,8,16,0.42)_100%)]" />

      </div>

      <div className="relative mx-auto w-full max-w-[1500px] p-6 lg:p-8">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/90">
              Saturday, October 3, 2026
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Good morning, Nitika
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Here&apos;s what needs your attention today.
            </p>
          </div>

          <Link
            to="/work-items/new"
            className="group inline-flex w-fit items-center gap-2 rounded-lg border-2 border-white/25 bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />

            New work item

            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>

        </div>

        {/* =========================================================
            SEARCH
        ========================================================= */}
        <div className="group mb-8 flex items-center gap-3 rounded-xl border-2 border-white/30 bg-[#0a0c14]/60 px-4 py-3 backdrop-blur-xl transition-all duration-200 focus-within:border-indigo-300/70 focus-within:bg-indigo-500/[0.05] focus-within:shadow-[0_0_40px_rgba(99,102,241,0.18)]">

          <Search className="h-4 w-4 text-zinc-500 transition group-focus-within:text-indigo-300" />

          <input
            type="text"
            placeholder="Search work items, teams, or people..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />

          <kbd className="hidden rounded-md border-2 border-white/20 bg-white/[0.05] px-2 py-1 text-[11px] text-zinc-500 sm:block">
            ⌘ K
          </kbd>

        </div>

        {/* =========================================================
            STAT CARDS
        ========================================================= */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border-2 border-white/30 bg-[#090b12]/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/60 hover:bg-indigo-500/[0.045] hover:shadow-[0_15px_50px_rgba(30,64,175,0.16)]"
              >

                <div
                  className={`absolute -right-14 -top-14 h-36 w-36 rounded-full blur-[55px] opacity-40 ${stat.glow}`}
                />

                <div
                  className={`absolute -bottom-14 -left-10 h-28 w-28 rounded-full blur-[55px] opacity-15 ${stat.glow}`}
                />

                <div className="relative flex items-start justify-between">

                  <div>
                    <p className="text-sm text-zinc-400">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-lg border-2 border-white/20 bg-white/[0.05] p-2.5 transition-all duration-300 group-hover:border-indigo-300/50 group-hover:bg-indigo-500/10">
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>

                </div>

                <p className="relative mt-4 text-xs text-zinc-500">
                  {stat.change}
                </p>

              </div>
            )
          })}

        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          {/* =====================================================
              WORK NEEDING ATTENTION
          ===================================================== */}
          <section className="overflow-hidden rounded-2xl border-2 border-white/35 bg-[#080a11]/60 shadow-2xl shadow-indigo-950/25 backdrop-blur-xl">

            <div className="flex items-center justify-between border-b-2 border-white/20 bg-white/[0.025] px-5 py-4">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Work needing attention
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Items that may require action from your team.
                </p>
              </div>

              <Link
                to="/work-items"
                className="rounded-md border border-transparent px-2 py-1 text-xs font-medium text-zinc-500 transition hover:border-indigo-300/40 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                View all
              </Link>

            </div>

            <div className="divide-y-2 divide-white/[0.10]">

              {workItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/work-items/${item.id.replace('#', '')}`}
                  className="group flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-indigo-500/[0.055]"
                >

                  <div className="hidden w-12 shrink-0 text-xs font-medium text-zinc-600 transition group-hover:text-indigo-400 sm:block">
                    {item.id}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium text-zinc-200 transition group-hover:text-white">
                      {item.title}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-600">
                      <span>{item.team}</span>
                      <span>•</span>
                      <span>Due {item.due}</span>
                    </div>

                  </div>

                  <div className="hidden min-w-24 md:block">
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="hidden min-w-16 lg:block">
                    <PriorityBadge priority={item.priority} />
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-white/[0.05] text-[10px] font-semibold text-zinc-300 transition-all duration-200 group-hover:border-indigo-300/60 group-hover:bg-indigo-500/10 group-hover:text-indigo-300">
                    {item.owner}
                  </div>

                  <button
                    type="button"
                    aria-label={`More options for ${item.title}`}
                    onClick={(event) => event.preventDefault()}
                    className="rounded-md border border-transparent p-1.5 text-zinc-700 opacity-0 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                </Link>
              ))}

            </div>

          </section>

          {/* =====================================================
              RECENT ACTIVITY
          ===================================================== */}
          <section className="overflow-hidden rounded-2xl border-2 border-white/35 bg-[#080a11]/60 shadow-2xl shadow-blue-950/25 backdrop-blur-xl">

            <div className="flex items-center justify-between border-b-2 border-white/20 bg-white/[0.025] px-5 py-4">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Recent activity
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Latest changes across your workspace.
                </p>
              </div>

              <div className="rounded-lg border-2 border-white/20 bg-indigo-500/10 p-2">
                <Users className="h-4 w-4 text-indigo-300" />
              </div>

            </div>

            <div className="divide-y-2 divide-white/[0.10]">

              {activities.map((activity) => (
                <div
                  key={activity.text}
                  className="group flex gap-3 px-5 py-4 transition-all duration-200 hover:bg-blue-500/[0.055]"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-white/[0.05] text-[10px] font-semibold text-zinc-400 transition-all duration-200 group-hover:border-blue-300/60 group-hover:bg-blue-500/10 group-hover:text-blue-300">
                    {activity.initials}
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs leading-5 text-zinc-400 transition group-hover:text-zinc-300">
                      {activity.text}
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-600">
                      {activity.time}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </section>

        </div>

      </div>
    </div>
  )
}