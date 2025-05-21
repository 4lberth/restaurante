'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export interface User { id: number; role: string }
interface AuthCtx {
  user: User | null
  setUser: (u: User | null) => void        // 👈 nuevo
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  setUser: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  /* lee (o vuelve a leer) token en la primera carga */
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try { setUser(jwtDecode<User>(token)) } catch {}
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
