// src/components/Layout.jsx
import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  ChefHat,       // cheese
  Car,
  ShoppingCart,  // kroger
  MessageCircle,
  BookOpen,      // recipes
  Calendar,
  StickyNote,
  Menu
} from 'lucide-react'

const nav = [
  { to: '/',        label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/cheese',  label: 'Cheese',    icon: ChefHat },
  { to: '/car',     label: 'Car',       icon: Car },
  { to: '/kroger',  label: 'Kroger',    icon: ShoppingCart },
  { to: '/chat',    label: 'Chat',      icon: MessageCircle },
  { to: '/recipes', label: 'Recipes',   icon: BookOpen },
  { to: '/planner', label: 'Planner',   icon: Calendar },
  { to: '/notes',   label: 'Notes',     icon: StickyNote },
]

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cheese-light text-ink antialiased">
      {/* Topbar (mobile) */}
      <div className="md:hidden sticky top-0 z-20 bg-white border-b border-ash-mid">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            className="app-btn"
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            <Menu className="w-5 h-5" />
            Menu
          </button>
          <div className="font-semibold">🧀 CheeseDrawer</div>
          <div className="w-24" />
        </div>
        {open && (
          <nav className="px-2 pb-2">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 mb-1 transition
                   ${isActive ? 'bg-cheese-gold/40 text-ink' : 'hover:bg-ash-light text-ink'}`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="grid md:grid-cols-[260px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block border-r border-ash-mid bg-white min-h-screen">
          <div className="p-4 border-b border-ash-mid">
            <div className="text-xl font-bold leading-tight">🧀 CheeseDrawer</div>
            <div className="text-sm text-ash-dark">Nicole&apos;s life dashboard</div>
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
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="p-6">
          <header className="max-w-6xl mx-auto mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Nicole</h1>
                <p className="text-ash-dark mt-1">Here’s what’s on your plate today.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="app-btn">Settings</button>
                <button className="app-btn primary">Add Item</button>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
