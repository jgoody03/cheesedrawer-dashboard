// src/pages/CheeseTracker.jsx
import { useState, useEffect, useMemo } from 'react'

function daysOpen(opened) {
  const d = new Date(opened)
  if (isNaN(d)) return 0
  const ms = Date.now() - d.getTime()
  return Math.max(0, Math.floor(ms / 86_400_000)) // 1000*60*60*24
}

function statusPillClass(d) {
  if (d < 7) return 'bg-green-100 text-green-900'
  if (d < 14) return 'bg-yellow-100 text-yellow-900'
  return 'bg-red-100 text-red-900'
}

export default function CheeseTracker() {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('cheese.items')
    return raw ? JSON.parse(raw) : []
  })
  const [form, setForm] = useState({ name: '', type: '', opened: '' })

  useEffect(() => {
    localStorage.setItem('cheese.items', JSON.stringify(items))
  }, [items])

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => new Date(b.opened).getTime() - new Date(a.opened).getTime()
      ),
    [items]
  )

  const add = () => {
    if (!form.name || !form.type || !form.opened) return
    setItems([{ id: Date.now(), ...form }, ...items])
    setForm({ name: '', type: '', opened: '' })
  }

  const remove = (id) => setItems(items.filter((i) => i.id !== id))

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="app-card p-5">
        <h2 className="text-xl font-semibold mb-3">Add Cheese</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="app-card p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="app-card p-2"
            placeholder="Type (e.g., brie)"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <input
            className="app-card p-2"
            type="date"
            value={form.opened}
            onChange={(e) => setForm({ ...form, opened: e.target.value })}
          />
        </div>
        <button className="app-btn primary mt-3" onClick={add}>
          Add
        </button>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {sorted.length === 0 ? (
          <p className="text-ash-dark">No cheeses yet. Add one above.</p>
        ) : (
          sorted.map((i) => {
            const d = daysOpen(i.opened)
            return (
              <div
                key={i.id}
                className="app-card p-4 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-semibold truncate">
                      {i.name}{' '}
                      <span className="text-ash-dark">({i.type})</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusPillClass(
                        d
                      )}`}
                      title={`${d} day${d === 1 ? '' : 's'} since opened`}
                    >
                      {d}d open
                    </span>
                  </div>
                  <div className="text-sm text-ash-dark">
                    Opened: {i.opened || '—'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="app-btn" onClick={() => remove(i.id)}>
                    Remove
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
