import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CheeseTracker from './pages/CheeseTracker.jsx'
import CarManager from './pages/CarManager.jsx'
import KrogerManager from './pages/KrogerManager.jsx'
import Chatbot from './pages/Chatbot.jsx'
import RecipeFinder from './pages/RecipeFinder.jsx'
import Planner from './pages/Planner.jsx'
import Notes from './pages/Notes.jsx'
<h1 className="text-4xl text-blue-600 underline font-extrabold">
  Tailwind is working
</h1>

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/cheese" element={<CheeseTracker />} />
        <Route path="/car" element={<CarManager />} />
        <Route path="/kroger" element={<KrogerManager />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/recipes" element={<RecipeFinder />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/notes" element={<Notes />} />
      </Route>
    </Routes>
  )
}
