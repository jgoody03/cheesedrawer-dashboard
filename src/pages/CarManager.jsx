// src/pages/CarManager.jsx
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "car.vehicles";

const PRESETS = [
  { type: "Oil Change", interval: 5000 },
  { type: "Tire Rotation", interval: 6000 },
  { type: "Brake Inspection", interval: 12000 },
];

function milesRemaining(dueMiles, currentMiles) {
  if (!dueMiles || !currentMiles) return null;
  return dueMiles - currentMiles;
}

function clsOverdue(rem) {
  if (rem === null) return "";
  if (rem < 0) return "text-red-700";
  if (rem <= 500) return "text-yellow-700";
  return "text-ash-dark";
}

export default function CarManager() {
  const [vehicles, setVehicles] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  const [draft, setDraft] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    mileage: "",
  });

  const [activeId, setActiveId] = useState(null); // which vehicle is expanded

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  }, [vehicles]);

  const addVehicle = () => {
    const v = {
      id: Date.now(),
      make: draft.make.trim(),
      model: draft.model.trim(),
      year: draft.year.trim(),
      vin: draft.vin.trim(),
      mileage: Number(draft.mileage) || 0,
      maintenance: [],
      createdAt: new Date().toISOString(),
    };
    if (!v.make && !v.model) return;
    setVehicles([v, ...vehicles]);
    setDraft({ make: "", model: "", year: "", vin: "", mileage: "" });
    setActiveId(v.id);
  };

  const updateMileage = (id, mileage) =>
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, mileage: Number(mileage) || 0 } : v))
    );

  const removeVehicle = (id) =>
    setVehicles((prev) => prev.filter((v) => v.id !== id));

  const addMaint = (id, item) =>
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, maintenance: [{ id: Date.now(), ...item }, ...v.maintenance] } : v
      )
    );

  const removeMaint = (vehId, maintId) =>
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehId
          ? { ...v, maintenance: v.maintenance.filter((m) => m.id !== maintId) }
          : v
      )
    );

  const sortedVehicles = useMemo(() => {
    // newest created first
    return [...vehicles].sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    );
  }, [vehicles]);

  return (
    <div className="space-y-6">
      {/* Add Vehicle */}
      <div className="app-card p-5">
        <h2 className="text-xl font-semibold mb-3">Add Vehicle</h2>
        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="app-card p-2"
            placeholder="Make"
            value={draft.make}
            onChange={(e) => setDraft((d) => ({ ...d, make: e.target.value }))}
          />
          <input
            className="app-card p-2"
            placeholder="Model"
            value={draft.model}
            onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))}
          />
          <input
            className="app-card p-2"
            placeholder="Year"
            value={draft.year}
            onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value }))}
          />
          <input
            className="app-card p-2"
            placeholder="VIN"
            value={draft.vin}
            onChange={(e) => setDraft((d) => ({ ...d, vin: e.target.value }))}
          />
          <input
            className="app-card p-2"
            placeholder="Current Mileage"
            value={draft.mileage}
            onChange={(e) => setDraft((d) => ({ ...d, mileage: e.target.value }))}
          />
        </div>
        <button className="app-btn primary mt-3" onClick={addVehicle}>
          Add Vehicle
        </button>
      </div>

      {/* Vehicles List */}
      <div className="grid gap-4">
        {sortedVehicles.length === 0 ? (
          <div className="app-card p-4 text-ash-dark">No vehicles yet.</div>
        ) : (
          sortedVehicles.map((v) => (
            <VehicleCard
              key={v.id}
              v={v}
              active={activeId === v.id}
              onToggle={() => setActiveId(activeId === v.id ? null : v.id)}
              onUpdateMileage={(m) => updateMileage(v.id, m)}
              onRemove={() => removeVehicle(v.id)}
              onAddMaint={(item) => addMaint(v.id, item)}
              onRemoveMaint={(maintId) => removeMaint(v.id, maintId)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function VehicleCard({
  v,
  active,
  onToggle,
  onUpdateMileage,
  onRemove,
  onAddMaint,
  onRemoveMaint,
}) {
  const [mDraft, setMDraft] = useState({
    type: "",
    dueMiles: "",
    lastDone: "",
    notes: "",
  });

  const maintSorted = useMemo(
    () =>
      [...(v.maintenance || [])].sort(
        (a, b) => (a.dueMiles || 0) - (b.dueMiles || 0)
      ),
    [v.maintenance]
  );

  const addPreset = (preset) => {
    const due = (Number(v.mileage) || 0) + (preset.interval || 0);
    onAddMaint({
      type: preset.type,
      dueMiles: due,
      lastDone: new Date().toISOString().slice(0, 10),
      notes: `Preset interval ${preset.interval.toLocaleString()} mi`,
    });
  };

  const addCustom = () => {
    const item = {
      type: mDraft.type.trim() || "Maintenance",
      dueMiles: Number(mDraft.dueMiles) || 0,
      lastDone: mDraft.lastDone || "",
      notes: mDraft.notes.trim(),
    };
    if (!item.dueMiles && !item.type) return;
    onAddMaint(item);
    setMDraft({ type: "", dueMiles: "", lastDone: "", notes: "" });
  };

  return (
    <div className="app-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-lg truncate">
            {v.year ? `${v.year} ` : ""}
            {v.make} {v.model}
          </div>
          <div className="text-sm text-ash-dark">
            VIN: {v.vin || "—"} • Mileage:{" "}
            <input
              className="app-card px-2 py-1 w-32 inline-block"
              value={v.mileage ?? ""}
              onChange={(e) => onUpdateMileage(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="app-btn" onClick={onToggle}>
            {active ? "Hide" : "Details"}
          </button>
          <button className="app-btn" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>

      {/* Details */}
      {active && (
        <div className="mt-5 space-y-5">
          {/* Presets */}
          <div>
            <div className="text-sm font-semibold mb-2">Quick-add Presets</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.type}
                  className="app-btn"
                  onClick={() => addPreset(p)}
                  title={`Next due ≈ current mileage + ${p.interval.toLocaleString()} mi`}
                >
                  {p.type} (+{p.interval.toLocaleString()} mi)
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Maintenance */}
          <div className="app-card p-4">
            <div className="text-sm font-medium mb-2">Add Maintenance</div>
            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
              <input
                className="app-card p-2"
                placeholder="Type (e.g., Transmission Service)"
                value={mDraft.type}
                onChange={(e) => setMDraft((d) => ({ ...d, type: e.target.value }))}
              />
              <input
                className="app-card p-2"
                placeholder="Due Miles (e.g., 45000)"
                value={mDraft.dueMiles}
                onChange={(e) =>
                  setMDraft((d) => ({ ...d, dueMiles: e.target.value }))
                }
              />
              <input
                className="app-card p-2"
                type="date"
                placeholder="Last Done"
                value={mDraft.lastDone}
                onChange={(e) =>
                  setMDraft((d) => ({ ...d, lastDone: e.target.value }))
                }
              />
            </div>
            <textarea
              className="app-card p-2 w-full mt-3"
              rows={3}
              placeholder="Notes"
              value={mDraft.notes}
              onChange={(e) => setMDraft((d) => ({ ...d, notes: e.target.value }))}
            />
            <button className="app-btn primary mt-3" onClick={addCustom}>
              Add Maintenance
            </button>
          </div>

          {/* Maintenance List */}
          <div className="space-y-3">
            <div className="text-lg font-semibold">Upcoming & Logged</div>
            {maintSorted.length === 0 ? (
              <div className="app-card p-4 text-ash-dark">No maintenance yet.</div>
            ) : (
              maintSorted.map((m) => {
                const rem = milesRemaining(Number(m.dueMiles) || 0, Number(v.mileage) || 0);
                return (
                  <div key={m.id} className="app-card p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium">
                        {m.type}{" "}
                        {m.dueMiles ? (
                          <span className={`text-sm ml-2 ${clsOverdue(rem)}`}>
                            {rem !== null
                              ? rem < 0
                                ? `${Math.abs(rem).toLocaleString()} mi OVER`
                                : `${rem.toLocaleString()} mi left`
                              : "—"}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-sm text-ash-dark">
                        {m.dueMiles ? `Due @ ${Number(m.dueMiles).toLocaleString()} mi` : "No due mileage"}
                        {m.lastDone ? ` • Last done: ${m.lastDone}` : ""}
                      </div>
                      {m.notes && (
                        <div className="text-sm text-ash-dark mt-1 whitespace-pre-wrap">
                          {m.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="app-btn" onClick={() => onRemoveMaint(m.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
