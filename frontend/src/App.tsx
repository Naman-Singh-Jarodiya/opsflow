import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import {
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query'

import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import CreateWorkItem from './pages/CreateWorkItem'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import MyWork from './pages/MyWork'
import Signup from './pages/Signup'
import Teams from './pages/Teams'
import WorkItemDetail from './pages/WorkItemDetail'
import WorkItems from './pages/WorkItems'

function ApiThemeController() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  const isApiLoading =
    isFetching > 0 || isMutating > 0

  useEffect(() => {
    document.body.classList.toggle(
      'opsflow-api-loading',
      isApiLoading,
    )

    return () => {
      document.body.classList.remove(
        'opsflow-api-loading',
      )
    }
  }, [isApiLoading])

  return null
}

function App() {
  return (
    <AuthProvider>
      <ApiThemeController />

      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                index
                element={<Dashboard />}
              />

              <Route
                path="/my-work"
                element={<MyWork />}
              />

              <Route
                path="/work-items"
                element={<WorkItems />}
              />

              <Route
                path="/work-items/new"
                element={<CreateWorkItem />}
              />

              <Route
                path="/work-items/:id"
                element={<WorkItemDetail />}
              />

              <Route
                path="/teams"
                element={<Teams />}
              />

              <Route
                path="/teams/:id"
                element={<Teams />}
              />

              <Route
                path="/settings"
                element={
                  <div className="opsflow-page min-h-full p-8 text-white">
                    <div className="opsflow-panel max-w-3xl p-6">
                      <h1 className="text-2xl font-semibold">
                        Settings
                      </h1>

                      <p className="mt-2 text-sm text-zinc-400">
                        Workspace settings will be available here.
                      </p>
                    </div>
                  </div>
                }
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App