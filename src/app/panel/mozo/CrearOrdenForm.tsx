'use client'
import { useEffect, useState } from 'react'

export default function CrearOrdenForm({ mesaId }: { mesaId: number }) {
  const [platos, setPlatos] = useState([])
  const [items, setItems] = useState<{ dishId: number, quantity: number }[]>([])
  const [cliente, setCliente] = useState({ name: '', email: '' })

  useEffect(() => {
    fetchPlatos()
  }, [])

  const fetchPlatos = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/platos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setPlatos(data)
  }

  const toggleDish = (dishId: number) => {
    setItems(prev =>
      prev.some(item => item.dishId === dishId)
        ? prev.filter(i => i.dishId !== dishId)
        : [...prev, { dishId, quantity: 1 }]
    )
  }

  const updateQuantity = (dishId: number, qty: number) => {
    setItems(prev => prev.map(item =>
      item.dishId === dishId ? { ...item, quantity: qty } : item
    ))
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        tableId: mesaId,
        customer: cliente,
        items,
      })
    })

    if (res.ok) {
      alert('Orden registrada correctamente ✅')
      window.location.reload()
    } else {
      alert('Error al registrar orden ❌')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded">
        <h4 className="text-white mb-2">👤 Datos del cliente (opcional)</h4>
        <input
          placeholder="Nombre"
          value={cliente.name}
          onChange={e => setCliente({ ...cliente, name: e.target.value })}
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        />
        <input
          placeholder="Email"
          value={cliente.email}
          onChange={e => setCliente({ ...cliente, email: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <h4 className="text-white mb-2">🍽 Selecciona platos</h4>
        {platos.map((p: any) => (
          <div key={p.id} className="flex justify-between items-center mb-2">
            <label className="text-white">
              <input
                type="checkbox"
                checked={items.some(item => item.dishId === p.id)}
                onChange={() => toggleDish(p.id)}
                className="mr-2"
              />
              {p.name} - S/ {p.price}
            </label>
            {items.some(item => item.dishId === p.id) && (
              <input
                type="number"
                min={1}
                value={items.find(i => i.dishId === p.id)?.quantity || 1}
                onChange={e => updateQuantity(p.id, parseInt(e.target.value))}
                className="w-16 text-center rounded bg-gray-700 text-white"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500"
      >
        Registrar orden
      </button>
    </div>
  )
}
