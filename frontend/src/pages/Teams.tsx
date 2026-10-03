import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  Users,
} from 'lucide-react'

import {
  getTeam,
  getTeams,
  getWorkItems,
  type Team,
  type WorkItem,
} from '../lib/api'

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return 'TM'

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

function formatStatus(status: string) {
  return status.replaceAll('_', ' ')
}

function formatPriority(priority: string) {
  return priority.charAt(0) + priority.slice(1).toLowerCase()
}

function priorityClass(priority: WorkItem['priority']) {
  if (priority === 'URGENT') {
    return 'border-red-400/20 bg-red-400/10 text-red-300'
  }

  if (priority === 'HIGH') {
    return 'border-orange-400/20 bg-orange-400/10 text-orange-300'
  }

  if (priority === 'MEDIUM') {
    return 'border-yellow-400/20 bg-yellow-400/10 text-yellow-300'
  }

  return 'border-zinc-400/20 bg-zinc-400/10 text-zinc-400'
}

function statusClass(status: WorkItem['status']) {
  if (status === 'RESOLVED' || status === 'CLOSED') {
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
  }

  if (status === 'BLOCKED') {
    return 'border-red-400/20 bg-red-400/10 text-red-300'
  }

  if (status === 'IN_PROGRESS') {
    return 'border-blue-400/20 bg-blue-400/10 text-blue-300'
  }

  return 'border-zinc-400/20 bg-zinc-400/10 text-zinc-400'
}

function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="group relative overflow-hidden rounded-xl border-2 border-white/20 bg-pink-950/[0.08] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-300/40 hover:bg-pink-950/30 hover:shadow-[0_18px_45px_rgba(236,72,153,0.07)]"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-pink-500/[0.045] blur-[65px] transition-all duration-300 group-hover:bg-pink-500/[0.08]" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-pink-300/20 bg-pink-950/25 text-xs font-semibold text-pink-200 transition-all duration-300 group-hover:border-pink-300/40 group-hover:bg-pink-950/40">
              {getInitials(team.name)}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-200 transition group-hover:text-white">
                {team.name}
              </h3>

              <p className="mt-0.5 text-[11px] text-zinc-600">
                Operational team
              </p>
            </div>
          </div>

          <ChevronRight className="h-4 w-4 text-zinc-700 transition-all duration-200 group-hover:translate-x-1 group-hover:text-pink-300" />
        </div>

        <p className="mt-5 min-h-[40px] text-xs leading-5 text-zinc-500 transition group-hover:text-zinc-400">
          {team.description || 'No team description has been added yet.'}
        </p>

        <div className="my-5 border-t-2 border-white/[0.08]" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              Team ID
            </p>

            <p className="mt-1.5 truncate text-xs font-medium text-zinc-400">
              {team.id}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              Access
            </p>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />

              <span className="text-[11px] font-medium text-pink-300/80">
                Available
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-zinc-600" />

          <span className="text-[11px] text-zinc-600">
            View team workspace
          </span>
        </div>
      </div>
    </Link>
  )
}

function TeamList() {
  const [search, setSearch] = useState('')

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  })

  const teams = data?.teams ?? []

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return teams

    return teams.filter((team) => {
      return (
        team.name.toLowerCase().includes(query) ||
        (team.description ?? '').toLowerCase().includes(query)
      )
    })
  }, [teams, search])

  const stats = [
    {
      label: 'Accessible teams',
      value: String(teams.length),
      icon: Users,
    },
    {
      label: 'Visible results',
      value: String(filteredTeams.length),
      icon: BriefcaseBusiness,
    },
    {
      label: 'Search status',
      value: search.trim() ? 'Filtered' : 'All',
      icon: Search,
    },
    {
      label: 'Workspace access',
      value: teams.length > 0 ? 'Active' : 'None',
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="relative min-h-full overflow-hidden bg-[#0b090b]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-56 h-[650px] w-[650px] rounded-full bg-pink-500/[0.07] blur-[145px]" />
        <div className="absolute -right-48 -top-40 h-[600px] w-[600px] rounded-full bg-fuchsia-500/[0.055] blur-[150px]" />
        <div className="absolute bottom-[-300px] left-[25%] h-[650px] w-[650px] rounded-full bg-rose-500/[0.045] blur-[150px]" />
        <div className="absolute bottom-[-250px] right-[-100px] h-[550px] w-[550px] rounded-full bg-pink-400/[0.035] blur-[145px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,9,11,0.08)_45%,rgba(11,9,11,0.38)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] p-6 lg:p-8">
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
            disabled
            className="inline-flex w-fit cursor-not-allowed items-center gap-2 rounded-lg border-2 border-pink-200/20 bg-pink-100/80 px-4 py-2.5 text-sm font-semibold text-black/60"
          >
            <Plus className="h-4 w-4" />
            Create team
          </button>
        </div>

        <div className="group mb-8 flex items-center gap-3 rounded-xl border-2 border-white/30 bg-pink-950/15 px-4 py-3 backdrop-blur-xl transition-all duration-200 focus-within:border-pink-300/50 focus-within:bg-pink-950/25">
          <Search className="h-4 w-4 text-zinc-500 transition group-focus-within:text-pink-300" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teams..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs text-zinc-500 transition hover:text-white"
            >
              Clear
            </button>
          )}

          <kbd className="hidden rounded-md border-2 border-white/20 bg-pink-950/15 px-2 py-1 text-[11px] text-zinc-500 sm:block">
            ⌘ K
          </kbd>
        </div>

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

                    <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
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

        <section className="overflow-hidden rounded-2xl border-2 border-white/35 bg-pink-950/15 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b-2 border-white/20 bg-pink-900/[0.06] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                All teams
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Teams you currently have access to in the operations workspace.
              </p>
            </div>

            <span className="text-xs text-zinc-600">
              {filteredTeams.length}{' '}
              {filteredTeams.length === 1 ? 'team' : 'teams'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading teams...
            </div>
          ) : isError ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-red-400" />

              <p className="mt-3 text-sm font-medium text-white">
                Could not load teams
              </p>

              <p className="mt-1 max-w-sm text-xs text-zinc-500">
                The team service could not be reached. Check that the backend
                is running and try again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <Users className="h-8 w-8 text-zinc-600" />

              <p className="mt-3 text-sm font-medium text-white">
                {search.trim() ? 'No teams found' : 'No teams available'}
              </p>

              <p className="mt-1 max-w-sm text-xs text-zinc-500">
                {search.trim()
                  ? 'Try a different team name or description.'
                  : 'You do not currently have access to any teams.'}
              </p>

              {search.trim() && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t-2 border-white/20 bg-pink-900/[0.04] px-5 py-4">
            <p className="text-xs text-zinc-600">
              Data is loaded from the OpsFlow API
            </p>

            <Link
              to="/work-items"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-pink-300"
            >
              View work items
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function TeamDetail({ teamId }: { teamId: string }) {
  const navigate = useNavigate()

  const {
    data: teamData,
    isLoading: teamLoading,
    isError: teamError,
    refetch: refetchTeam,
  } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => getTeam(teamId),
  })

  const {
    data: workData,
    isLoading: workLoading,
  } = useQuery({
    queryKey: ['work-items', 'team', teamId],
    queryFn: () =>
      getWorkItems({
        teamId,
        page: 1,
        limit: 20,
      }),
  })

  const team = teamData?.team
  const workItems = workData?.items ?? []

  const activeCount = workItems.filter(
    (item) =>
      item.status !== 'RESOLVED' &&
      item.status !== 'CLOSED',
  ).length

  const urgentCount = workItems.filter(
    (item) => item.priority === 'URGENT',
  ).length

  const completedCount = workItems.filter(
    (item) =>
      item.status === 'RESOLVED' ||
      item.status === 'CLOSED',
  ).length

  if (teamLoading) {
    return (
      <div className="relative flex min-h-full items-center justify-center bg-[#0b090b]">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading team...
        </div>
      </div>
    )
  }

  if (teamError || !team) {
    return (
      <div className="relative flex min-h-full flex-col items-center justify-center bg-[#0b090b] px-6 text-center">
        <AlertCircle className="h-9 w-9 text-red-400" />

        <h1 className="mt-4 text-lg font-semibold text-white">
          Team could not be loaded
        </h1>

        <p className="mt-2 max-w-md text-sm text-zinc-500">
          The team may not exist or you may not have access to it.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => refetchTeam()}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={() => navigate('/teams')}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
          >
            Back to teams
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[#0b090b]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-56 h-[650px] w-[650px] rounded-full bg-pink-500/[0.07] blur-[145px]" />
        <div className="absolute -right-48 -top-40 h-[600px] w-[600px] rounded-full bg-fuchsia-500/[0.055] blur-[150px]" />
        <div className="absolute bottom-[-300px] left-[25%] h-[650px] w-[650px] rounded-full bg-rose-500/[0.045] blur-[150px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] p-6 lg:p-8">
        <button
          type="button"
          onClick={() => navigate('/teams')}
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-pink-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to teams
        </button>

        <div className="overflow-hidden rounded-2xl border-2 border-white/30 bg-pink-950/15 backdrop-blur-xl">
          <div className="relative overflow-hidden border-b-2 border-white/20 p-6 lg:p-8">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-pink-500/[0.06] blur-[100px]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-pink-300/25 bg-pink-950/40 text-lg font-semibold text-pink-200">
                  {getInitials(team.name)}
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-pink-300/75">
                    Team workspace
                  </p>

                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    {team.name}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    {team.description || 'No team description has been added yet.'}
                  </p>

                  <p className="mt-3 text-[11px] text-zinc-600">
                    Team ID: {team.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-pink-300/20 bg-pink-950/30 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-pink-300" />

                <span className="text-xs font-medium text-pink-200">
                  Accessible
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b-2 border-white/20 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Visible work',
                value: workLoading ? '—' : String(workItems.length),
                icon: BriefcaseBusiness,
              },
              {
                label: 'Active work',
                value: workLoading ? '—' : String(activeCount),
                icon: BriefcaseBusiness,
              },
              {
                label: 'Urgent',
                value: workLoading ? '—' : String(urgentCount),
                icon: AlertCircle,
              },
              {
                label: 'Completed',
                value: workLoading ? '—' : String(completedCount),
                icon: CheckCircle2,
              },
            ].map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border-2 border-white/20 bg-black/10 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      {stat.label}
                    </p>

                    <Icon className="h-4 w-4 text-pink-300/70" />
                  </div>

                  <p className="mt-3 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>

          <div>
            <div className="flex items-center justify-between border-b-2 border-white/20 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Team work
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Work items currently visible in this team.
                </p>
              </div>

              <Link
                to={`/work-items?teamId=${team.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-pink-300"
              >
                Open work
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {workLoading ? (
              <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading team work...
              </div>
            ) : workItems.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
                <BriefcaseBusiness className="h-8 w-8 text-zinc-700" />

                <p className="mt-3 text-sm font-medium text-white">
                  No work items found
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  This team currently has no visible work items.
                </p>
              </div>
            ) : (
              <div className="divide-y-2 divide-white/[0.08]">
                {workItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/work-items/${item.id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-pink-950/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-200 transition group-hover:text-white">
                        {item.title}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
                        <span>
                          {item.assignee?.name ?? 'Unassigned'}
                        </span>

                        <span>•</span>

                        <span>
                          Updated{' '}
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`hidden rounded-md border px-2 py-1 text-[10px] font-medium uppercase tracking-wide sm:inline-flex ${statusClass(item.status)}`}
                    >
                      {formatStatus(item.status)}
                    </span>

                    <span
                      className={`hidden rounded-md border px-2 py-1 text-[10px] font-medium sm:inline-flex ${priorityClass(item.priority)}`}
                    >
                      {formatPriority(item.priority)}
                    </span>

                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-pink-300" />
                  </Link>
                ))}
              </div>
            )}

            <div className="border-t-2 border-white/20 bg-pink-900/[0.04] px-5 py-4">
              <Link
                to="/teams"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-pink-300"
              >
                All teams
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Teams() {
  const { id } = useParams()

  if (id) {
    return <TeamDetail teamId={id} />
  }

  return <TeamList />
}