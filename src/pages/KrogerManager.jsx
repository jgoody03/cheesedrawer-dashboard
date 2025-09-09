// src/pages/KrogerManager.jsx
import { useEffect, useState } from "react";

const STORAGE_KEY = "kroger.manager";

export default function KrogerManager() {
  const [data, setData] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { loyalty: "", store: "", shopping: [] };
  });

  const [draftItem, setDraftItem] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateField = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const addItem = () => {
    const text = draftItem.trim();
    if (!text) return;
    setData((prev) => ({
      ...prev,
      shopping: [
        { id: Date.now(), text, done: false },
        ...prev.shopping,
      ],
    }));
    setDraftItem("");
  };

  const toggleItem = (id) =>
    setData((prev) => ({
      ...prev,
      shopping: prev.shopping.map((i) =>
        i.id === id ? { ...i, done: !i.done } : i
      ),
    }));

  const removeItem = (id) =>
    setData((prev) => ({
      ...prev,
      shopping: prev.shopping.filter((i) => i.id !== id),
    }));

  return (
    <div className="space-y-6">
      {/* Loyalty Info */}
      <div className="app-card p-5">
        <h2 className="text-xl font-semibold mb-3">Loyalty Info</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="app-card p-2"
            placeholder="Loyalty Number"
            value={data.loyalty}
            onChange={(e) => updateField("loyalty", e.target.value)}
          />
          <input
            className="app-card p-2"
            placeholder="Preferred Store"
            value={data.store}
            onChange={(e) => updateField("store", e.target.value)}
          />
        </div>
      </div>

      {/* Shopping List */}
      <div className="app-card p-5">
        <h2 className="text-xl font-semibold mb-3">Shopping List</h2>
        <div className="flex gap-3">
          <input
            className="app-card p-2 flex-1"
            placeholder="Add item..."
            value={draftItem}
            onChange={(e) => setDraftItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <button className="app-btn primary" onClick={addItem}>
            Add
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {data.shopping.length === 0 ? (
            <p className="text-ash-dark">No items yet.</p>
          ) : (
            data.shopping.map((i) => (
              <div
                key={i.id}
                className="app-card p-3 flex items-center justify-between"
              >
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={i.done}
                    onChange={() => toggleItem(i.id)}
                  />
                  <span
                    className={`${
                      i.done ? "line-through text-ash-dark" : ""
                    }`}
                  >
                    {i.text}
                  </span>
                </label>
                <button className="app-btn" onClick={() => removeItem(i.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
