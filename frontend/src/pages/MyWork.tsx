import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react'

const stats = [
  {
    label: 'Assigned to me',
    value: '8',
    icon: CheckCircle2,
    color: 'text-pink-300',
    glow: 'bg-pink-500',
  },
  {
    label: 'Due today',
    value: '3',
    icon: Clock3,
    color: 'text-fuchsia-300',
    glow: 'bg-fuchsia-500',
  },
  {
    label: 'High priority',
    value: '2',
    icon: CalendarDays,
    color: 'text-rose-300',
    glow: 'bg-rose-500',
  },
  {
    label: 'Completed',
    value: '14',
    icon: CheckCircle2,
    color: 'text-pink-200',
    glow: 'bg-pink-400',
  },
]

const workItems = [
  {
    id: '#1042',
    title: 'Payment gateway timeout investigation',
    description:
      'Investigate intermittent payment failures reported by the operations team.',
    team: 'Payments',
    status: 'In Progress',
    priority: 'Urgent',
    due: 'Today',
    updated: '12 min ago',
  },
  {
    id: '#1038',
    title: 'Update customer escalation workflow',
    description:
      'Review and update the escalation process for high-impact customer issues.',
    team: 'Support',
    status: 'In Progress',
    priority: 'High',
    due: 'Tomorrow',
    updated: '1 hr ago',
  },
  {
    id: '#1035',
    title: 'Review vendor onboarding request',
    description:
      'Validate the latest vendor documents and complete the onboarding review.',
    team: 'Procurement',
    status: 'Open',
    priority: 'Medium',
    due: 'Oct 6',
    updated: '3 hrs ago',
  },
  {
    id: '#1029',
    title: 'Verify warehouse access permissions',
    description:
      'Confirm access permissions for newly added warehouse operators.',
    team: 'Operations',
    status: 'Open',
    priority: 'Medium',
    due: 'Oct 7',
    updated: 'Yesterday',
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'In Progress':
      'border-pink-300/30 bg-pink-500/[0.07] text-pink-200',
    Open:
      'border-fuchsia-300/25 bg-fuchsia-950/20 text-fuchsia-200',
    Blocked:
      'border-rose-300/30 bg-rose-500/[0.07] text-rose-200',
    Resolved:
      'border-pink-200/25 bg-pink-400/[0.05] text-pink-100',
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
    Urgent: 'text-rose-300',
    High: 'text-pink-300',
    Medium: 'text-fuchsia-300',
    Low: 'text-pink-200/60',
  }

  return (
    <span
      className={`text-xs font-medium ${
        styles[priority] ?? 'text-pink-200/60'
      }`}
    >
      {priority}
    </span>
  )
}

export default function MyWork() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#0b090b]">

      {/* Subtle pink ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-48 -top-56 h-[700px] w-[700px] rounded-full bg-pink-500/[0.08] blur-[140px]" />

        <div className="absolute -right-48 -top-40 h-[650px] w-[650px] rounded-full bg-fuchsia-500/[0.06] blur-[145px]" />

        <div className="absolute bottom-[-300px] left-[20%] h-[700px] w-[700px] rounded-full bg-rose-500/[0.05] blur-[150px]" />

        <div className="absolute bottom-[-250px] right-[-100px] h-[600px] w-[600px] rounded-full bg-pink-400/[0.04] blur-[145px]" />

        <div className="absolute left-[42%] top-[25%] h-[420px] w-[420px] rounded-full bg-fuchsia-600/[0.02] blur-[160px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,9,11,0.08)_45%,rgba(11,9,11,0.35)_100%)]" />

      </div>

      <div className="relative mx-auto w-full max-w-[1500px] p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-pink-300/75">
              Personal workspace
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              My Work
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Work items assigned to you and the things that need your attention.
            </p>
          </div>

          <Link
            to="/work-items/new"
            className="group inline-flex w-fit items-center gap-2 rounded-lg border-2 border-pink-200/25 bg-pink-100 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_10px_35px_rgba(236,72,153,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-100 hover:bg-pink-200 hover:shadow-[0_10px_35px_rgba(236,72,153,0.12)]"
          >
            <Plus className="h-4 w-4" />

            New work item

            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>

        </div>

        {/* Search */}
        <div className="group mb-8 flex items-center gap-3 rounded-xl border-2 border-white/30 bg-pink-950/15 px-4 py-3 backdrop-blur-xl transition-all duration-200 focus-within:border-pink-300/50 focus-within:bg-pink-950/25 focus-within:shadow-[0_0_35px_rgba(236,72,153,0.06)]">

          <Search className="h-4 w-4 text-zinc-500 transition group-focus-within:text-pink-300" />

          <input
            type="text"
            placeholder="Search my work..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />

          <kbd className="hidden rounded-md border-2 border-white/20 bg-pink-950/15 px-2 py-1 text-[11px] text-zinc-500 sm:block">
            ⌘ K
          </kbd>

        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border-2 border-white/30 bg-pink-950/15 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-300/40 hover:bg-pink-950/30 hover:shadow-[0_15px_45px_rgba(236,72,153,0.06)]"
              >

                <div
                  className={`absolute -right-14 -top-14 h-36 w-36 rounded-full blur-[60px] opacity-10 ${stat.glow}`}
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

                  <div className="rounded-lg border-2 border-white/20 bg-pink-950/20 p-2.5 transition-all duration-300 group-hover:border-pink-300/40 group-hover:bg-pink-950/35">
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>

                </div>

              </div>
            )
          })}

        </div>

        {/* Main work section */}
        <section className="mt-8 overflow-hidden rounded-2xl border-2 border-white/35 bg-pink-950/15 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">

          {/* Section header */}
          <div className="flex flex-col gap-4 border-b-2 border-white/20 bg-pink-900/10 px-5 py-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-sm font-semibold text-white">
                Assigned to me
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Your active work items, sorted by urgency.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button
                className="rounded-lg border-2 border-pink-300/35 bg-pink-950/30 px-3 py-2 text-xs font-medium text-pink-200 transition-all hover:border-pink-300/50 hover:bg-pink-950/40 hover:text-white"
              >
                All
              </button>

              <button
                className="rounded-lg border-2 border-transparent px-3 py-2 text-xs font-medium text-zinc-500 transition-all hover:border-pink-300/20 hover:bg-pink-950/30 hover:text-pink-200"
              >
                Due today
              </button>

              <button
                className="rounded-lg border-2 border-transparent px-3 py-2 text-xs font-medium text-zinc-500 transition-all hover:border-pink-300/20 hover:bg-pink-950/30 hover:text-pink-200"
              >
                High priority
              </button>

            </div>

          </div>

          {/* Work items */}
          <div className="divide-y-2 divide-white/[0.10]">

            {workItems.map((item) => (
              <Link
                key={item.id}
                to={`/work-items/${item.id.replace('#', '')}`}
                className="group block px-5 py-5 transition-all duration-200 hover:bg-pink-950/30"
              >

                <div className="flex items-start gap-4">

                  {/* ID */}
                  <div className="hidden w-12 shrink-0 pt-1 text-xs font-medium text-zinc-600 transition group-hover:text-pink-400 sm:block">
                    {item.id}
                  </div>

                  {/* Main content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="truncate text-sm font-semibold text-zinc-200 transition group-hover:text-white">
                        {item.title}
                      </h3>

                      <StatusBadge status={item.status} />

                    </div>

                    <p className="mt-2 max-w-3xl text-xs leading-5 text-zinc-500 transition group-hover:text-zinc-400">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">

                      <span>{item.team}</span>

                      <span>•</span>

                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Due {item.due}
                      </span>

                      <span>•</span>

                      <span>
                        Updated {item.updated}
                      </span>

                    </div>

                  </div>

                  {/* Priority */}
                  <div className="hidden min-w-16 pt-1 lg:block">
                    <PriorityBadge priority={item.priority} />
                  </div>

                  {/* More */}
                  <button
                    type="button"
                    aria-label={`More options for ${item.title}`}
                    onClick={(event) => event.preventDefault()}
                    className="rounded-md border border-transparent p-1.5 text-zinc-700 opacity-0 transition-all duration-200 hover:border-pink-300/25 hover:bg-pink-950/40 hover:text-pink-200 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                </div>

              </Link>
            ))}

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t-2 border-white/20 bg-pink-900/[0.06] px-5 py-4">

            <p className="text-xs text-zinc-600">
              Showing 4 of 8 assigned work items
            </p>

            <Link
              to="/work-items"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-pink-300"
            >
              View all work

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

          </div>

        </section>

      </div>
    </div>
  )
}