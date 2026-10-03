import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, CalendarDays, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

type Priority = 'Low' | 'Medium' | 'High' | 'Urgent'
type Status = 'Open' | 'In Progress' | 'Blocked'

export default function CreateWorkItem() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [team, setTeam] = useState('Operations')
  const [assignee, setAssignee] = useState('Rahul Kumar')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [status, setStatus] = useState<Status>('Open')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Work item title is required.')
      return
    }

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters.')
      return
    }

    setError('')
    navigate('/work-items')
  }

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(99,102,241,0.10),transparent_35%)]">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
        <Link
          to="/work-items"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work Items
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Create Work Item
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Create a new operational task and assign responsibility.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d10]/90 shadow-2xl shadow-black/20">
            <div className="border-b border-zinc-800/80 p-6">
              <h2 className="text-sm font-semibold text-white">
                Work item details
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Provide enough context so the team understands what needs to be done.
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Title <span className="text-zinc-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Investigate payment gateway timeout"
                  className="h-11 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-2 focus:ring-white/5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, context, expected outcome, or any relevant details..."
                  rows={6}
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-2 focus:ring-white/5"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Team"
                  value={team}
                  onChange={setTeam}
                  options={['Operations', 'Payments', 'Support', 'Procurement']}
                />

                <SelectField
                  label="Assignee"
                  value={assignee}
                  onChange={setAssignee}
                  options={[
                    'Rahul Kumar',
                    'Ananya Sharma',
                    'Manisha Pandey',
                    'Vivek Singh',
                  ]}
                />

                <SelectField
                  label="Priority"
                  value={priority}
                  onChange={(value) => setPriority(value as Priority)}
                  options={['Low', 'Medium', 'High', 'Urgent']}
                />

                <SelectField
                  label="Status"
                  value={status}
                  onChange={(value) => setStatus(value as Status)}
                  options={['Open', 'In Progress', 'Blocked']}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Due date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-11 w-full rounded-lg border border-zinc-800 bg-[#09090b] pl-10 pr-4 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-white/5"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 p-6">
              <Link
                to="/work-items"
                className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Create Work Item
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

type SelectFieldProps = {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-zinc-800 bg-[#09090b] px-4 pr-10 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-white/5"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </div>
    </div>
  )
}
