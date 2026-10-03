import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Filter,
  Loader2,
  Plus,
  Search,
  X,
  Zap,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useQuery } from '@tanstack/react-query'

import {
  Link,
  useSearchParams,
} from 'react-router-dom'

import {
  getTeams,
  getWorkItems,
  type WorkItemPriority,
  type WorkItemStatus,
} from '../lib/api'

const statuses: Array<{
  value: WorkItemStatus
  label: string
}> = [
  {
    value: 'OPEN',
    label: 'Open',
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
  },
  {
    value: 'BLOCKED',
    label: 'Blocked',
  },
  {
    value: 'RESOLVED',
    label: 'Resolved',
  },
  {
    value: 'CLOSED',
    label: 'Closed',
  },
]

const priorities: Array<{
  value: WorkItemPriority
  label: string
}> = [
  {
    value: 'LOW',
    label: 'Low',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
  },
  {
    value: 'HIGH',
    label: 'High',
  },
  {
    value: 'URGENT',
    label: 'Urgent',
  },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function statusIcon(
  status: WorkItemStatus,
) {
  if (status === 'OPEN') {
    return (
      <CircleDot className="h-4 w-4" />
    )
  }

  if (status === 'IN_PROGRESS') {
    return (
      <Clock3 className="h-4 w-4" />
    )
  }

  if (status === 'BLOCKED') {
    return (
      <AlertCircle className="h-4 w-4" />
    )
  }

  return (
    <CheckCircle2 className="h-4 w-4" />
  )
}

function statusClass(
  _status: WorkItemStatus,
) {
  return 'border-pink-300/20 bg-pink-950/25 text-pink-200'
}

function priorityClass(
  priority: WorkItemPriority,
) {
  if (priority === 'URGENT') {
    return 'border-red-400/20 bg-red-400/10 text-red-300'
  }

  if (priority === 'HIGH') {
    return 'border-orange-400/20 bg-orange-400/10 text-orange-300'
  }

  if (priority === 'MEDIUM') {
    return 'border-yellow-400/20 bg-yellow-400/10 text-yellow-300'
  }

  return 'border-pink-300/20 bg-pink-950/25 text-pink-200'
}

function WorkItems() {
  const [searchParams, setSearchParams] =
    useSearchParams()

  const page = Number(
    searchParams.get('page') ?? '1',
  )

  const statusParam =
    searchParams.get('status') as
      | WorkItemStatus
      | null

  const priorityParam =
    searchParams.get('priority') as
      | WorkItemPriority
      | null

  const teamParam =
    searchParams.get('teamId') ?? ''

  const [searchInput, setSearchInput] =
    useState(
      searchParams.get('search') ?? '',
    )

  const [filtersOpen, setFiltersOpen] =
    useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(
        searchParams,
      )

      if (searchInput.trim()) {
        next.set(
          'search',
          searchInput.trim(),
        )
      } else {
        next.delete('search')
      }

      next.set('page', '1')
      setSearchParams(next)
    }, 350)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    searchInput,
    searchParams,
    setSearchParams,
  ])

  const {
    data: teamsData,
    isLoading: teamsLoading,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
    staleTime: 60_000,
  })

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'work-items',
      {
        page,
        search:
          searchParams.get('search') ?? '',
        status:
          statusParam ?? undefined,
        priority:
          priorityParam ?? undefined,
        teamId: teamParam || undefined,
      },
    ],
    queryFn: () =>
      getWorkItems({
        page,
        limit: 12,
        search:
          searchParams.get('search') ??
          undefined,
        status:
          statusParam ?? undefined,
        priority:
          priorityParam ?? undefined,
        teamId:
          teamParam || undefined,
      }),
    placeholderData: (previous) =>
      previous,
  })

  const items = data?.items ?? []
  const pagination = data?.pagination

  const activeFilterCount =
    Number(Boolean(statusParam)) +
    Number(Boolean(priorityParam)) +
    Number(Boolean(teamParam))

  const hasFilters =
    Boolean(statusParam) ||
    Boolean(priorityParam) ||
    Boolean(teamParam)

  const pageNumbers = useMemo(() => {
    if (!pagination) {
      return []
    }

    const total = pagination.totalPages

    if (total <= 5) {
      return Array.from(
        { length: total },
        (_, index) => index + 1,
      )
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5]
    }

    if (page >= total - 2) {
      return [
        total - 4,
        total - 3,
        total - 2,
        total - 1,
        total,
      ]
    }

    return [
      page - 2,
      page - 1,
      page,
      page + 1,
      page + 2,
    ]
  }, [page, pagination])

  function updateFilter(
    key:
      | 'status'
      | 'priority'
      | 'teamId',
    value: string,
  ) {
    const next = new URLSearchParams(
      searchParams,
    )

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    next.set('page', '1')
    setSearchParams(next)
  }

  function clearFilters() {
    setSearchInput('')

    const next = new URLSearchParams()
    setSearchParams(next)
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(
      searchParams,
    )

    next.set(
      'page',
      String(nextPage),
    )

    setSearchParams(next)
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[#09090b] px-5 py-6 text-white sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-pink-500/[0.07] blur-[120px]" />

      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-pink-400/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-pink-200/50">
              <Zap className="h-3.5 w-3.5" />
              Operations
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Work items
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Search, prioritize and manage
              operational work across your
              teams.
            </p>
          </div>

          <Link
            to="/work-items/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-pink-950/25 px-4 text-sm font-semibold text-pink-100 shadow-lg shadow-pink-950/10 transition hover:border-pink-300/40 hover:bg-pink-950/40"
          >
            <Plus className="h-4 w-4" />
            New work item
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-white/35 bg-pink-950/15 shadow-2xl shadow-pink-950/10 backdrop-blur-xl">
          <div className="border-b-2 border-white/20 bg-pink-900/[0.06] p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-200/50" />

                <input
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(
                      event.target.value,
                    )
                  }
                  placeholder="Search work items..."
                  className="h-10 w-full rounded-xl border-2 border-white/20 bg-pink-950/[0.08] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-pink-300/40"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchInput('')
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-pink-200"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setFiltersOpen(
                    (value) => !value,
                  )
                }
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm transition ${
                  filtersOpen ||
                  activeFilterCount > 0
                    ? 'border-pink-300/40 bg-pink-950/30 text-pink-100'
                    : 'border-white/20 bg-pink-950/[0.08] text-zinc-400 hover:border-pink-300/30 hover:bg-pink-950/20 hover:text-white'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters

                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-200 px-1.5 text-[11px] font-semibold text-pink-950">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {isFetching && (
                <div className="flex items-center justify-center px-2 text-pink-200/60">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>

            {filtersOpen && (
              <div className="mt-3 grid gap-3 border-t-2 border-white/[0.08] pt-3 sm:grid-cols-3">
                <select
                  value={statusParam ?? ''}
                  onChange={(event) =>
                    updateFilter(
                      'status',
                      event.target.value,
                    )
                  }
                  className="h-10 rounded-xl border-2 border-white/20 bg-pink-950/[0.08] px-3 text-sm text-zinc-300 outline-none focus:border-pink-300/40"
                >
                  <option value="">
                    All statuses
                  </option>

                  {statuses.map(
                    (status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ),
                  )}
                </select>

                <select
                  value={priorityParam ?? ''}
                  onChange={(event) =>
                    updateFilter(
                      'priority',
                      event.target.value,
                    )
                  }
                  className="h-10 rounded-xl border-2 border-white/20 bg-pink-950/[0.08] px-3 text-sm text-zinc-300 outline-none focus:border-pink-300/40"
                >
                  <option value="">
                    All priorities
                  </option>

                  {priorities.map(
                    (priority) => (
                      <option
                        key={priority.value}
                        value={priority.value}
                      >
                        {priority.label}
                      </option>
                    ),
                  )}
                </select>

                <select
                  value={teamParam}
                  onChange={(event) =>
                    updateFilter(
                      'teamId',
                      event.target.value,
                    )
                  }
                  disabled={teamsLoading}
                  className="h-10 rounded-xl border-2 border-white/20 bg-pink-950/[0.08] px-3 text-sm text-zinc-300 outline-none focus:border-pink-300/40 disabled:opacity-50"
                >
                  <option value="">
                    All teams
                  </option>

                  {teamsData?.teams.map(
                    (team) => (
                      <option
                        key={team.id}
                        value={team.id}
                      >
                        {team.name}
                      </option>
                    ),
                  )}
                </select>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-left text-xs font-medium text-pink-200/60 transition hover:text-pink-100 sm:col-span-3"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Loader2 className="h-5 w-5 animate-spin text-pink-200" />
                Loading work items...
              </div>
            </div>
          ) : isError ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-red-400/20 bg-red-400/10">
                <AlertCircle className="h-5 w-5 text-red-300" />
              </div>

              <h2 className="text-sm font-semibold text-white">
                Couldn't load work items
              </h2>

              <p className="mt-2 max-w-sm text-sm text-zinc-500">
                {error instanceof Error
                  ? error.message
                  : 'Something went wrong while loading the work items.'}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl border-2 border-white/20 bg-pink-950/[0.08] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-pink-300/40 hover:bg-pink-950/30"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white/20 bg-pink-950/25">
                <Search className="h-5 w-5 text-pink-200/60" />
              </div>

              <h2 className="text-sm font-semibold text-white">
                No work items found
              </h2>

              <p className="mt-2 max-w-sm text-sm text-zinc-500">
                Try changing your search or
                filters, or create a new work
                item.
              </p>

              {(searchInput ||
                hasFilters) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 text-sm font-medium text-pink-200/70 transition hover:text-pink-100"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b-2 border-white/20 bg-pink-900/[0.06] text-left">
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-pink-200/40">
                        Work item
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-pink-200/40">
                        Status
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-pink-200/40">
                        Priority
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-pink-200/40">
                        Team
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-pink-200/40">
                        Owner
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-pink-200/40">
                        Updated
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="group border-b-2 border-white/[0.06] transition hover:bg-pink-950/30"
                        >
                          <td className="px-5 py-4">
                            <Link
                              to={`/work-items/${item.id}`}
                              className="block max-w-[390px]"
                            >
                              <div className="truncate text-sm font-medium text-zinc-100 transition group-hover:text-pink-100">
                                {item.title}
                              </div>

                              {item.description && (
                                <div className="mt-1 truncate text-xs text-zinc-600">
                                  {item.description}
                                </div>
                              )}
                            </Link>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${statusClass(item.status)}`}
                            >
                              {statusIcon(
                                item.status,
                              )}

                              {item.status
                                .replace(
                                  '_',
                                  ' ',
                                )
                                .toLowerCase()
                                .replace(
                                  /^\w/,
                                  (char) =>
                                    char.toUpperCase(),
                                )}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium ${priorityClass(item.priority)}`}
                            >
                              {item.priority}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="text-sm text-zinc-400">
                              {item.team.name}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {item.assignee ? (
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-pink-300/20 bg-pink-950/25 text-[10px] font-semibold text-pink-200">
                                  {getInitials(
                                    item.assignee
                                      .name,
                                  )}
                                </div>

                                <span className="max-w-[130px] truncate text-sm text-zinc-400">
                                  {
                                    item
                                      .assignee
                                      .name
                                  }
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-zinc-700">
                                Unassigned
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span className="flex items-center gap-2 text-xs text-zinc-600">
                              <ArrowUpDown className="h-3.5 w-3.5 text-pink-200/40" />

                              {formatDate(
                                item.updatedAt,
                              )}
                            </span>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {pagination && (
                <div className="flex flex-col gap-3 border-t-2 border-white/20 bg-pink-900/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-zinc-600">
                    Showing{' '}
                    <span className="text-zinc-400">
                      {pagination.total ===
                      0
                        ? 0
                        : Math.min(
                            (pagination.page -
                              1) *
                              pagination.limit +
                              1,
                            pagination.total,
                          )}
                    </span>{' '}
                    –{' '}
                    <span className="text-zinc-400">
                      {Math.min(
                        pagination.page *
                          pagination.limit,
                        pagination.total,
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="text-zinc-400">
                      {pagination.total}
                    </span>
                  </p>

                  {pagination.totalPages >
                    1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() =>
                          goToPage(
                            page - 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-white/20 text-zinc-500 transition hover:border-pink-300/30 hover:bg-pink-950/30 hover:text-pink-100 disabled:pointer-events-none disabled:opacity-30"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {pageNumbers.map(
                        (pageNumber) => (
                          <button
                            key={
                              pageNumber
                            }
                            type="button"
                            onClick={() =>
                              goToPage(
                                pageNumber,
                              )
                            }
                            className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition ${
                              pageNumber ===
                              page
                                ? 'border border-pink-200/40 bg-pink-200 text-pink-950'
                                : 'text-zinc-500 hover:bg-pink-950/30 hover:text-pink-100'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ),
                      )}

                      <button
                        type="button"
                        disabled={
                          page >=
                          pagination.totalPages
                        }
                        onClick={() =>
                          goToPage(
                            page + 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-white/20 text-zinc-500 transition hover:border-pink-300/30 hover:bg-pink-950/30 hover:text-pink-100 disabled:pointer-events-none disabled:opacity-30"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkItems