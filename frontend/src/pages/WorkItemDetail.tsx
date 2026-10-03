import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  History,
  Loader2,
  Lock,
  Pencil,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  changeWorkItemStatus,
  deleteWorkItem,
  getWorkItem,
  updateWorkItem,
  type WorkItemPriority,
  type WorkItemStatus,
} from '../lib/api'

const statusOptions: WorkItemStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'BLOCKED',
  'RESOLVED',
  'CLOSED',
]

const priorityOptions: WorkItemPriority[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
]

function formatDate(
  value: string | null | undefined,
) {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(value))
}

function initials(name?: string) {
  if (!name) return '?'

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function statusStyle(
  status: WorkItemStatus,
) {
  switch (status) {
    case 'OPEN':
      return 'border-sky-400/20 bg-sky-400/10 text-sky-300'
    case 'IN_PROGRESS':
      return 'border-violet-400/20 bg-violet-400/10 text-violet-300'
    case 'BLOCKED':
      return 'border-rose-400/20 bg-rose-400/10 text-rose-300'
    case 'RESOLVED':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
    default:
      return 'border-zinc-700 bg-zinc-800/70 text-zinc-300'
  }
}

function priorityStyle(
  priority: WorkItemPriority,
) {
  switch (priority) {
    case 'URGENT':
      return 'border-red-400/20 bg-red-400/10 text-red-300'
    case 'HIGH':
      return 'border-orange-400/20 bg-orange-400/10 text-orange-300'
    case 'MEDIUM':
      return 'border-yellow-400/20 bg-yellow-400/10 text-yellow-300'
    default:
      return 'border-zinc-700 bg-zinc-800/70 text-zinc-400'
  }
}

function activityLabel(type: string) {
  switch (type) {
    case 'CREATED':
      return 'created this work item'
    case 'UPDATED':
      return 'updated the work item'
    case 'ASSIGNED':
      return 'changed ownership'
    case 'STATUS_CHANGED':
      return 'changed the workflow status'
    case 'COMMENTED':
      return 'added a comment'
    case 'DELETED':
      return 'deleted the work item'
    default:
      return 'changed the work item'
  }
}

function WorkItemDetail() {
  const { id } = useParams<{
    id: string
  }>()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [editing, setEditing] =
    useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')
  const [priority, setPriority] =
    useState<WorkItemPriority>('MEDIUM')
  const [dueDate, setDueDate] =
    useState('')

  const [selectedStatus, setSelectedStatus] =
    useState<WorkItemStatus>('OPEN')

  const [actionError, setActionError] =
    useState('')

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['work-item', id],
    queryFn: () => getWorkItem(id!),
    enabled: Boolean(id),
  })

  const item = data?.workItem

  useEffect(() => {
    if (!item) return

    setTitle(item.title)
    setDescription(
      item.description ?? '',
    )
    setPriority(item.priority)
    setDueDate(
      item.dueDate
        ? item.dueDate.slice(0, 10)
        : '',
    )
    setSelectedStatus(item.status)
  }, [item])

  const updateMutation = useMutation({
    mutationFn: () =>
      updateWorkItem(item!.id, {
        title: title.trim(),
        description:
          description.trim(),
        priority,
        dueDate:
          dueDate || null,
        version: item!.version,
      }),
    onSuccess: async () => {
      setEditing(false)
      setActionError('')

      await queryClient.invalidateQueries({
        queryKey: ['work-item', id],
      })

      await queryClient.invalidateQueries({
        queryKey: ['work-items'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      })
    },
    onError: (mutationError) => {
      setActionError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to update this work item.',
      )
    },
  })

  const statusMutation = useMutation({
    mutationFn: () =>
      changeWorkItemStatus(
        item!.id,
        selectedStatus,
        item!.version,
      ),
    onSuccess: async () => {
      setActionError('')

      await queryClient.invalidateQueries({
        queryKey: ['work-item', id],
      })

      await queryClient.invalidateQueries({
        queryKey: ['work-items'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      })
    },
    onError: (mutationError) => {
      setActionError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to change status.',
      )

      setSelectedStatus(
        item?.status ?? 'OPEN',
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteWorkItem(item!.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['work-items'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      })

      navigate('/work-items')
    },
    onError: (mutationError) => {
      setActionError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to delete this work item.',
      )
      setShowDeleteConfirm(false)
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#09090b] text-zinc-500">
        <div className="flex items-center gap-3 text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading work item...
        </div>
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#09090b] px-6 text-center text-white">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10">
          <AlertCircle className="h-5 w-5 text-rose-300" />
        </div>

        <h1 className="text-lg font-semibold">
          Work item unavailable
        </h1>

        <p className="mt-2 max-w-md text-sm text-zinc-500">
          {error instanceof Error
            ? error.message
            : 'The work item may have been deleted or you may not have access to it.'}
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-300 hover:bg-white/[0.07]"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>

          <Link
            to="/work-items"
            className="inline-flex h-9 items-center rounded-lg bg-white px-4 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
          >
            Back to work
          </Link>
        </div>
      </div>
    )
  }

  const hasStatusChange =
    selectedStatus !== item.status

  const activities =
    item.activities ?? []

  return (
    <div className="min-h-full bg-[#09090b] px-5 py-6 text-white sm:px-8 sm:py-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/work-items"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All work items
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Lock className="h-3.5 w-3.5" />
            Version {item.version}
          </div>
        </div>

        {actionError && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-300" />
              <div>
                <p className="text-sm font-medium text-amber-200">
                  Update could not be applied
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-200/60">
                  {actionError}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setActionError('')
              }
              className="text-zinc-600 hover:text-white"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <main className="space-y-5">
            <section className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 shadow-2xl shadow-black/20 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${statusStyle(item.status)}`}
                >
                  {item.status.replace(
                    '_',
                    ' ',
                  )}
                </span>

                <span
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium ${priorityStyle(item.priority)}`}
                >
                  {item.priority}
                </span>

                <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-xs text-zinc-500">
                  {item.team.name}
                </span>
              </div>

              {editing ? (
                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  maxLength={200}
                  className="w-full rounded-lg border border-white/10 bg-[#0b0b0d] px-4 py-3 text-xl font-semibold text-white outline-none focus:border-white/20"
                />
              ) : (
                <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {item.title}
                </h1>
              )}

              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Description
                  </p>

                  {!editing && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditing(true)
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                </div>

                {editing ? (
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    rows={7}
                    className="w-full resize-none rounded-lg border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm leading-6 text-zinc-300 outline-none focus:border-white/20"
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                    {item.description ||
                      'No description provided.'}
                  </p>
                )}
              </div>

              {editing && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs text-zinc-600">
                      Priority
                    </label>

                    <select
                      value={priority}
                      onChange={(event) =>
                        setPriority(
                          event.target
                            .value as WorkItemPriority,
                        )
                      }
                      className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0d] px-3 text-sm text-zinc-300 outline-none"
                    >
                      {priorityOptions.map(
                        (value) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {value}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-zinc-600">
                      Due date
                    </label>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) =>
                        setDueDate(
                          event.target.value,
                        )
                      }
                      className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0d] px-3 text-sm text-zinc-300 outline-none"
                    />
                  </div>
                </div>
              )}

              {editing && (
                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      setTitle(item.title)
                      setDescription(
                        item.description ??
                          '',
                      )
                      setPriority(
                        item.priority,
                      )
                      setDueDate(
                        item.dueDate
                          ? item.dueDate.slice(
                              0,
                              10,
                            )
                          : '',
                      )
                    }}
                    className="h-9 rounded-lg border border-white/10 px-4 text-sm text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      updateMutation.isPending ||
                      !title.trim()
                    }
                    onClick={() =>
                      updateMutation.mutate()
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 disabled:opacity-50"
                  >
                    {updateMutation.isPending && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Save changes
                  </button>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Workflow
                  </p>
                  <h2 className="mt-1 text-base font-semibold">
                    Move this work forward
                  </h2>
                </div>

                <Zap className="h-5 w-5 text-zinc-700" />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target
                        .value as WorkItemStatus,
                    )
                  }
                  className="h-10 flex-1 rounded-lg border border-white/10 bg-[#0b0b0d] px-3 text-sm text-zinc-300 outline-none"
                >
                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status.replace(
                          '_',
                          ' ',
                        )}
                      </option>
                    ),
                  )}
                </select>

                <button
                  type="button"
                  disabled={
                    !hasStatusChange ||
                    statusMutation.isPending
                  }
                  onClick={() =>
                    statusMutation.mutate()
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 disabled:pointer-events-none disabled:opacity-40"
                >
                  {statusMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Apply status
                </button>
              </div>

              <p className="mt-3 text-xs leading-5 text-zinc-600">
                Invalid workflow transitions
                are rejected by the server.
                This prevents inconsistent state
                even if multiple users act at
                once.
              </p>
            </section>

            <section className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                  <History className="h-4 w-4 text-zinc-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Audit trail
                  </p>
                  <h2 className="mt-1 text-base font-semibold">
                    Activity history
                  </h2>
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="mt-7 rounded-xl border border-dashed border-white/[0.08] p-7 text-center">
                  <Clock3 className="mx-auto h-5 w-5 text-zinc-700" />
                  <p className="mt-3 text-sm text-zinc-600">
                    No activity recorded yet.
                  </p>
                </div>
              ) : (
                <div className="mt-7 space-y-6">
                  {activities.map(
                    (activity) => (
                      <div
                        key={activity.id}
                        className="relative flex gap-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.035] text-[10px] font-semibold text-zinc-400">
                          {initials(
                            activity.user
                              ?.name,
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-zinc-400">
                            <span className="font-medium text-zinc-200">
                              {activity.user
                                ?.name ??
                                'System'}
                            </span>{' '}
                            {activityLabel(
                              activity.type,
                            )}
                          </p>

                          <p className="mt-1 text-xs text-zinc-700">
                            {formatDate(
                              activity.createdAt,
                            )}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-white/[0.07] bg-[#101012] p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Ownership
                </p>

                <UserRound className="h-4 w-4 text-zinc-700" />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.07] text-xs font-semibold text-zinc-300">
                  {initials(
                    item.assignee?.name,
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {item.assignee?.name ??
                      'Unassigned'}
                  </p>

                  <p className="truncate text-xs text-zinc-600">
                    {item.assignee?.email ??
                      'No owner assigned'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.07] bg-[#101012] p-5">
              <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Details
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    Team
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {item.team.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    Created by
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {item.createdBy?.name ??
                      'Unknown'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    Created
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {formatDate(
                      item.createdAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    Last updated
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {formatDate(
                      item.updatedAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    Due date
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                    <CalendarDays className="h-3.5 w-3.5 text-zinc-600" />
                    {item.dueDate
                      ? formatDate(
                          item.dueDate,
                        )
                      : 'No due date'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-300/50">
                Danger zone
              </p>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Deleting a work item is a
                soft-delete operation. Its activity
                history remains available to the
                system.
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteConfirm(
                      true,
                    )
                  }
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-red-400/15 px-3 text-xs font-medium text-red-300/80 hover:bg-red-400/[0.06] hover:text-red-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete work item
                </button>
              ) : (
                <div className="mt-4">
                  <p className="text-xs font-medium text-red-200">
                    Delete this work item?
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowDeleteConfirm(
                          false,
                        )
                      }
                      className="h-8 rounded-md border border-white/10 px-3 text-xs text-zinc-500 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={
                        deleteMutation.isPending
                      }
                      onClick={() =>
                        deleteMutation.mutate()
                      }
                      className="inline-flex h-8 items-center gap-2 rounded-md bg-red-500/10 px-3 text-xs font-medium text-red-300 hover:bg-red-500/15 disabled:opacity-50"
                    >
                      {deleteMutation.isPending && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      Confirm delete
                    </button>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default WorkItemDetail