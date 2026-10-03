const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:4000/api'

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'MEMBER'
}

export interface LoginResponse {
  success: true
  message: string
  token: string
  user: AuthUser
}

export interface RegisterResponse {
  success: true
  message: string
  user: AuthUser & {
    createdAt: string
  }
}

export interface MeResponse {
  success: true
  user: AuthUser
}

export interface DashboardStats {
  totalWorkItems: number
  openWorkItems: number
  inProgressWorkItems: number
  urgentWorkItems: number
}

export interface DashboardWorkItem {
  id: string
  title: string
  status: string
  priority: string
  team: {
    id: string
    name: string
  }
  assignee: {
    id: string
    name: string
  } | null
  updatedAt: string
}

export interface DashboardActivity {
  id: string
  type: string
  createdAt: string
  user: {
    id: string
    name: string
  }
  workItem: {
    id: string
    title: string
  } | null
}

export interface DashboardResponse {
  success: true
  stats: DashboardStats
  attentionItems: DashboardWorkItem[]
  recentActivity: DashboardActivity[]
}

export type WorkItemStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'RESOLVED'
  | 'CLOSED'

export type WorkItemPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'

export interface WorkItemUser {
  id: string
  name: string
  email?: string
}

export interface WorkItemTeam {
  id: string
  name: string
}

export interface WorkItemActivity {
  id: string
  type: string
  message: string
  createdAt: string
  user: WorkItemUser
  metadata?: unknown
}

export interface WorkItemComment {
  id: string
  content: string
  createdAt: string
  author: WorkItemUser
}

export interface WorkItem {
  id: string
  title: string
  description: string | null
  status: WorkItemStatus
  priority: WorkItemPriority
  team: WorkItemTeam
  assignee: WorkItemUser | null
  createdBy: WorkItemUser
  assignedBy: WorkItemUser | null
  dueDate: string | null
  version: number
  createdAt: string
  updatedAt: string
  comments?: WorkItemComment[]
  activities?: WorkItemActivity[]
}

export interface WorkItemListResponse {
  success: true
  items: WorkItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface WorkItemResponse {
  success: true
  workItem: WorkItem
}

export interface WorkItemFilters {
  search?: string
  status?: WorkItemStatus
  priority?: WorkItemPriority
  assigneeId?: string
  teamId?: string
  page?: number
  limit?: number
}

export interface Team {
  id: string
  name: string
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface TeamsResponse {
  success: true
  teams: Team[]
}

export interface TeamResponse {
  success: true
  team: Team
}

function createIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export async function apiRequest<T extends object>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('opsflow_token')

  const headers = new Headers(options.headers)

  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (
    options.method &&
    ['POST', 'DELETE'].includes(options.method.toUpperCase())
  ) {
    headers.set('Idempotency-Key', createIdempotencyKey())
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    },
  )

  const contentType =
    response.headers.get('content-type') ?? ''

  const data =
    contentType.includes('application/json')
      ? ((await response.json()) as T | ApiError)
      : null

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem('opsflow_token')
      localStorage.removeItem('opsflow_user')
    }

    const message =
      data &&
      typeof data === 'object' &&
      'message' in data
        ? data.message
        : 'Something went wrong'

    throw new Error(message)
  }

  return data as T
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    },
  )
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    },
  )
}

export async function getCurrentUser(): Promise<MeResponse> {
  return apiRequest<MeResponse>(
    '/auth/me',
  )
}

export async function getDashboard(): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>(
    '/dashboard',
  )
}

export async function getWorkItems(
  filters: WorkItemFilters = {},
): Promise<WorkItemListResponse> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.priority) {
    params.set('priority', filters.priority)
  }

  if (filters.assigneeId) {
    params.set('assigneeId', filters.assigneeId)
  }

  if (filters.teamId) {
    params.set('teamId', filters.teamId)
  }

  if (filters.page !== undefined) {
    params.set('page', String(filters.page))
  }

  if (filters.limit !== undefined) {
    params.set('limit', String(filters.limit))
  }

  const query = params.toString()

  return apiRequest<WorkItemListResponse>(
    `/work-items${query ? `?${query}` : ''}`,
  )
}

export async function getWorkItem(
  id: string,
): Promise<WorkItemResponse> {
  return apiRequest<WorkItemResponse>(
    `/work-items/${id}`,
  )
}

export interface CreateWorkItemInput {
  title: string
  description?: string
  priority?: WorkItemPriority
  teamId: string
  assigneeId?: string
  dueDate?: string
}

export async function createWorkItem(
  input: CreateWorkItemInput,
): Promise<WorkItemResponse> {
  return apiRequest<WorkItemResponse>(
    '/work-items',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export interface UpdateWorkItemInput {
  title?: string
  description?: string
  priority?: WorkItemPriority
  teamId?: string
  dueDate?: string | null
  version: number
}

export async function updateWorkItem(
  id: string,
  input: UpdateWorkItemInput,
): Promise<WorkItemResponse> {
  return apiRequest<WorkItemResponse>(
    `/work-items/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  )
}

export async function assignWorkItem(
  id: string,
  assigneeId: string | null,
  version: number,
): Promise<WorkItemResponse> {
  return apiRequest<WorkItemResponse>(
    `/work-items/${id}/assign`,
    {
      method: 'POST',
      body: JSON.stringify({
        assigneeId,
        version,
      }),
    },
  )
}

export async function changeWorkItemStatus(
  id: string,
  status: WorkItemStatus,
  version: number,
): Promise<WorkItemResponse> {
  return apiRequest<WorkItemResponse>(
    `/work-items/${id}/status`,
    {
      method: 'POST',
      body: JSON.stringify({
        status,
        version,
      }),
    },
  )
}

export interface DeleteWorkItemResponse {
  success: true
  message: string
}

export async function deleteWorkItem(
  id: string,
): Promise<DeleteWorkItemResponse> {
  return apiRequest<DeleteWorkItemResponse>(
    `/work-items/${id}`,
    {
      method: 'DELETE',
    },
  )
}

export async function getTeams(): Promise<TeamsResponse> {
  return apiRequest<TeamsResponse>(
    '/teams',
  )
}

export async function getTeam(
  id: string,
): Promise<TeamResponse> {
  return apiRequest<TeamResponse>(
    `/teams/${id}`,
  )
}

export function logout() {
  localStorage.removeItem('opsflow_token')
  localStorage.removeItem('opsflow_user')
}