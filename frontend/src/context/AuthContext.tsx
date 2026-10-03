import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  type AuthUser,
} from '../lib/api'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<void>
  logout: () => void
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  )

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(() => {
      const storedUser =
        localStorage.getItem('opsflow_user')

      if (!storedUser) {
        return null
      }

      try {
        return JSON.parse(
          storedUser,
        ) as AuthUser
      } catch {
        localStorage.removeItem(
          'opsflow_user',
        )

        return null
      }
    })

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    const token =
      localStorage.getItem('opsflow_token')

    if (!token) {
      setIsLoading(false)
      return
    }

    getCurrentUser()
      .then((response) => {
        setUser(response.user)

        localStorage.setItem(
          'opsflow_user',
          JSON.stringify(response.user),
        )
      })
      .catch(() => {
        logoutRequest()
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const login = async (
    email: string,
    password: string,
  ) => {
    const response =
      await loginRequest(
        email,
        password,
      )

    localStorage.setItem(
      'opsflow_token',
      response.token,
    )

    localStorage.setItem(
      'opsflow_user',
      JSON.stringify(response.user),
    )

    setUser(response.user)
  }

  const logout = () => {
    logoutRequest()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [
      user,
      isLoading,
    ],
  )

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    )
  }

  return context
}