import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './layouts/AppLayout'
import CreateWorkItem from './pages/CreateWorkItem'
import Dashboard from './pages/Dashboard'
import MyWork from './pages/MyWork'
import Teams from './pages/Teams'
import WorkItemDetail from './pages/WorkItemDetail'
import WorkItems from './pages/WorkItems'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="/my-work" element={<MyWork />} />

          <Route path="/work-items" element={<WorkItems />} />

          <Route
            path="/work-items/new"
            element={<CreateWorkItem />}
          />

          <Route
            path="/work-items/:id"
            element={<WorkItemDetail />}
          />

          <Route path="/teams" element={<Teams />} />

          <Route
            path="/teams/:id"
            element={<Teams />}
          />

          <Route
            path="/settings"
            element={
              <div className="min-h-full bg-[#09090b] p-8 text-white">
                <h1 className="text-2xl font-semibold">
                  Settings
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Workspace settings will be available here.
                </p>
              </div>
            }
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App