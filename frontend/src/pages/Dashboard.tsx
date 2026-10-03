import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import {
  getDashboard,
  type DashboardActivity,
  type DashboardWorkItem,
} from '../lib/api'

function formatTime(value: string) {
  const date = new Date(value)
  const now = new Date()

  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)

  return `${days}d ago`
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'border-red-400/30 bg-red-400/10 text-red-300'
    case 'HIGH':
      return 'border-orange-400/30 bg-orange-400/10 text-orange-300'
    case 'MEDIUM':
      return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300'
    default:
      return 'border-zinc-400/20 bg-zinc-400/10 text-zinc-400'
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case 'OPEN':
      return 'border-pink-300/20 bg-pink-950/25 text-pink-200'
    case 'IN_PROGRESS':
      return 'border-pink-300/20 bg-pink-950/25 text-pink-200'
    case 'BLOCKED':
      return 'border-red-400/30 bg-red-400/10 text-red-300'
    case 'RESOLVED':
      return 'border-pink-300/20 bg-pink-950/25 text-pink-200'
    case 'CLOSED':
      return 'border-pink-300/20 bg-pink-950/25 text-pink-200'
    default:
      return 'border-white/20 bg-white/5 text-zinc-400'
  }
}

function getActivityText(activity: DashboardActivity) {
  const user = activity.user?.name ?? 'Someone'
  const item = activity.workItem?.title ?? 'a work item'

  switch (activity.type) {
    case 'CREATED':
      return `${user} created "${item}"`
    case 'UPDATED':
      return `${user} updated "${item}"`
    case 'ASSIGNED':
      return `${user} changed ownership of "${item}"`
    case 'STATUS_CHANGED':
      return `${user} changed the status of "${item}"`
    case 'COMMENTED':
      return `${user} commented on "${item}"`
    case 'DELETED':
      return `${user} deleted "${item}"`
    default:
      return `${user} performed an action on "${item}"`
  }
}

function WorkItemRow({ item }: { item: DashboardWorkItem }) {
  return (
    <Link
      to={`/work-items/${item.id}`}
      className="group flex items-center gap-4 border-b border-white/20 px-6 py-4 transition last:border-b-0 hover:bg-pink-950/30"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {item.priority === 'URGENT' && (
            <TriangleAlert className="h-4 w-4 shrink-0 text-red-400" />
          )}

          <p className="truncate text-sm font-medium text-zinc-100 group-hover:text-pink-100">
            {item.title}
          </p>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
          <span>{item.team.name}</span>

          <span className="text-zinc-700">•</span>

          <span>{item.assignee?.name ?? 'Unassigned'}</span>
        </div>
      </div>

      <span
        className={`hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${getPriorityClasses(item.priority)}`}
      >
        {item.priority}
      </span>

      <span
        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(item.status)}`}
      >
        {item.status.replace('_', ' ')}
      </span>

      <ArrowUpRight className="h-4 w-4 text-zinc-700 transition group-hover:text-pink-300" />
    </Link>
  )
}

function Dashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    staleTime: 30_000,
  })

  const stats = data?.stats

  return (
    <div className="relative min-h-full overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-pink-500/[0.07] blur-[120px]" />

      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-pink-400/[0.05] blur-[120px]" />

      <div className="relative px-8 py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-pink-200/40">
                Saturday · October 3, 2026
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Good morning
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Here's what needs your attention today.
              </p>
            </div>

            <Link
              to="/work-items/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-pink-950/25 px-5 text-sm font-semibold text-pink-100 shadow-lg shadow-pink-950/10 transition hover:border-pink-300/40 hover:bg-pink-950/40"
            >
              <Plus className="h-4 w-4" />
              New work item
            </Link>
          </div>

          <div className="mb-7 flex max-w-xl items-center gap-3 rounded-xl border-2 border-white/20 bg-pink-950/[0.08] px-4 py-3 shadow-lg shadow-pink-950/10 backdrop-blur-xl">
            <Search className="h-4 w-4 text-pink-200/50" />

            <input
              type="text"
              placeholder="Search work items..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />

            <kbd className="hidden rounded-md border border-white/20 bg-pink-950/25 px-2 py-1 text-[10px] text-zinc-600 sm:block">
              /
            </kbd>
          </div>

          {isLoading && (
            <div className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[125px] animate-pulse rounded-2xl border-2 border-white/20 bg-pink-950/[0.08]"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="mb-7 flex items-center justify-between rounded-2xl border-2 border-red-400/20 bg-red-400/[0.06] px-5 py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />

                <div>
                  <p className="text-sm font-medium text-red-200">
                    Dashboard data could not be loaded.
                  </p>

                  <p className="mt-1 text-xs text-red-300/60">
                    {error instanceof Error
                      ? error.message
                      : 'Please try again.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-400/10"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border-2 border-white/35 bg-pink-950/[0.08] p-5 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  Total work items
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-300/20 bg-pink-950/25 text-pink-200">
                  <ListIcon />
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                {stats?.totalWorkItems ?? '—'}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Across your teams
              </p>
            </div>

            <div className="rounded-2xl border-2 border-white/35 bg-pink-950/[0.08] p-5 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  Open
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-300/20 bg-pink-950/25">
                  <Clock3 className="h-4 w-4 text-pink-200" />
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                {stats?.openWorkItems ?? '—'}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Waiting to be started
              </p>
            </div>

            <div className="rounded-2xl border-2 border-white/35 bg-pink-950/[0.08] p-5 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  In progress
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-300/20 bg-pink-950/25">
                  <Loader2 className="h-4 w-4 text-pink-200" />
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                {stats?.inProgressWorkItems ?? '—'}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Currently being handled
              </p>
            </div>

            <div className="rounded-2xl border-2 border-white/35 bg-pink-950/[0.08] p-5 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  Urgent
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-300/20 bg-pink-950/25">
                  <TriangleAlert className="h-4 w-4 text-pink-200" />
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                {stats?.urgentWorkItems ?? '—'}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Need immediate attention
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <section className="overflow-hidden rounded-2xl border-2 border-white/35 bg-pink-950/15 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b-2 border-white/20 bg-pink-900/[0.06] px-6 py-5">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Work needing attention
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Items that may require action
                  </p>
                </div>

                <Link
                  to="/work-items"
                  className="text-xs font-medium text-pink-200/70 transition hover:text-pink-100"
                >
                  View all
                </Link>
              </div>

              {data?.attentionItems.length === 0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-300/20 bg-pink-950/25">
                    <CheckCircle2 className="h-5 w-5 text-pink-200" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-zinc-300">
                    Nothing needs attention
                  </p>

                  <p className="mt-1 max-w-sm text-xs text-zinc-600">
                    Your teams don't currently have urgent, blocked, or open
                    items requiring attention.
                  </p>
                </div>
              ) : (
                <div className="divide-y-2 divide-white/[0.08]">
                  {data?.attentionItems.map((item) => (
                    <WorkItemRow key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border-2 border-white/35 bg-pink-950/15 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
              <div className="border-b-2 border-white/20 bg-pink-900/[0.06] px-6 py-5">
                <h2 className="text-sm font-semibold text-white">
                  Recent activity
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  Latest changes across your teams
                </p>
              </div>

              {data?.recentActivity.length === 0 ? (
                <div className="flex min-h-[240px] items-center justify-center px-6 text-center">
                  <p className="text-xs text-zinc-600">
                    No recent activity.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.08]">
                  {data?.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="px-6 py-4 transition hover:bg-pink-950/[0.08]"
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-300/20 bg-pink-950/25">
                          <ActivityIcon type={activity.type} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs leading-5 text-zinc-400">
                            {getActivityText(activity)}
                          </p>

                          <p className="mt-1 text-[10px] text-zinc-700">
                            {formatTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function ListIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 text-pink-200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M5 4h7M5 8h7M5 12h7"
        strokeLinecap="round"
      />

      <circle
        cx="2.5"
        cy="4"
        r=".7"
        fill="currentColor"
        stroke="none"
      />

      <circle
        cx="2.5"
        cy="8"
        r=".7"
        fill="currentColor"
        stroke="none"
      />

      <circle
        cx="2.5"
        cy="12"
        r=".7"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

function ActivityIcon({ type }: { type: string }) {
  if (type === 'DELETED') {
    return <AlertCircle className="h-3.5 w-3.5 text-red-300" />
  }

  if (type === 'STATUS_CHANGED') {
    return <Clock3 className="h-3.5 w-3.5 text-pink-200" />
  }

  if (type === 'ASSIGNED') {
    return <ArrowUpRight className="h-3.5 w-3.5 text-pink-200" />
  }

  return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
}

export default Dashboard