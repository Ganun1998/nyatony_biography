/**
 * Centralized API client for communicating with the backend
 * All calls go to http://localhost:5000/api
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Token helpers ─────────────────────────────────────────────────────────
export const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem('nyatony_admin_token') : null

export const setToken = (token: string) =>
  localStorage.setItem('nyatony_admin_token', token)

export const removeToken = () =>
  localStorage.removeItem('nyatony_admin_token')

// ── Base fetch wrapper ────────────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`)
  }

  return data as T
}

// ── Types ─────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface GuestbookEntry {
  _id: string
  name: string
  message: string
  emoji: string
  isApproved: boolean
  createdAt: string
}

export interface ContactMessage {
  _id: string
  name: string
  email: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface GalleryImage {
  _id: string
  title: string
  description?: string
  imageUrl: string
  category: string
  tags?: string[]
  isPublished: boolean
  order: number
  createdAt: string
}

export interface MusicTrack {
  _id: string
  title: string
  artist: string
  category: string
  artwork?: string
  src: string
  duration: string
  isPublished: boolean
  order: number
}

export interface VideoItem {
  _id: string
  title: string
  description?: string
  thumbnail?: string
  youtubeId?: string
  src?: string
  duration: string
  category: string
  isPublished: boolean
}

export interface DashboardStats {
  gallery: { total: number }
  guestbook: { total: number; pending: number }
  contact: { total: number; unread: number }
  music: { total: number }
  videos: { total: number }
}

// ── Auth API ──────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const data = await request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return data
  },

  me: async (): Promise<User> => {
    const data = await request<{ success: boolean; user: User }>('/auth/me')
    return data.user
  },
}

// ── Guestbook API ─────────────────────────────────────────────────────────
export const guestbookApi = {
  // Public: get approved messages
  getApproved: () =>
    request<ApiResponse<GuestbookEntry[]>>('/guestbook'),

  // Public: submit message
  submit: (payload: { name: string; message: string; emoji: string }) =>
    request<ApiResponse<{ id: string }>>('/guestbook', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Admin: get all messages
  getAll: () =>
    request<ApiResponse<GuestbookEntry[]>>('/admin/guestbook'),

  // Admin: approve
  approve: (id: string) =>
    request<ApiResponse<GuestbookEntry>>(`/admin/guestbook/${id}/approve`, { method: 'PATCH' }),

  // Admin: delete
  delete: (id: string) =>
    request<ApiResponse<null>>(`/admin/guestbook/${id}`, { method: 'DELETE' }),
}

// ── Contact API ───────────────────────────────────────────────────────────
export const contactApi = {
  send: (payload: { name: string; email: string; subject?: string; message: string }) =>
    request<ApiResponse<null>>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Admin
  getAll: () =>
    request<ApiResponse<ContactMessage[]>>('/admin/contact'),

  markRead: (id: string) =>
    request<ApiResponse<ContactMessage>>(`/admin/contact/${id}/read`, { method: 'PATCH' }),
}

// ── Gallery API ───────────────────────────────────────────────────────────
export const galleryApi = {
  getAll: (category?: string) =>
    request<ApiResponse<GalleryImage[]>>(`/gallery${category ? `?category=${category}` : ''}`),

  // Admin: upload image (multipart)
  upload: (formData: FormData) =>
    request<ApiResponse<GalleryImage>>('/admin/gallery', {
      method: 'POST',
      body: formData,
    }),

  update: (id: string, data: Partial<GalleryImage>) =>
    request<ApiResponse<GalleryImage>>(`/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<ApiResponse<null>>(`/admin/gallery/${id}`, { method: 'DELETE' }),

  // Download URL (used as href, not fetch)
  downloadUrl: (id: string) => `${BASE_URL.replace('/api', '')}/api/gallery/${id}/download`,
}

// ── Music API ─────────────────────────────────────────────────────────────
export const musicApi = {
  getAll: () =>
    request<ApiResponse<MusicTrack[]>>('/music'),

  // Admin: upload audio (multipart)
  upload: (formData: FormData) =>
    request<ApiResponse<MusicTrack>>('/admin/music', {
      method: 'POST',
      body: formData,
    }),

  update: (id: string, data: Partial<MusicTrack>) =>
    request<ApiResponse<MusicTrack>>(`/admin/music/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<ApiResponse<null>>(`/admin/music/${id}`, { method: 'DELETE' }),

  // Download URL (used as href)
  downloadUrl: (id: string) => `${BASE_URL.replace('/api', '')}/api/music/${id}/download`,

  // Stream URL for audio player
  streamUrl: (src: string) =>
    src.startsWith('/uploads') ? `${BASE_URL.replace('/api', '')}${src}` : src,
}

// ── Video API ─────────────────────────────────────────────────────────────
export const videoApi = {
  getAll: (category?: string) =>
    request<ApiResponse<VideoItem[]>>(`/videos${category ? `?category=${category}` : ''}`),

  // Admin: upload video file OR add YouTube link
  upload: (formData: FormData) =>
    request<ApiResponse<VideoItem>>('/admin/videos', {
      method: 'POST',
      body: formData,
    }),

  update: (id: string, data: Partial<VideoItem>) =>
    request<ApiResponse<VideoItem>>(`/admin/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<ApiResponse<null>>(`/admin/videos/${id}`, { method: 'DELETE' }),

  // Download URL (for non-YouTube videos)
  downloadUrl: (id: string) => `${BASE_URL.replace('/api', '')}/api/videos/${id}/download`,

  // Stream URL for video player
  streamUrl: (src: string) =>
    src.startsWith('/uploads') ? `${BASE_URL.replace('/api', '')}${src}` : src,
}

// ── Stats API ─────────────────────────────────────────────────────────────
export const statsApi = {
  get: () =>
    request<ApiResponse<DashboardStats>>('/admin/stats'),
}
