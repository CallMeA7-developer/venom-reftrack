const SESSION_KEY = 'venom_staff_session'
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username, loggedIn: true }))
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  const session = localStorage.getItem(SESSION_KEY)
  if (!session) return false
  try {
    const parsed = JSON.parse(session)
    return parsed.loggedIn === true
  } catch {
    return false
  }
}
