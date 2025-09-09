// src/pages/Chatbot.jsx
import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "chat.history";

function nowISO() {
  return new Date().toISOString();
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef(null);
  const endRef = useRef(null);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || busy) return;

    const userMsg = { id: crypto.randomUUID?.() ?? Date.now(), role: "user", text, ts: nowISO() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);

    // Simulate an assistant response (replace with real API later)
    const replyText = await fakeAssistantReply(text);
    const botMsg = { id: crypto.randomUUID?.() ?? Date.now() + 1, role: "assistant", text: replyText, ts: nowISO() };
    setMessages((m) => [...m, botMsg]);
    setBusy(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="space-y-4">
      {/* Header / Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chatbot / Ask Anything</h2>
        <div className="flex items-center gap-2">
          <button className="app-btn" onClick={clearChat} disabled={!hasMessages}>
            Clear
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="app-card p-0 overflow-hidden">
        <div
          ref={scrollerRef}
          className="max-h-[60vh] overflow-y-auto px-4 py-4 bg-white"
        >
          {!hasMessages ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <Message key={m.id} role={m.role} text={m.text} ts={m.ts} />
              ))}
            </ul>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-ash-mid p-3">
          <div className="app-card p-0 overflow-hidden">
            <textarea
              className="w-full p-3 outline-none resize-none"
              rows={3}
              placeholder={busy ? "Thinking…" : "Ask Nicole’s assistant…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={busy}
            />
          </div>
          <div className="flex items-center justify-end mt-2">
            <button
              className="app-btn primary"
              onClick={handleSend}
              disabled={busy || !input.trim()}
            >
              {busy ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-ash-dark text-sm">
        Tip: Press <span className="font-semibold">Enter</span> to send,{" "}
        <span className="font-semibold">Shift+Enter</span> for a new line.
      </p>
    </div>
  );
}

function Message({ role, text, ts }) {
  const isUser = role === "user";
  return (
    <li
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
      title={new Date(ts).toLocaleString()}
    >
      {!isUser && <Avatar label="CD" />}
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-soft border ${
          isUser
            ? "bg-cheese-gold border-transparent"
            : "bg-ash-light border-ash-mid"
        }`}
      >
        <div className="whitespace-pre-wrap">{text}</div>
        <div className="text-xs text-ash-dark mt-1 text-right">{formatTime(ts)}</div>
      </div>
      {isUser && <Avatar label="You" right />}
    </li>
  );
}

function Avatar({ label, right = false }) {
  return (
    <div
      className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
        right ? "bg-ink text-white" : "bg-cheese-gold text-ink"
      }`}
      aria-hidden
    >
      {label}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="app-card p-8 text-center text-ash-dark bg-ash-light">
      <div className="text-lg font-medium mb-1">Ask Nicole’s assistant</div>
      <div className="text-sm">“What’s on my shopping list?” · “How old is the brie?” · “What’s due on the car?”</div>
    </div>
  );
}

// -------- Stubbed assistant logic --------
// Replace this with a real API call later.
async function fakeAssistantReply(text) {
  // Simulate thinking time
  await new Promise((r) => setTimeout(r, 500));

  // Extremely simple canned logic for now
  const t = text.toLowerCase();
  if (t.includes("hello") || t.includes("hi")) {
    return "Hey! I’m your CheeseDrawer assistant. Ask me about cheeses, shopping, or the car.";
  }
  if (t.includes("shopping")) {
    return "Your shopping list lives in the Kroger drawer. I’ll soon fetch it automatically.";
  }
  if (t.includes("car") || t.includes("oil")) {
    return "Check the Car Manager for maintenance and mileage. I’ll be able to summarize that here soon.";
  }
  if (t.includes("cheese")) {
    return "Cheeses are tracked in the Cheese drawer. I’ll add freshness summaries next.";
  }
  return "Got it. I’ll soon be wired to reference your drawers and answer with specifics.";
}
