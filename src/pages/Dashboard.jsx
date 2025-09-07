import { Link } from 'react-router-dom'

const Card = ({ title, children, to }) => (
  <div className="app-card p-5">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {to && <Link to={to} className="text-sm underline">Open</Link>}
    </div>
    {children}
  </div>
)

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card title="Cheese Tracker" to="/cheese">
        <p className="text-ash-dark">Track opened cheeses, notes, and freshness.</p>
      </Card>
      <Card title="Car Manager" to="/car">
        <p className="text-ash-dark">Maintenance reminders, insurance, and documents.</p>
      </Card>
      <Card title="Kroger Manager" to="/kroger">
        <p className="text-ash-dark">Loyalty, coupons, and shopping list.</p>
      </Card>
      <Card title="Chatbot" to="/chat">
        <p className="text-ash-dark">Ask anything — your assistant knows your drawers.</p>
      </Card>
      <Card title="Recipe Finder" to="/recipes">
        <p className="text-ash-dark">What can we make with what we have?</p>
      </Card>
      <Card title="Planner & Notes" to="/planner">
        <p className="text-ash-dark">Calendar, todos, and notes.</p>
      </Card>
    </div>
  )
}
