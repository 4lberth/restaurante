'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth'

const CrearOrdenForm = dynamic(() => import('./CrearOrdenForm'), { ssr: false })

export default function MozoPage() {
  const { user } = useAuth()
  const [mesas, setMesas] = useState([])
  const [mesaSeleccionada, setMesaSeleccionada] = useState<any>(null)
  const [ordenActiva, setOrdenActiva] = useState<any>(null)

  useEffect(() => {
    if (user?.role === 'mozo') fetchMesas()
  }, [user])

  const fetchMesas = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/mesas', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setMesas(data)
  }

  const seleccionarMesa = async (id: number) => {
  setMesaSeleccionada(id)

  const token = localStorage.getItem('token')
  const res = await fetch('/api/orders?tableId=' + id, {
    headers: { Authorization: `Bearer ${token}` }
  })

  // ⚠️ Si la respuesta no es 2xx, cancelar
  if (!res.ok) {
    console.error('Error al obtener orden:', res.status)
    setOrdenActiva(null)
    return
  }

  // ⚠️ Leer como texto para evitar fallo si está vacío
  const text = await res.text()

  if (!text) {
    setOrdenActiva(null)
    return
  }

  // ✅ Si hay contenido, convertir a JSON
  const data = JSON.parse(text)

  setOrdenActiva(data?.status === 'PENDIENTE' ? data : null)
}


  return (
    <main className="p-6">
      <h2 className="text-xl font-bold mb-4">📋 Panel del Mozo</h2>

      {!mesaSeleccionada ? (
        <>
          <h3 className="mb-2">Selecciona una mesa:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mesas.map((mesa: any) => (
              <div
                key={mesa.id}
                onClick={() => seleccionarMesa(mesa.id)}
                className={`cursor-pointer rounded-xl p-4 text-center font-bold border ${
                  mesa.status === 'OCUPADA' ? 'bg-red-500/50 text-white' : 'bg-green-600/60 text-white'
                }`}
              >
                Mesa #{mesa.number}
                <div className="text-xs">{mesa.status}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-md mb-4">Mesa seleccionada: <span className="font-bold">#{mesaSeleccionada}</span></h3>
          {ordenActiva ? (
            <div className="bg-yellow-200 text-black p-4 rounded">
              <h4 className="font-bold mb-2">Orden activa</h4>
              <ul className="text-sm space-y-1">
                {ordenActiva.items.map((item: any) => (
                  <li key={item.id}>
                    🍽 {item.dish.name} x{item.quantity} - S/ {item.subtotal}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">Estado: <strong>{ordenActiva.status}</strong></p>
            </div>
          ) : (
            <CrearOrdenForm mesaId={mesaSeleccionada} />
          )}
        </>
      )}
    </main>
  )
}
