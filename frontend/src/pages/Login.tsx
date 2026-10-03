import {
  useState,
  type FormEvent,
} from 'react'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()

  const {
    login,
  } = useAuth()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState('')

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')

    if (!email.trim()) {
      setError(
        'Please enter your email address.',
      )
      return
    }

    if (!password) {
      setError(
        'Please enter your password.',
      )
      return
    }

    setIsSubmitting(true)

    try {
      await login(
        email.trim(),
        password,
      )

      navigate('/', {
        replace: true,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute right-[-120px] top-[20%] h-[460px] w-[460px] rounded-full bg-violet-600/12 blur-[140px]" />
        <div className="absolute bottom-[-180px] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full overflow-hidden rounded-[32px] border-2 border-white/15 bg-white/[0.025] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden min-h-[700px] flex-col justify-between border-r-2 border-white/10 p-10 lg:flex xl:p-14">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/10">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    OpsFlow
                  </p>

                  <p className="text-xs text-zinc-500">
                    Operations workspace
                  </p>
                </div>
              </div>

              <div className="mt-24 max-w-xl">
                <p className="mb-5 text-sm font-medium text-indigo-300">
                  OPERATIONS UNDER PRESSURE
                </p>

                <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] xl:text-6xl">
                  Keep important work moving.
                </h1>

                <p className="mt-7 max-w-lg text-base leading-7 text-zinc-400">
                  Coordinate work, ownership,
                  priorities and operational history
                  from one reliable workspace.
                </p>
              </div>

              <div className="mt-12 grid max-w-xl gap-3 sm:grid-cols-2">
                {[
                  'Clear ownership',
                  'Controlled workflows',
                  'Complete activity history',
                  'Concurrent-safe updates',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-300" />
                    <span className="text-sm text-zinc-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <ShieldCheck className="h-4 w-4" />
              Internal operations platform
            </div>
          </section>

          <section className="flex min-h-[700px] items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-10 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <span className="text-lg font-semibold">
                    OpsFlow
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-indigo-300">
                  WELCOME BACK
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Sign in to OpsFlow
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Access your operational workspace
                  and continue where you left off.
                </p>
              </div>

              {error && (
                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />

                  <p className="text-sm leading-5 text-red-200">
                    {error}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value,
                        )
                      }
                      placeholder="you@company.com"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-400/50 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-400/50 focus:bg-white/[0.05]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value,
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/5 hover:text-zinc-300"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-zinc-500" />

                <p className="text-xs leading-5 text-zinc-600">
                  Your session is protected by
                  server-side JWT authentication.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Login