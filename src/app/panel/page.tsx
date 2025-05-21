'use client'                       // 👈  añade esto en la primera línea
import RoleGuard from '@/components/RoleGuard'
import { useAuth } from '@/context/auth'
import { useRouter } from 'next/navigation'


export default function Panel() {
  const { setUser } = useAuth()
  const router      = useRouter()

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return (
    <main className="p-6 space-y-6">
      <button
        onClick={logout}
        className="fixed top-4 right-4 text-sm underline text-emerald-400"
      >
        Cerrar sesión
      </button>

      <section className="card bg-gray-800">
        Dashboard común (todos los usuarios)
      </section>

      <RoleGuard allow={['mozo']}>
        <section className="card bg-emerald-700/40">
          <h2 className="text-lg font-semibold mb-2">Panel de mozo</h2>
          <p>Pedidos de mesa, cambio de estado…</p>
        </section>
      </RoleGuard>

      <RoleGuard allow={['chef']}>
        <section className="card bg-orange-600/40">
          <h2 className="text-lg font-semibold mb-2">Panel de chef</h2>
          <p>Órdenes para preparar, tiempos de cocción…</p>
        </section>
      </RoleGuard>

      <RoleGuard allow={['admin']}>
        <section className="card bg-purple-700/40">
          <h2 className="text-lg font-semibold mb-2">Administración</h2>
          <p>Gestión de usuarios, reportes, configuración…</p>
        </section>
      </RoleGuard>
    </main>
  )
}
