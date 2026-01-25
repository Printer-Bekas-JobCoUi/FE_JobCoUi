import React, { createContext, useContext, useMemo, useState } from 'react'

type AuthContextValue = {
  isAuthed: boolean
  login: (email: string, password: string) => void
  logout: () => void
  user: { name: string; email: string; role: string } | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'admin_token'
const USER_KEY = 'admin_user'

function loadFromStorage(): { isAuthed: boolean; user: AuthContextValue['user'] } {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const user = localStorage.getItem(USER_KEY)
    if (!token || !user) return { isAuthed: false, user: null }
    return { isAuthed: true, user: JSON.parse(user) }
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
    login: (token: string, userData: any) => {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      setUser(userData)
      setIsAuthed(true)
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
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
