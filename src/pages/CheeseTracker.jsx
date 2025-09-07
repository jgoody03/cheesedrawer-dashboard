import { useState, useEffect } from 'react'

export default function CheeseTracker() {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('cheese.items')
    return raw ? JSON.parse(raw) : []
  })
  const [form, setForm] = useState({ name: '', type: '', opened: '' })

  useEffect(() => {
    localStorage.setItem('cheese.items', JSON.stringify(items))
  }, [items])

  const add = () => {
    if (!form.name || !form.type || !form.opened) return
    setItems([{ id: Date.now(), ...form }, ...items])
    setForm({ name: '', type: '', opened: '' })
  }

  const remove = (id) => setItems(items.filter(i => i.id !== id))

  return (
    <div className="space-y-6">
      <div className="app-card p-5">
        <h2 className="text-xl font-semibold mb-3">Add Cheese</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="app-card p-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="app-card p-2" placeholder="Type (e.g., brie)" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
          <input className="app-card p-2" type="date" value={form.opened} onChange={e=>setForm({...form, opened:e.target.value})} />
        </div>
        <button className="app-btn primary mt-3" onClick={add}>Add</button>
      </div>

      <div className="grid gap-3">
        {items.length === 0 ? (
          <p className="text-ash-dark">No cheeses yet.</p>
        ) : items.map(i => (
          <div key={i.id} className="app-card p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.name} <span className="text-ash-dark">({i.type})</span></div>
              <div className="text-sm text-ash-dark">Opened: {i.opened}</div>
            </div>
            <button className="app-btn" onClick={()=>remove(i.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
