import { Outlet, NavLink } from 'react-router-dom'
import { Cheese, Car, ShoppingBasket, MessageCircle, BookOpenText, Calendar, StickyNote, LayoutGrid } from 'lucide-react'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/cheese', label: 'Cheese', icon: Cheese },
  { to: '/car', label: 'Car', icon: Car },
  { to: '/kroger', label: 'Kroger', icon: ShoppingBasket },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/recipes', label: 'Recipes', icon: BookOpenText },
  { to: '/planner', label: 'Planner', icon: Calendar },
  { to: '/notes', label: 'Notes', icon: StickyNote },
]

export default function Layout() {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-cheese-light">
      <aside className="border-r border-ash-mid bg-white">
        <div className="p-4 border-b border-ash-mid">
          <div className="text-ink text-xl font-bold">🧀 CheeseDrawer</div>
          <div className="text-ash-dark text-sm">Nicole's life dashboard</div>
        </div>
        <nav className="p-2">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 mb-1 transition
                 ${isActive ? 'bg-cheese-gold/40 text-ink' : 'hover:bg-ash-light text-ink'}`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ink">Welcome back, Nicole</h1>
          <div className="flex items-center gap-2">
            <button className="app-btn">Settings</button>
            <button className="app-btn primary">Add Item</button>
          </div>
        </header>
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
