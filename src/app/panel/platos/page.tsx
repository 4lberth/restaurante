'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth'

export default function PlatosPage() {
  const [platos, setPlatos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | 'todas'>('todas')
  const [showForm, setShowForm] = useState(false)

  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | null>(null)

  const [modoEdicion, setModoEdicion] = useState(false)
  const [platoEditandoId, setPlatoEditandoId] = useState<number | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCategorias()
      fetchPlatos()
    }
  }, [user])

  const fetchCategorias = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/categorias', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setCategorias(data)
  }

  const fetchPlatos = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/platos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setPlatos(data)
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const body = {
      name: nombre,
      price: parseFloat(precio),
      description: descripcion,
      categoryId: categoriaId
    }

    if (modoEdicion && platoEditandoId) {
      await fetch(`/api/platos/${platoEditandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
    } else {
      await fetch('/api/platos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
    }

    resetFormulario()
    fetchPlatos()
  }

  const resetFormulario = () => {
    setNombre('')
    setPrecio('')
    setDescripcion('')
    setCategoriaId(null)
    setPlatoEditandoId(null)
    setModoEdicion(false)
    setShowForm(false)
  }

  const platosFiltrados = categoriaSeleccionada === 'todas'
    ? platos
    : platos.filter((p: any) => p.categoryId === categoriaSeleccionada)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de Platos</h2>
        <button
          onClick={() => {
            resetFormulario()
            setShowForm(!showForm)
          }}
          className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-500"
        >
          {showForm ? 'Cancelar' : '+ Nuevo plato'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-4 rounded mb-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre del plato"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <textarea
            placeholder="Descripción"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
          />
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={categoriaId ?? ''}
            onChange={e => setCategoriaId(parseInt(e.target.value))}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 w-full text-white py-1 rounded hover:bg-emerald-500"
          >
            {modoEdicion ? 'Actualizar plato' : 'Guardar plato'}
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="text-white text-sm">Filtrar por categoría:</label>
        <select
          className="bg-gray-800 text-white p-2 rounded w-full"
          value={categoriaSeleccionada}
          onChange={e =>
            setCategoriaSeleccionada(e.target.value === 'todas' ? 'todas' : parseInt(e.target.value))
          }
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-2">
        {platosFiltrados.map((p: any) => (
          <li key={p.id} className="p-2 bg-gray-800 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{p.name} - S/ {p.price}</p>
                {p.description && <p className="text-sm text-gray-300">{p.description}</p>}
              </div>
              <button
                onClick={() => {
                  setNombre(p.name)
                  setPrecio(String(p.price))
                  setDescripcion(p.description ?? '')
                  setCategoriaId(p.categoryId)
                  setPlatoEditandoId(p.id)
                  setModoEdicion(true)
                  setShowForm(true)
                }}
                className="text-sm text-emerald-400 hover:underline"
              >
                ✏️ Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
