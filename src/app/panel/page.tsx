'use client'
import { useState } from 'react'
import RoleGuard from '@/components/RoleGuard'
import { useAuth } from '@/context/auth'
import { useRouter } from 'next/navigation'
import PlatosPage from './platos/page'
import CategoriasPage from './categorias/page'

export default function Panel() {
  const { setUser } = useAuth()
  const router = useRouter()

  const [seccion, setSeccion] = useState<'platos' | 'categorias' | null>('platos')

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return (
    <main className="p-6">
      <div className="grid grid-cols-[240px_1fr] gap-4">
        {/* 🟩 Barra lateral */}
        <aside className="space-y-6 bg-gray-900 p-4 rounded-xl flex flex-col justify-between h-full">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <button
                  onClick={() => setSeccion('platos')}
                  className="text-left w-full hover:underline text-emerald-400"
                >
                  🍽 Platos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSeccion('categorias')}
                  className="text-left w-full hover:underline text-emerald-400"
                >
                  📂 Categorías
                </button>
              </li>
            </ul>
          </div>

          {/* 🔴 Botón de cerrar sesión */}
          <button
            onClick={logout}
            className="text-left text-sm underline text-red-400"
          >
            Cerrar sesión
          </button>
        </aside>

        {/* 🟦 Contenido */}
        <div className="space-y-6">
          <RoleGuard allow={['admin']}>
            <section className="card bg-purple-700/40">
              <h2 className="text-lg font-bold mb-4">Panel de Administración</h2>

              <div className="mt-6">
                {seccion === 'platos' && (
                  <>
                    <h3 className="text-md font-bold mb-2">🍽 Lista de Platos</h3>
                    <PlatosPage />
                  </>
                )}
                {seccion === 'categorias' && (
                  <>
                    <h3 className="text-md font-bold mb-2">📂 Lista de Categorías</h3>
                    <CategoriasPage />
                  </>
                )}
              </div>
            </section>
          </RoleGuard>
        </div>
      </div>
    </main>
  )
}
