const API_BASE_URL = 'http://localhost:3001/api'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Announcements
  async getAnnouncements(filters?: { type?: string; isActive?: boolean }) {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    
    return this.request(`/announcements?${params.toString()}`)
  }

  async createAnnouncement(data: any, adminToken: string) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify({ ...data, adminToken }),
    })
  }

  // Notes
  async getNotes(filters?: { subject?: string; semester?: number; branch?: string; noteType?: string }) {
    const params = new URLSearchParams()
    if (filters?.subject) params.append('subject', filters.subject)
    if (filters?.semester) params.append('semester', filters.semester.toString())
    if (filters?.branch) params.append('branch', filters.branch)
    if (filters?.noteType) params.append('noteType', filters.noteType)
    
    return this.request(`/notes?${params.toString()}`)
  }

  async uploadNote(formData: FormData) {
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json())
  }

  // PYQs
  async getPYQs(filters?: { subject?: string; year?: number; semester?: number; branch?: string; examType?: string }) {
    const params = new URLSearchParams()
    if (filters?.subject) params.append('subject', filters.subject)
    if (filters?.year) params.append('year', filters.year.toString())
    if (filters?.semester) params.append('semester', filters.semester.toString())
    if (filters?.branch) params.append('branch', filters.branch)
    if (filters?.examType) params.append('examType', filters.examType)
    
    return this.request(`/pyqs?${params.toString()}`)
  }

  // Timetables
  async getTimetables(branch?: string, semester?: number) {
    const params = new URLSearchParams()
    if (branch) params.append('branch', branch)
    if (semester) params.append('semester', semester.toString())
    
    return this.request(`/timetables?${params.toString()}`)
  }

  // Admin
  async verifyAdmin(idToken: string) {
    return this.request('/auth/verify-admin', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    })
  }

  async createAdminUser(data: any) {
    return this.request('/admin/create-user', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()