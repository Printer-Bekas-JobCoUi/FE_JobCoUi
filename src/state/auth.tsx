import React, { createContext, useContext, useMemo, useState } from 'react'

type AuthContextValue = {
  isAuthed: boolean
  login: (email: string, password: string) => void
  logout: () => void
  user: { name: string; email: string; role: string } | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

const LS_KEY = 'bhl_admin_demo_auth'

function loadFromStorage(): { isAuthed: boolean; user: AuthContextValue['user'] } {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { isAuthed: false, user: null }
    const parsed = JSON.parse(raw) as { token: string; user: AuthContextValue['user'] }
    if (!parsed?.token) return { isAuthed: false, user: null }
    return { isAuthed: true, user: parsed.user ?? null }
  } catch {
    return { isAuthed: false, user: null }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = typeof window !== 'undefined' ? loadFromStorage() : { isAuthed: false, user: null }
  const [isAuthed, setIsAuthed] = useState<boolean>(initial.isAuthed)
  const [user, setUser] = useState<AuthContextValue['user']>(initial.user)

  const value = useMemo<AuthContextValue>(() => ({
    isAuthed,
    user,
    login: (email: string) => {
      // Frontend-only demo login:
      const demoUser = { name: 'Admin', email, role: 'Super Admin' }
      localStorage.setItem(LS_KEY, JSON.stringify({ token: 'demo-token', user: demoUser }))
      setUser(demoUser)
      setIsAuthed(true)
    },
    logout: () => {
      localStorage.removeItem(LS_KEY)
      setIsAuthed(false)
      setUser(null)
    }
  }), [isAuthed, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
