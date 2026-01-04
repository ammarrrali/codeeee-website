"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const quickActions = [
  { label: "Website", msg: "I need a website for my business. What do you recommend?" },
  { label: "Booking System", msg: "I need a booking/appointments system. What’s the best approach?" },
  { label: "Automation", msg: "I want WhatsApp/email automation for leads and follow-ups." },
  { label: "Pricing", msg: "Give me a rough cost range and what affects pricing." },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"ollama" | "openai">("ollama"); // default free
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "> CODEEEE AI Consultant online.\n> Tell me what you need (website, portal, booking, automation).",
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = input.trim().length > 0 && !loading;

  useEffect(() => {
    if (!open) return;
    // scroll to bottom on open / new message
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [open, msgs.length]);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    setMsgs((m) => [...m, { role: "user", content: clean }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          messages: [...msgs, { role: "user", content: clean }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Chat failed");

      setMsgs((m) => [...m, { role: "assistant", content: data.text }]);
    } catch (e: any) {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            `> Error: ${e?.message || "Failed"}\n> If you're using Ollama, ensure it is running.\n> Otherwise switch provider to OpenAI.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onQuick = (msg: string) => {
    if (loading) return;
    setOpen(true);
    send(msg);
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const handoffToContact = async () => {
  // Build a compact conversation string (last ~10 messages)
  const recent = msgs.slice(-10).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

  setLoading(true);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content:
              `Summarize this conversation into a short project brief for CODEEEE.\n` +
              `Format exactly:\n` +
              `- Business type:\n- Need:\n- Pages/Features:\n- Integrations:\n- Timeline:\n- Budget range (if mentioned):\n- Notes:\n\nConversation:\n` +
              recent,
          },
        ],
      }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Failed to summarize");

    // Save summary for Contact form
localStorage.setItem("codeeee_brief", data.text);

// notify Contact instantly (same tab)
window.dispatchEvent(new Event("codeeee:brief"));
    // Go to contact + close chat
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  } catch (e: any) {
    alert(e?.message || "Failed to handoff");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Floating bubble */}
      <button
        type="button"
        aria-label="Open CODEEEE AI Consultant"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3 font-mono text-sm text-cyan-200 shadow-[0_0_40px_-18px_rgba(34,211,238,0.35)] hover:border-cyan-400/40"
      >
        {open ? "> close_ai" : "> ai_consultant"}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[60] w-[92vw] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-[0_0_70px_-30px_rgba(34,211,238,0.35)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/80" />
              <div className="font-mono text-xs text-white/70">CODEEEE // AI Consultant</div>
            </div>

            {/* Provider toggle */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-white/60">
              <span className="hidden sm:inline">provider:</span>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-white/80 outline-none"
              >
                <option value="ollama">ollama (free)</option>
                <option value="openai">openai</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="max-h-[360px] overflow-y-auto px-4 py-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`mb-3 text-sm leading-relaxed ${
                  m.role === "user" ? "text-white/85" : "text-cyan-100/80"
                }`}
              >
                <pre className="whitespace-pre-wrap font-mono">{m.content}</pre>
              </div>
            ))}

            {loading && (
              <div className="mb-2 text-xs font-mono text-white/50">
                &gt; thinking...
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
            {quickActions.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={loading}
                onClick={() => onQuick(q.msg)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-white/75 hover:border-cyan-400/30 hover:bg-white/10 disabled:opacity-50"
              >
                {">"} {q.label}
              </button>
            ))}

            <button
  type="button"
  onClick={handoffToContact}
  disabled={loading}
  className="ml-auto rounded-xl bg-cyan-400 px-3 py-2 font-mono text-[11px] text-black hover:brightness-110 disabled:opacity-60"
>
  {">"} handoff_brief
</button>

<button
  type="button"
  onClick={scrollToContact}
  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-white/75 hover:border-cyan-400/30 hover:bg-white/10"
>
  {">"} talk_to_human
</button>  
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) send(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="> describe your project..."
              className="flex-1 rounded-xl border border-white/10 bg-black/50 px-3 py-2 font-mono text-sm text-white/85 outline-none focus:border-cyan-400/40"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-xl bg-white/10 px-3 py-2 font-mono text-sm text-white/80 hover:bg-white/15 disabled:opacity-50"
            >
              send
            </button>
          </form>
        </div>
      )}
    </>
  );
}