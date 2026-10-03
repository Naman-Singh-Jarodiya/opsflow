import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Plus,
  Search,
  Users,
} from 'lucide-react'

const teams = [
  {
    id: 'operations',
    name: 'Operations',
    description:
      'Coordinates day-to-day operational work, escalations, and internal processes.',
    initials: 'OP',
    members: 18,
    active: 24,
    completed: 86,
    status: 'Healthy',
    lead: 'Nitika Pandey',
  },
  {
    id: 'payments',
    name: 'Payments',
    description:
      'Owns payment operations, transaction issues, and payment reliability.',
    initials: 'PM',
    members: 12,
    active: 16,
    completed: 64,
    status: 'Healthy',
    lead: 'Aarav Sharma',
  },
  {
    id: 'support',
    name: 'Customer Support',
    description:
      'Handles customer escalations, support workflows, and service requests.',
    initials: 'CS',
    members: 24,
    active: 31,
    completed: 112,
    status: 'Attention',
    lead: 'Riya Kapoor',
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description:
      'Manages vendors, purchasing workflows, approvals, and onboarding.',
    initials: 'PR',
    members: 9,
    active: 11,
    completed: 48,
    status: 'Healthy',
    lead: 'Kabir Mehta',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description:
      'Owns technical operations, incidents, platform work, and engineering requests.',
    initials: 'EN',
    members: 32,
    active: 27,
    completed: 143,
    status: 'Healthy',
    lead: 'Arjun Verma',
  },
  {
    id: 'finance',
    name: 'Finance',
    description:
      'Handles financial operations, reconciliation, approvals, and reporting.',
    initials: 'FI',
    members: 11,
    active: 8,
    completed: 72,
    status: 'Healthy',
    lead: 'Meera Singh',
  },
]

const stats = [
  {
    label: 'Total teams',
    value: '6',
    icon: Users,
  },
  {
    label: 'Members',
    value: '106',
    icon: Users,
  },
  {
    label: 'Active work',
    value: '117',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Healthy teams',
    value: '5',
    icon: CheckCircle2,
  },
]

export default function Teams() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#0b090b]">

      {/* =========================================================
          SUBTLE PINK BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-48 -top-56 h-[650px] w-[650px] rounded-full bg-pink-500/[0.07] blur-[145px]" />

        <div className="absolute -right-48 -top-40 h-[600px] w-[600px] rounded-full bg-fuchsia-500/[0.055] blur-[150px]" />

        <div className="absolute bottom-[-300px] left-[25%] h-[650px] w-[650px] rounded-full bg-rose-500/[0.045] blur-[150px]" />

        <div className="absolute bottom-[-250px] right-[-100px] h-[550px] w-[550px] rounded-full bg-pink-400/[0.035] blur-[145px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,9,11,0.08)_45%,rgba(11,9,11,0.38)_100%)]" />

      </div>

      <div className="relative mx-auto w-full max-w-[1500px] p-6 lg:p-8">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-pink-300/75">
              Organization
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Teams
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Manage teams, understand ownership, and see the operational work
              happening across your organization.
            </p>
          </div>

          <button
            type="button"
            className="group inline-flex w-fit items-center gap-2 rounded-lg border-2 border-pink-200/25 bg-pink-100 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_10px_35px_rgba(236,72,153,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-100 hover:bg-pink-200 hover:shadow-[0_10px_35px_rgba(236,72,153,0.12)]"
          >
            <Plus className="h-4 w-4" />

            Create team

            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </button>

        </div>

        {/* =========================================================
            SEARCH
        ========================================================= */}
        <div className="group mb-8 flex items-center gap-3 rounded-xl border-2 border-white/30 bg-pink-950/15 px-4 py-3 backdrop-blur-xl transition-all duration-200 focus-within:border-pink-300/50 focus-within:bg-pink-950/25">

          <Search className="h-4 w-4 text-zinc-500 transition group-focus-within:text-pink-300" />

          <input
            type="text"
            placeholder="Search teams..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />

          <kbd className="hidden rounded-md border-2 border-white/20 bg-pink-950/15 px-2 py-1 text-[11px] text-zinc-500 sm:block">
            ⌘ K
          </kbd>

        </div>

        {/* =========================================================
            STATS
        ========================================================= */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border-2 border-white/30 bg-pink-950/15 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-300/40 hover:bg-pink-950/30"
              >

                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-pink-500/[0.05] blur-[55px]" />

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
                    <Icon className="h-4 w-4 text-pink-300" />
                  </div>

                </div>

              </div>
            )
          })}

        </div>

        {/* =========================================================
            TEAM GRID
        ========================================================= */}
        <section className="overflow-hidden rounded-2xl border-2 border-white/35 bg-pink-950/15 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">

          {/* Section header */}
          <div className="flex flex-col gap-4 border-b-2 border-white/20 bg-pink-900/[0.06] px-5 py-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-sm font-semibold text-white">
                All teams
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Teams you have access to in the operations workspace.
              </p>
            </div>

            <span className="text-xs text-zinc-600">
              6 teams
            </span>

          </div>

          {/* Cards */}
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">

            {teams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="group relative overflow-hidden rounded-xl border-2 border-white/20 bg-pink-950/[0.08] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-300/40 hover:bg-pink-950/30 hover:shadow-[0_18px_45px_rgba(236,72,153,0.07)]"
              >

                {/* Card glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-pink-500/[0.045] blur-[65px] transition-all duration-300 group-hover:bg-pink-500/[0.08]" />

                <div className="relative">

                  {/* Top row */}
                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-pink-300/20 bg-pink-950/25 text-xs font-semibold text-pink-200 transition-all duration-300 group-hover:border-pink-300/40 group-hover:bg-pink-950/40">
                        {team.initials}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200 transition group-hover:text-white">
                          {team.name}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-zinc-600">
                          Lead · {team.lead}
                        </p>
                      </div>

                    </div>

                    <ChevronRight className="h-4 w-4 text-zinc-700 transition-all duration-200 group-hover:translate-x-1 group-hover:text-pink-300" />

                  </div>

                  {/* Description */}
                  <p className="mt-5 min-h-[40px] text-xs leading-5 text-zinc-500 transition group-hover:text-zinc-400">
                    {team.description}
                  </p>

                  {/* Divider */}
                  <div className="my-5 border-t-2 border-white/[0.08]" />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                        Members
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-zinc-300">
                        {team.members}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                        Active
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-zinc-300">
                        {team.active}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                        Completed
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-zinc-300">
                        {team.completed}
                      </p>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          team.status === 'Healthy'
                            ? 'bg-pink-300'
                            : 'bg-fuchsia-300'
                        }`}
                      />

                      <span
                        className={`text-[11px] font-medium ${
                          team.status === 'Healthy'
                            ? 'text-pink-300/80'
                            : 'text-fuchsia-300/80'
                        }`}
                      >
                        {team.status}
                      </span>

                    </div>

                    <span className="text-[11px] text-zinc-600 transition group-hover:text-pink-300/70">
                      View team
                    </span>

                  </div>

                </div>

              </Link>
            ))}

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t-2 border-white/20 bg-pink-900/[0.04] px-5 py-4">

            <p className="text-xs text-zinc-600">
              Showing all teams in your workspace
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-pink-300"
            >
              Manage members

              <ArrowRight className="h-3.5 w-3.5" />
            </button>

          </div>

        </section>

      </div>
    </div>
  )
}