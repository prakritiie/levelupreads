import type { AppUser } from './storage'

export function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString))
  } catch {
    return dateString
  }
}

export function getXpProgress(xp: number) {
  const current = xp % 100
  return Math.min(100, Math.max(0, current))
}

export function sortUsersByXp<T extends { xp: number }>(users: Array<T>) {
  return [...users].sort((a, b) => b.xp - a.xp)
}

export function mergeUserList<T extends { xp: number; id?: string | number; name?: string }>(existingUsers: Array<T>, currentUser: AppUser | null) {
  if (!currentUser) return sortUsersByXp(existingUsers)
  const found = existingUsers.some((user) => String(user.id) === String(currentUser.id))
  const list = found ? existingUsers : [...existingUsers, currentUser as unknown as T]
  return sortUsersByXp(list)
}
