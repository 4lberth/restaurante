'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/context/auth'          // ← contexto que expone { user, setUser }

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  const router        = useRouter()
  const { user, setUser } = useAuth()

  /* 1️⃣  Si ya estoy logueado, no debo ver /login */
  useEffect(() => {
    if (user) router.replace('/panel')
  }, [user, router])

  /* 2️⃣  Manejo del formulario */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res  = await fetch('/api/auth/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)         // guarda sesión
      setUser(jwtDecode(data.token))                    // actualiza contexto
      router.push('/panel')                             // redirige al panel
    } else {
      setError(data.error || 'Error al iniciar sesión')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-5"
        autoComplete="off"
      >
        <h2 className="text-2xl font-semibold text-center text-white">Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
        >
          Ingresar
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <p className="text-center text-sm text-gray-400">
          ¿No tienes cuenta?
          <Link href="/register" className="text-emerald-400 hover:underline ml-1">
            Regístrate
          </Link>
        </p>
      </form>
    </section>
  )
}
