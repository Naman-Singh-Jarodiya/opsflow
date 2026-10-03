import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquare,
  UserRound,
} from 'lucide-react'

type Status = 'Open' | 'In Progress' | 'Blocked' | 'Resolved' | 'Closed'
type Priority = 'Low' | 'Medium' | 'High' | 'Urgent'

type Activity = {
  id: number
  text: string
  time: string
  type: 'system' | 'user'
}

const transitions: Record<Status, Status[]> = {
  Open: ['In Progress', 'Blocked'],
  'In Progress': ['Blocked', 'Resolved'],
  Blocked: ['In Progress'],
  Resolved: ['Closed'],
  Closed: [],
}

const assignees = [
  'Rahul Kumar',
  'Ananya Sharma',
  'Manisha Pandey',
  'Vivek Singh',
]

export default function WorkItemDetail() {
  const { id } = useParams()

  const [status, setStatus] = useState<Status>('In Progress')
  const [priority, setPriority] = useState<Priority>('Urgent')
  const [assignee, setAssignee] = useState('Rahul Kumar')
  const [comment, setComment] = useState('')

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      text: 'Rahul Kumar assigned this work item to himself',
      time: '10 minutes ago',
      type: 'user',
    },
    {
      id: 2,
      text: 'Status changed from Open to In Progress',
      time: '18 minutes ago',
      type: 'system',
    },
    {
      id: 3,
      text: 'Priority changed from High to Urgent',
      time: '25 minutes ago',
      type: 'system',
    },
    {
      id: 4,
      text: 'Work item created',
      time: '32 minutes ago',
      type: 'system',
    },
  ])

  const addActivity = (text: string) => {
    setActivities((current) => [
      {
        id: Date.now(),
        text,
        time: 'Just now',
        type: 'system',
      },
      ...current,
    ])
  }

  const handleStatusChange = (nextStatus: Status) => {
    if (nextStatus === status) return

    if (!transitions[status].includes(nextStatus)) {
      return
    }

    const previous = status
    setStatus(nextStatus)
    addActivity(`Status changed from ${previous} to ${nextStatus}`)
  }

  const handlePriorityChange = (nextPriority: Priority) => {
    if (nextPriority === priority) return

    const previous = priority
    setPriority(nextPriority)
    addActivity(`Priority changed from ${previous} to ${nextPriority}`)
  }

  const handleAssigneeChange = (nextAssignee: string) => {
    if (nextAssignee === assignee) return

    const previous = assignee
    setAssignee(nextAssignee)
    addActivity(`Assignee changed from ${previous} to ${nextAssignee}`)
  }

  const handleComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = comment.trim()

    if (!value) return

    setActivities((current) => [
      {
        id: Date.now(),
        text: `You commented: "${value}"`,
        time: 'Just now',
        type: 'user',
      },
      ...current,
    ])

    setComment('')
  }

  const statusColor: Record<Status, string> = {
    Open: 'bg-zinc-800 text-zinc-300',
    'In Progress': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Blocked: 'bg-red-500/10 text-red-400 border border-red-500/20',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Closed: 'bg-zinc-800 text-zinc-500',
  }

  const priorityColor: Record<Priority, string> = {
    Low: 'text-zinc-400',
    Medium: 'text-blue-400',
    High: 'text-violet-400',
    Urgent: 'text-red-400',
  }

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-6">
        <Link
          to="/work-items"
          className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work Items
        </Link>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-500">#{id ?? '1042'}</span>

              <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${statusColor[status]}`}>
                {status}
              </span>

              <span className={`text-xs font-semibold ${priorityColor[priority]}`}>
                {priority} priority
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              Payment gateway timeout investigation
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
              Investigate intermittent payment gateway timeouts affecting customer checkout
              requests and determine the root cause.
            </p>
          </div>

          <button
            onClick={() => {
              const next = status === 'Closed' ? 'Open' : 'Closed'
              if (next === 'Closed' && status !== 'Resolved') {
                handleStatusChange('Resolved')
              } else {
                handleStatusChange(next)
              }
            }}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            {status === 'Closed' ? 'Reopen' : 'Update status'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-800/80 bg-[#0d0d10]">
            <div className="border-b border-zinc-800/80 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">Work details</h2>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-zinc-500">Status</p>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value as Status)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-600"
                >
                  {(['Open', 'In Progress', 'Blocked', 'Resolved', 'Closed'] as Status[]).map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                        disabled={item !== status && !transitions[status].includes(item)}
                      >
                        {item}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs text-zinc-500">Priority</p>
                <select
                  value={priority}
                  onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-600"
                >
                  {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs text-zinc-500">Team</p>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300">
                  Payments
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs text-zinc-500">Created</p>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300">
                  <CalendarDays className="h-4 w-4 text-zinc-500" />
                  October 3, 2026
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-800/80 bg-[#0d0d10]">
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-zinc-500" />
                <h2 className="text-sm font-semibold text-white">Activity</h2>
              </div>

              <span className="text-xs text-zinc-600">
                {activities.length} events
              </span>
            </div>

            <div className="divide-y divide-zinc-800/70">
              {activities.map((item) => (
                <div key={item.id} className="flex gap-4 px-5 py-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                    {item.type === 'user' ? (
                      <UserRound className="h-3.5 w-3.5 text-zinc-400" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm leading-6 text-zinc-300">{item.text}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
                      <Clock3 className="h-3 w-3" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleComment} className="border-t border-zinc-800/80 p-5">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add comment
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-zinc-800/80 bg-[#0d0d10] p-5">
            <h2 className="text-sm font-semibold text-white">Assignment</h2>

            <div className="mt-4">
              <label className="mb-2 block text-xs text-zinc-500">Assignee</label>

              <select
                value={assignee}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-600"
              >
                {assignees.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-zinc-800/80 pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
                {assignee
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-200">{assignee}</p>
                <p className="text-xs text-zinc-600">Payments team</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-800/80 bg-[#0d0d10] p-5">
            <h2 className="text-sm font-semibold text-white">Workflow</h2>

            <div className="mt-4 space-y-2">
              {(['Open', 'In Progress', 'Blocked', 'Resolved', 'Closed'] as Status[]).map(
                (item) => {
                  const active = item === status
                  const allowed = item === status || transitions[status].includes(item)

                  return (
                    <button
                      key={item}
                      disabled={!allowed}
                      onClick={() => handleStatusChange(item)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? 'bg-zinc-800 text-white'
                          : allowed
                            ? 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                            : 'cursor-not-allowed text-zinc-700'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          active ? 'bg-white' : 'bg-zinc-700'
                        }`}
                      />
                      {item}
                    </button>
                  )
                },
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
