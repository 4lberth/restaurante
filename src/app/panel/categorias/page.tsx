'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState('')

  const [modoEdicion, setModoEdicion] = useState(false)
  const [categoriaEditandoId, setCategoriaEditandoId] = useState<number | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') fetchCategorias()
  }, [user])

  const fetchCategorias = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/categorias', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setCategorias(data)
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')

    if (modoEdicion && categoriaEditandoId) {
      await fetch(`/api/categorias/${categoriaEditandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: nombre })
      })
    } else {
      await fetch('/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: nombre })
      })
    }

    setNombre('')
    setCategoriaEditandoId(null)
    setModoEdicion(false)
    setShowForm(false)
    fetchCategorias()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de Categorías</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setModoEdicion(false)
            setCategoriaEditandoId(null)
            setNombre('')
          }}
          className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-500"
        >
          {showForm ? 'Cancelar' : '+ Nueva categoría'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-4 rounded mb-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 w-full text-white py-1 rounded hover:bg-emerald-500"
          >
            {modoEdicion ? 'Actualizar categoría' : 'Guardar categoría'}
          </button>
        </div>
      )}

      {user?.role !== 'admin' ? (
        <p>No tienes acceso</p>
      ) : (
        <ul className="space-y-2">
          {categorias.map((c: any) => (
            <li key={c.id} className="p-2 bg-gray-800 rounded flex justify-between items-center">
              <span>{c.name}</span>
              <button
                onClick={() => {
                  setShowForm(true)
                  setModoEdicion(true)
                  setCategoriaEditandoId(c.id)
                  setNombre(c.name)
                }}
                className="text-sm text-emerald-400 hover:underline"
              >
                ✏️ Editar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
