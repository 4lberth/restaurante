'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'      // ⬅️  contexto

export default function RegisterPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg]           = useState('')
  const [error, setError]       = useState('')

  const { user } = useAuth()
  const router   = useRouter()

  /* 1️⃣  si ya hay sesión, no permitir abrir /register */
  useEffect(() => {
    if (user) router.replace('/panel')
  }, [user, router])

  /* 2️⃣  registro */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setMsg('')

    const res  = await fetch('/api/auth/register', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ email, password }),   // roleId se asigna en backend
    })
    const data = await res.json()

    if (res.ok) {
      setMsg('Registro exitoso 🎉')
      /* 3️⃣  tras registrarse, redirigimos al login */
      setTimeout(() => router.push('/login'), 1200)
    } else {
      setError(data.error || 'Error al registrar')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-5"
        autoComplete="off"
      >
        <h2 className="text-2xl font-semibold text-center text-white">Crear cuenta</h2>

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
          Registrarse
        </button>

        {msg   && <p className="text-sm text-emerald-400 text-center">{msg}</p>}
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <p className="text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?
          <Link href="/login" className="text-emerald-400 hover:underline ml-1">
            Inicia sesión
          </Link>
        </p>
      </form>
    </section>
  )
}
