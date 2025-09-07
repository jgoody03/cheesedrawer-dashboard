// src/pages/Notes.jsx
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "notes.items";

export default function Notes() {
  const [notes, setNotes] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  const [draft, setDraft] = useState({ title: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const add = () => {
    if (!draft.title && !draft.body) return;
    setNotes([
      {
        id: Date.now(),
        title: draft.title.trim() || "Untitled",
        body: draft.body.trim(),
        createdAt: new Date().toISOString(),
      },
      ...notes,
    ]);
    setDraft({ title: "", body: "" });
  };

  const startEdit = (id) => setEditingId(id);

  const saveEdit = (id, newTitle, newBody) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title: newTitle, body: newBody } : n
      )
    );
    setEditingId(null);
  };

  const remove = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="app-card p-5">
        <h2 className="text-xl font-semibold mb-3">New Note</h2>
        <div className="grid gap-3">
          <input
            className="app-card p-2"
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <textarea
            rows={4}
            className="app-card p-2"
            placeholder="Write something..."
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <button className="app-btn primary" onClick={add}>
            Add Note
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="app-card p-4">
        <input
          className="app-card p-2 w-full"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p className="text-ash-dark">No notes yet.</p>
        ) : (
          filtered.map((n) => (
            <NoteRow
              key={n.id}
              note={n}
              editing={editingId === n.id}
              onStartEdit={() => startEdit(n.id)}
              onSave={(title, body) => saveEdit(n.id, title, body)}
              onRemove={() => remove(n.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NoteRow({ note, editing, onStartEdit, onSave, onRemove }) {
  const [t, setT] = useState(note.title);
  const [b, setB] = useState(note.body);

  useEffect(() => {
    if (editing) {
      setT(note.title);
      setB(note.body);
    }
  }, [editing, note.title, note.body]);

  return (
    <div className="app-card p-4">
      {editing ? (
        <div className="grid gap-3">
          <input
            className="app-card p-2"
            value={t}
            onChange={(e) => setT(e.target.value)}
          />
          <textarea
            rows={4}
            className="app-card p-2"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button className="app-btn primary" onClick={() => onSave(t, b)}>
              Save
            </button>
            <button className="app-btn" onClick={onRemove}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold truncate">{note.title}</div>
            <div className="text-sm text-ash-dark whitespace-pre-wrap mt-1">
              {note.body || <span className="italic text-ash-dark">—</span>}
            </div>
            <div className="text-xs text-ash-dark mt-2">
              {new Date(note.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="app-btn" onClick={onStartEdit}>
              Edit
            </button>
            <button className="app-btn" onClick={onRemove}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
