import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Loader2,
  Save,
  ShieldCheck,
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
} from 'react-router-dom'

import {
  createWorkItem,
  getTeams,
  type WorkItemPriority,
} from '../lib/api'

const priorities: Array<{
  value: WorkItemPriority
  label: string
  description: string
}> = [
  {
    value: 'LOW',
    label: 'Low',
    description: 'Can wait',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    description: 'Normal attention',
  },
  {
    value: 'HIGH',
    label: 'High',
    description: 'Needs attention soon',
  },
  {
    value: 'URGENT',
    label: 'Urgent',
    description: 'Immediate attention',
  },
]

function CreateWorkItem() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')
  const [priority, setPriority] =
    useState<WorkItemPriority>('MEDIUM')
  const [teamId, setTeamId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [validationError, setValidationError] =
    useState('')

  const {
    data: teamsData,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (
      !teamId &&
      teamsData?.teams.length
    ) {
      setTeamId(teamsData.teams[0].id)
    }
  }, [teamsData, teamId])

  const mutation = useMutation({
    mutationFn: createWorkItem,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ['work-items'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      })

      navigate(
        `/work-items/${response.workItem.id}`,
      )
    },
  })

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setValidationError('')

    const cleanTitle = title.trim()
    const cleanDescription =
      description.trim()

    if (cleanTitle.length < 3) {
      setValidationError(
        'Title must contain at least 3 characters.',
      )
      return
    }

    if (!teamId) {
      setValidationError(
        'Select a team before creating the work item.',
      )
      return
    }

    mutation.mutate({
      title: cleanTitle,
      description:
        cleanDescription || undefined,
      priority,
      teamId,
      dueDate: dueDate || undefined,
    })
  }

  const errorMessage =
    validationError ||
    (mutation.error instanceof Error
      ? mutation.error.message
      : '')

  return (
    <div className="min-h-full bg-[#09090b] px-5 py-6 text-white sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/work-items"
          className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to work items
        </Link>

        <div className="mb-8">
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
            Operations / New item
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Create work item
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Capture the work clearly so the
            right team knows what needs to
            happen next.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101012] shadow-2xl shadow-black/20"
        >
          <div className="grid lg:grid-cols-[1fr_300px]">
            <div className="p-6 sm:p-8">
              <div className="space-y-7">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Title
                  </label>

                  <input
                    id="title"
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Resolve delayed payment reconciliation"
                    autoFocus
                    maxLength={200}
                    className="h-12 w-full rounded-lg border border-white/[0.08] bg-[#0b0b0d] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:ring-2 focus:ring-white/5"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-zinc-700">
                    <span>
                      Make the outcome
                      obvious.
                    </span>
                    <span>
                      {title.length}/200
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Explain why this work matters, relevant context, and what a successful outcome looks like..."
                    rows={7}
                    maxLength={5000}
                    className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0b0b0d] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:ring-2 focus:ring-white/5"
                  />

                  <div className="mt-2 text-right text-[11px] text-zinc-700">
                    {description.length}/5000
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="team"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Team
                  </label>

                  <select
                    id="team"
                    value={teamId}
                    onChange={(event) =>
                      setTeamId(
                        event.target.value,
                      )
                    }
                    disabled={teamsLoading}
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0b0b0d] px-3 text-sm text-zinc-200 outline-none focus:border-white/20 disabled:opacity-50"
                  >
                    <option value="">
                      {teamsLoading
                        ? 'Loading teams...'
                        : 'Select a team'}
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

                  {teamsError && (
                    <p className="mt-2 text-xs text-rose-400">
                      Unable to load your
                      teams.
                    </p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="priority"
                      className="mb-2 block text-sm font-medium text-zinc-200"
                    >
                      Priority
                    </label>

                    <select
                      id="priority"
                      value={priority}
                      onChange={(event) =>
                        setPriority(
                          event.target
                            .value as WorkItemPriority,
                        )
                      }
                      className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0b0b0d] px-3 text-sm text-zinc-200 outline-none focus:border-white/20"
                    >
                      {priorities.map(
                        (item) => (
                          <option
                            key={
                              item.value
                            }
                            value={
                              item.value
                            }
                          >
                            {item.label} —{' '}
                            {
                              item.description
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="dueDate"
                      className="mb-2 block text-sm font-medium text-zinc-200"
                    >
                      Due date
                    </label>

                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                      <input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(event) =>
                          setDueDate(
                            event.target
                              .value,
                          )
                        }
                        className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0b0b0d] pl-10 pr-3 text-sm text-zinc-200 outline-none focus:border-white/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="border-t border-white/[0.07] bg-white/[0.015] p-6 lg:border-l lg:border-t-0">
              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />

                <h3 className="mt-3 text-sm font-semibold text-zinc-100">
                  Operationally visible
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Every important work item
                  change is recorded in the
                  activity history so ownership
                  and workflow changes remain
                  understandable.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    Initial state
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Open
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    Workflow
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Open → In Progress →
                    Blocked / Resolved →
                    Closed
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {errorMessage && (
            <div className="border-t border-rose-400/10 bg-rose-400/[0.04] px-6 py-4 sm:px-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                <p className="text-sm text-rose-200">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            <Link
              to="/work-items"
              className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-zinc-500 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                mutation.isPending ||
                teamsLoading
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {mutation.isPending
                ? 'Creating...'
                : 'Create work item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateWorkItem