import { Link } from 'react-router-dom'
import {
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

const items = [
  {
    id: '#1042',
    title: 'Payment gateway timeout investigation',
    description: 'Investigate recurring payment timeout errors.',
    team: 'Payments',
    status: 'In Progress',
    priority: 'Urgent',
    owner: 'RK',
    due: 'Today',
  },
  {
    id: '#1041',
    title: 'Warehouse inventory sync failing',
    description: 'Inventory records are not syncing correctly.',
    team: 'Operations',
    status: 'Blocked',
    priority: 'High',
    owner: 'AS',
    due: 'Today',
  },
  {
    id: '#1038',
    title: 'Update customer escalation workflow',
    description: 'Review and update the escalation process.',
    team: 'Support',
    status: 'Open',
    priority: 'High',
    owner: 'MP',
    due: 'Tomorrow',
  },
  {
    id: '#1035',
    title: 'Review vendor onboarding request',
    description: 'Complete review of the pending vendor request.',
    team: 'Procurement',
    status: 'Open',
    priority: 'Medium',
    owner: 'NV',
    due: 'Oct 6',
  },
  {
    id: '#1031',
    title: 'Customer account access issue',
    description: 'Restore access for affected customer accounts.',
    team: 'Support',
    status: 'In Progress',
    priority: 'High',
    owner: 'RK',
    due: 'Oct 5',
  },
  {
    id: '#1028',
    title: 'Update warehouse operating checklist',
    description: 'Add new checks to the daily operations checklist.',
    team: 'Operations',
    status: 'Resolved',
    priority: 'Medium',
    owner: 'AS',
    due: 'Oct 7',
  },
]

const filters = ['Status', 'Priority', 'Team', 'Assignee']

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'In Progress':
      'border-blue-300/50 bg-blue-500/15 text-blue-200',
    Blocked:
      'border-red-300/45 bg-red-500/10 text-red-200',
    Open:
      'border-slate-300/35 bg-slate-800/80 text-slate-200',
    Resolved:
      'border-emerald-300/45 bg-emerald-500/10 text-emerald-200',
  }

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? styles.Open
      }`}
    >
      {status}
    </span>
  )
}

function Priority({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Urgent: 'text-red-300',
    High: 'text-violet-300',
    Medium: 'text-sky-300',
  }

  return (
    <span
      className={`text-xs font-medium ${
        styles[priority] ?? 'text-zinc-400'
      }`}
    >
      {priority}
    </span>
  )
}

export default function WorkItems() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#071018]">
      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-sky-500/[0.20] blur-[130px]" />

        <div className="absolute -right-48 -top-32 h-[650px] w-[650px] rounded-full bg-cyan-400/[0.18] blur-[140px]" />

        <div className="absolute bottom-[-300px] left-[25%] h-[700px] w-[700px] rounded-full bg-blue-500/[0.16] blur-[150px]" />

        <div className="absolute bottom-[-250px] right-[-100px] h-[600px] w-[600px] rounded-full bg-sky-400/[0.14] blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,16,24,0.15)_50%,rgba(7,16,24,0.55)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] p-6 lg:p-8">

        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-300/80">
              Workspace
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
              Work Items
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Manage and track operational work across your teams.
            </p>
          </div>

          <button
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/25 bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-[0_10px_35px_rgba(14,165,233,0.15)] transition hover:-translate-y-0.5 hover:bg-sky-50"
          >
            <Plus className="h-4 w-4" />
            New work item
          </button>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">

          <div className="rounded-xl border-2 border-white/30 bg-[#08121b]/70 p-4 shadow-[0_0_30px_rgba(56,189,248,0.06)] backdrop-blur-xl transition hover:border-sky-300/55">
            <p className="text-xs text-zinc-400">All work</p>
            <p className="mt-2 text-xl font-semibold text-white">24</p>
          </div>

          <div className="rounded-xl border-2 border-white/30 bg-[#08121b]/70 p-4 shadow-[0_0_30px_rgba(56,189,248,0.06)] backdrop-blur-xl transition hover:border-sky-300/55">
            <p className="text-xs text-zinc-400">Open</p>
            <p className="mt-2 text-xl font-semibold text-white">8</p>
          </div>

          <div className="rounded-xl border-2 border-white/30 bg-[#08121b]/70 p-4 shadow-[0_0_30px_rgba(56,189,248,0.06)] backdrop-blur-xl transition hover:border-sky-300/55">
            <p className="text-xs text-zinc-400">In progress</p>
            <p className="mt-2 text-xl font-semibold text-white">7</p>
          </div>

          <div className="rounded-xl border-2 border-white/30 bg-[#08121b]/70 p-4 shadow-[0_0_30px_rgba(56,189,248,0.06)] backdrop-blur-xl transition hover:border-sky-300/55">
            <p className="text-xs text-zinc-400">Blocked</p>
            <p className="mt-2 text-xl font-semibold text-white">3</p>
          </div>

          <div className="rounded-xl border-2 border-white/30 bg-[#08121b]/70 p-4 shadow-[0_0_30px_rgba(56,189,248,0.06)] backdrop-blur-xl transition hover:border-sky-300/55">
            <p className="text-xs text-zinc-400">Resolved</p>
            <p className="mt-2 text-xl font-semibold text-white">6</p>
          </div>

        </div>

        {/* SEARCH + FILTERS */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-xl border-2 border-white/30 bg-[#08121b]/70 px-4 py-2.5 backdrop-blur-xl transition focus-within:border-cyan-300/70 focus-within:shadow-[0_0_35px_rgba(34,211,238,0.12)]">
            <Search className="h-4 w-4 shrink-0 text-sky-300/70" />

            <input
              type="text"
              placeholder="Search work items..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <kbd className="hidden rounded-md border border-white/20 bg-white/[0.06] px-2 py-1 text-[10px] text-zinc-400 sm:block">
              ⌘ K
            </kbd>
          </div>

          <div className="flex gap-2 overflow-x-auto">

            {filters.map((filter) => (
              <button
                key={filter}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border-2 border-white/25 bg-[#08121b]/70 px-3 py-2.5 text-xs font-medium text-zinc-300 backdrop-blur-xl transition hover:border-sky-300/60 hover:bg-sky-500/[0.08] hover:text-white"
              >
                <Filter className="h-3.5 w-3.5 text-sky-300" />
                {filter}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ))}

            <button
              aria-label="More filters"
              className="rounded-xl border-2 border-white/25 bg-[#08121b]/70 p-2.5 text-zinc-300 backdrop-blur-xl transition hover:border-cyan-300/60 hover:bg-cyan-500/[0.08] hover:text-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

          </div>
        </div>

        {/* MAIN WORK ITEMS BOX */}
        <div className="overflow-hidden rounded-2xl border-2 border-white/35 bg-[#07111a]/75 shadow-[0_0_70px_rgba(14,165,233,0.10)] backdrop-blur-xl">

          {/* TABLE HEADER */}
          <div className="hidden grid-cols-[90px_minmax(280px,1fr)_130px_90px_100px_90px_40px] gap-4 border-b-2 border-white/25 bg-white/[0.025] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-sky-200/70 md:grid">
            <span>ID</span>
            <span>Work item</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Team</span>
            <span>Owner</span>
            <span />
          </div>

          {/* WORK ITEMS */}
          <div className="divide-y-2 divide-white/[0.12]">

            {items.map((item) => (
              <Link
                key={item.id}
                to={`/work-items/${item.id.replace('#', '')}`}
                className="group grid gap-3 px-5 py-4 transition-all duration-200 hover:bg-sky-400/[0.055] md:grid-cols-[90px_minmax(280px,1fr)_130px_90px_100px_90px_40px] md:items-center md:gap-4"
              >

                <span className="text-xs font-medium text-zinc-500 transition group-hover:text-sky-300">
                  {item.id}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-200 transition group-hover:text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {item.description}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 md:hidden">
                    {item.team} · Due {item.due}
                  </p>
                </div>

                <div>
                  <StatusBadge status={item.status} />
                </div>

                <Priority priority={item.priority} />

                <span className="hidden text-xs text-zinc-400 md:block">
                  {item.team}
                </span>

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/25 bg-white/[0.07] text-[9px] font-semibold text-zinc-200 transition group-hover:border-sky-300/60 group-hover:bg-sky-500/10 group-hover:text-sky-200">
                    {item.owner}
                  </div>

                  <span className="hidden text-xs text-zinc-400 xl:block">
                    {item.owner}
                  </span>

                </div>

                <button
                  type="button"
                  aria-label={`More options for ${item.title}`}
                  onClick={(event) => event.preventDefault()}
                  className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

              </Link>
            ))}

          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between border-t-2 border-white/20 bg-white/[0.02] px-5 py-3">

            <p className="text-xs text-zinc-500">
              Showing 6 of 24 work items
            </p>

            <div className="flex items-center gap-1">

              <button className="rounded-md border border-white/20 px-2.5 py-1.5 text-xs text-zinc-500 transition hover:border-white/40 hover:text-white">
                Previous
              </button>

              <button className="rounded-md border border-sky-300/50 bg-sky-500/15 px-2.5 py-1.5 text-xs text-sky-200">
                1
              </button>

              <button className="rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white">
                2
              </button>

              <button className="rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white">
                3
              </button>

              <button className="rounded-md border border-white/20 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-white/40 hover:bg-white/[0.05] hover:text-white">
                Next
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}