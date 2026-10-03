import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Search,
  UserRound,
  Zap,
} from 'lucide-react'

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { getWorkItems, type WorkItem } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function statusLabel(status: string) {
  return status.replaceAll('_', ' ')
}

function statusClass(_status: string) {
  return 'border-pink-300/20 bg-pink-950/25 text-pink-200'
}

function priorityClass(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'text-red-400'
    case 'HIGH':
      return 'text-orange-400'
    case 'MEDIUM':
      return 'text-yellow-400'
    default:
      return 'text-zinc-400'
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function WorkRow({ item }: { item: WorkItem }) {
  return (
    <Link
      to={`/work-items/${item.id}`}
      className="group grid grid-cols-[minmax(0,1fr)_130px_120px_150px_90px] items-center gap-4 border-b border-white/20 px-5 py-4 transition last:border-b-0 hover:bg-pink-950/30"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              item.priority === 'URGENT'
                ? 'bg-red-400'
                : item.priority === 'HIGH'
                  ? 'bg-orange-400'
                  : item.priority === 'MEDIUM'
                    ? 'bg-yellow-400'
                    : 'bg-zinc-500'
            }`}
          />

          <p className="truncate text-sm font-medium text-white transition group-hover:text-pink-200">
            {item.title}
          </p>
        </div>

        <p className="mt-1 truncate pl-4 text-xs text-zinc-500">
          {item.team.name}
        </p>
      </div>

      <span
        className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass(item.status)}`}
      >
        {statusLabel(item.status)}
      </span>

      <span
        className={`text-xs font-medium ${priorityClass(item.priority)}`}
      >
        {item.priority}
      </span>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Clock3 className="h-3.5 w-3.5" />
        {formatDate(item.updatedAt)}
      </div>

      <ArrowRight className="ml-auto h-4 w-4 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-pink-300" />
    </Link>
  )
}

function MyWork() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-work', user?.id],
    queryFn: () =>
      getWorkItems({
        assigneeId: user?.id,
        search: search.trim() || undefined,
        page: 1,
        limit: 50,
      }),
    enabled: Boolean(user?.id),
  })

  const items = data?.items ?? []

  const stats = useMemo(
    () => ({
      total: items.length,

      active: items.filter(
        (item) =>
          item.status === 'OPEN' ||
          item.status === 'IN_PROGRESS',
      ).length,

      blocked: items.filter(
        (item) => item.status === 'BLOCKED',
      ).length,

      urgent: items.filter(
        (item) => item.priority === 'URGENT',
      ).length,
    }),
    [items],
  )

  return (
    <div className="relative min-h-full overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-pink-500/[0.07] blur-[120px]" />

      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-pink-400/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-[1500px] px-8 py-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-pink-200/60">
              <UserRound className="h-3.5 w-3.5" />
              Personal workspace
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              My Work
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Work items currently assigned to you.
            </p>
          </div>

          <Link
            to="/work-items"
            className="rounded-lg border-2 border-white/20 bg-pink-950/[0.08] px-4 py-2.5 text-sm font-medium text-zinc-300 shadow-lg shadow-pink-950/10 transition hover:border-pink-300/40 hover:bg-pink-950/30 hover:text-white"
          >
            All work items
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border-2 border-white/20 bg-pink-950/[0.08] p-5 shadow-lg shadow-pink-950/10 backdrop-blur-xl">
            <p className="text-xs text-zinc-500">Assigned</p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border-2 border-white/20 bg-pink-950/[0.08] p-5 shadow-lg shadow-pink-950/10 backdrop-blur-xl">
            <p className="text-xs text-zinc-500">Active</p>

            <p className="mt-2 text-2xl font-semibold text-pink-200">
              {stats.active}
            </p>
          </div>

          <div className="rounded-xl border-2 border-white/20 bg-pink-950/[0.08] p-5 shadow-lg shadow-pink-950/10 backdrop-blur-xl">
            <p className="text-xs text-zinc-500">Blocked</p>

            <p className="mt-2 text-2xl font-semibold text-pink-200">
              {stats.blocked}
            </p>
          </div>

          <div className="rounded-xl border-2 border-white/20 bg-pink-950/[0.08] p-5 shadow-lg shadow-pink-950/10 backdrop-blur-xl">
            <p className="text-xs text-zinc-500">Urgent</p>

            <p className="mt-2 text-2xl font-semibold text-pink-200">
              {stats.urgent}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-white/35 bg-pink-950/15 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 border-b-2 border-white/20 bg-pink-900/[0.06] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Assigned work
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Focus on the items that need your attention.
              </p>
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-200/50" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search my work..."
                className="w-full rounded-lg border-2 border-white/20 bg-pink-950/[0.08] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-pink-300/40"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-pink-200" />
              Loading your work...
            </div>
          ) : isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <AlertCircle className="h-7 w-7 text-red-400" />

              <p className="mt-3 text-sm font-medium">
                Could not load your work
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 rounded-lg border-2 border-white/20 bg-pink-950/[0.08] px-3 py-2 text-xs text-zinc-300 transition hover:border-pink-300/40 hover:bg-pink-950/30"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-pink-950/25">
                <CheckCircle2 className="h-6 w-6 text-pink-200" />
              </div>

              <p className="mt-3 text-sm font-medium">
                Nothing assigned to you
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                New assignments will appear here automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,1fr)_130px_120px_150px_90px] gap-4 border-b-2 border-white/20 bg-pink-900/[0.06] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 md:grid">
                <span>Work item</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Updated</span>
                <span />
              </div>

              {items.map((item) => (
                <WorkRow
                  key={item.id}
                  item={item}
                />
              ))}
            </>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
          <Zap className="h-3.5 w-3.5 text-pink-200/50" />
          Changes are synchronized with the server.
        </div>
      </div>
    </div>
  )
}

export default MyWork