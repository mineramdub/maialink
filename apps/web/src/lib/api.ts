const API_URL = import.meta.env.VITE_API_URL

// Generic API fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || 'API error')
  }

  return response.json()
}

// ============================================
// PATIENTS API
// ============================================

export interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  email?: string
  phone?: string
  mobilePhone?: string
  city?: string
  status: string
  gravida: number
  para: number
}

export interface PatientsResponse {
  success: boolean
  patients: Patient[]
}

export const patientsApi = {
  list: (params?: { search?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return apiFetch<PatientsResponse>(`/api/patients${query ? `?${query}` : ''}`)
  },

  get: (id: string) => apiFetch<{ success: boolean; patient: any }>(`/api/patients/${id}`),

  create: (data: any) => apiFetch<{ success: boolean; patient: Patient }>(
    '/api/patients',
    { method: 'POST', body: JSON.stringify(data) }
  ),

  update: (id: string, data: any) => apiFetch<{ success: boolean; patient: Patient }>(
    `/api/patients/${id}`,
    { method: 'PUT', body: JSON.stringify(data) }
  ),

  delete: (id: string) => apiFetch<{ success: boolean }>(
    `/api/patients/${id}`,
    { method: 'DELETE' }
  ),
}

// ============================================
// GROSSESSES API
// ============================================

export interface Grossesse {
  id: string
  patientId: string
  ddr?: string
  dpa?: string
  terme?: string
  status: string
  patient?: Patient
}

export interface GrossessesResponse {
  success: boolean
  grossesses: Grossesse[]
}

export const grossessesApi = {
  list: (params?: { patientId?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.patientId) searchParams.set('patientId', params.patientId)
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return apiFetch<GrossessesResponse>(`/api/grossesses${query ? `?${query}` : ''}`)
  },

  get: (id: string) => apiFetch<{ success: boolean; grossesse: any }>(`/api/grossesses/${id}`),

  create: (data: any) => apiFetch<{ success: boolean; grossesse: Grossesse }>(
    '/api/grossesses',
    { method: 'POST', body: JSON.stringify(data) }
  ),

  update: (id: string, data: any) => apiFetch<{ success: boolean; grossesse: Grossesse }>(
    `/api/grossesses/${id}`,
    { method: 'PATCH', body: JSON.stringify(data) }
  ),
}

// ============================================
// CONSULTATIONS API
// ============================================

export interface Consultation {
  id: string
  patientId: string
  grossesseId?: string
  type: string
  date: string
  patient?: Patient
}

export interface ConsultationsResponse {
  success: boolean
  consultations: Consultation[]
}

export const consultationsApi = {
  list: (params?: { patientId?: string; grossesseId?: string; type?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.patientId) searchParams.set('patientId', params.patientId)
    if (params?.grossesseId) searchParams.set('grossesseId', params.grossesseId)
    if (params?.type) searchParams.set('type', params.type)
    const query = searchParams.toString()
    return apiFetch<ConsultationsResponse>(`/api/consultations${query ? `?${query}` : ''}`)
  },

  get: (id: string) => apiFetch<{ success: boolean; consultation: any }>(`/api/consultations/${id}`),

  create: (data: any) => apiFetch<{ success: boolean; consultation: Consultation }>(
    '/api/consultations',
    { method: 'POST', body: JSON.stringify(data) }
  ),

  update: (id: string, data: any) => apiFetch<{ success: boolean; consultation: Consultation }>(
    `/api/consultations/${id}`,
    { method: 'PATCH', body: JSON.stringify(data) }
  ),
}

// ============================================
// INVOICES API
// ============================================

export interface Invoice {
  id: string
  numero: string
  patientId: string
  date: string
  montantTTC: string
  status: string
  patient?: Patient
  cotations?: any[]
}

export interface InvoicesResponse {
  success: boolean
  invoices: Invoice[]
  stats?: any
}

export const invoicesApi = {
  list: (params?: { patientId?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.patientId) searchParams.set('patientId', params.patientId)
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return apiFetch<InvoicesResponse>(`/api/invoices${query ? `?${query}` : ''}`)
  },

  get: (id: string) => apiFetch<{ success: boolean; invoice: any }>(`/api/invoices/${id}`),

  create: (data: any) => apiFetch<{ success: boolean; invoice: Invoice }>(
    '/api/invoices',
    { method: 'POST', body: JSON.stringify(data) }
  ),

  update: (id: string, data: any) => apiFetch<{ success: boolean; invoice: Invoice }>(
    `/api/invoices/${id}`,
    { method: 'PATCH', body: JSON.stringify(data) }
  ),
}

// ============================================
// APPOINTMENTS API
// ============================================

export interface Appointment {
  id: string
  patientId: string
  title: string
  type: string
  startTime: string
  endTime: string
  status: string
  location?: string
  isHomeVisit?: boolean
  notes?: string
  patient?: Patient
}

export interface AppointmentsResponse {
  success: boolean
  appointments: Appointment[]
}

export const appointmentsApi = {
  list: (params?: { patientId?: string; startDate?: string; endDate?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.patientId) searchParams.set('patientId', params.patientId)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return apiFetch<AppointmentsResponse>(`/api/appointments${query ? `?${query}` : ''}`)
  },

  get: (id: string) => apiFetch<{ success: boolean; appointment: Appointment }>(`/api/appointments/${id}`),

  create: (data: any) => apiFetch<{ success: boolean; appointment: Appointment }>(
    '/api/appointments',
    { method: 'POST', body: JSON.stringify(data) }
  ),

  update: (id: string, data: any) => apiFetch<{ success: boolean; appointment: Appointment }>(
    `/api/appointments/${id}`,
    { method: 'PATCH', body: JSON.stringify(data) }
  ),

  delete: (id: string) => apiFetch<{ success: boolean }>(
    `/api/appointments/${id}`,
    { method: 'DELETE' }
  ),
}

// ============================================
// DASHBOARD API
// ============================================

export const dashboardApi = {
  getStats: () => apiFetch<{ success: boolean; stats: any }>('/api/dashboard'),
}
