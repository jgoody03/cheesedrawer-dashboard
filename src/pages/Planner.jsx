// src/pages/Planner.jsx
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "planner.tasks";

export default function Planner() {
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [draft, setDraft] = useState({ text: "", due: "" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const add = () => {
    const text = draft.text.trim();
    if (!text) return;
    setTasks([
      {
        id: Date.now(),
        text,
        due: draft.due || "",
        done: false,
        createdAt: new Date().toISOString(),
      },
      ...tasks,
    ]);
    setDraft({ text: "", due: "" });
  };

  const toggle = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => !t.done)
        .sort((a, b) => (a.due || "").localeCompare(b.due || "")),
    [tasks]
  );

  const completed = useMemo(
    () => tasks.filter((t) => t.done).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    [tasks]
  );

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="app-card p-5">
        <h2 className="text-xl font-semibold mb-3">New Task</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <input
            className="app-card p-2"
            placeholder="What needs to get done?"
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
          <input
            className="app-card p-2"
            type="date"
            value={draft.due}
            onChange={(e) => setDraft({ ...draft, due: e.target.value })}
          />
        </div>
        <button className="app-btn primary mt-3" onClick={add}>
          Add Task
        </button>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Upcoming</h3>
        {upcoming.length === 0 ? (
          <div className="app-card p-4 text-ash-dark">No upcoming tasks.</div>
        ) : (
          upcoming.map((t) => (
            <TaskRow key={t.id} task={t} onToggle={() => toggle(t.id)} onRemove={() => remove(t.id)} />
          ))
        )}
      </section>

      {/* Completed */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Completed</h3>
        {completed.length === 0 ? (
          <div className="app-card p-4 text-ash-dark">No completed tasks yet.</div>
        ) : (
          completed.map((t) => (
            <TaskRow key={t.id} task={t} onToggle={() => toggle(t.id)} onRemove={() => remove(t.id)} />
          ))
        )}
      </section>
    </div>
  );
}

function TaskRow({ task, onToggle, onRemove }) {
  const overdue =
    task.due && !task.done && new Date(task.due) < new Date(new Date().toDateString());

  return (
    <div className="app-card p-4 flex items-center justify-between">
      <div className="min-w-0">
        <div className={`font-medium ${task.done ? "line-through text-ash-dark" : ""}`}>
          {task.text}
        </div>
        <div className="text-sm text-ash-dark">
          {task.due ? (
            <span className={overdue ? "text-red-700" : ""}>Due: {task.due}</span>
          ) : (
            <span className="text-ash-dark/70">No due date</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="app-btn" onClick={onToggle}>
          {task.done ? "Undo" : "Done"}
        </button>
        <button className="app-btn" onClick={onRemove}>
          Delete
        </button>
      </div>
    </div>
  );
}
