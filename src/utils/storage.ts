export type AppUser = {
  id: string
  name: string
  role: 'reader' | 'curator'
  xp: number
}

const STORAGE_KEY = 'levelupreads_user'

export function saveUser(user: AppUser) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getUser(): AppUser | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as AppUser
  } catch {
    return null
  }
}

export function clearUser() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
