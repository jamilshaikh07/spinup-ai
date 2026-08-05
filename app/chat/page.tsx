"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

const MODELS = [
  { id: "claude-sonnet-4-5", label: "Claude Sonnet", color: "#d97706" },
  { id: "gpt-4o", label: "GPT-4o", color: "#10b981" },
  { id: "deepseek-chat", label: "DeepSeek V3", color: "#6366f1" },
];

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next, model }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      setMessages([...next, { role: "assistant", content: full }]);
    }

    setStreaming(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const activeModel = MODELS.find((m) => m.id === model)!;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center text-xs font-bold">S</div>
          <span className="font-semibold text-white text-sm">Spinup AI</span>
        </Link>

        {/* Model selector */}
        <div className="flex gap-1">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                model === m.id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-300"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-2xl">✦</div>
            <h2 className="text-white font-semibold text-lg">What can I help you with?</h2>
            <p className="text-slate-500 text-sm max-w-sm">
              Currently using <span style={{ color: activeModel.color }}>{activeModel.label}</span>.
              Switch models anytime from the top.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {["Explain Kubernetes networking", "Write a Python script", "Debug this code", "Summarise this article"].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-3 py-2 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div key={i} className={clsx("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
              <div className={clsx(
                "w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold",
                msg.role === "user" ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-300"
              )}>
                {msg.role === "user" ? "J" : "AI"}
              </div>
              <div className={clsx(
                "rounded-2xl px-4 py-3 text-sm max-w-[85%]",
                msg.role === "user"
                  ? "bg-indigo-500/20 text-white rounded-tr-sm"
                  : "bg-white/5 text-slate-200 rounded-tl-sm"
              )}>
                {msg.role === "assistant"
                  ? <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{msg.content || "▋"}</ReactMarkdown>
                  : <p className="whitespace-pre-wrap">{msg.content}</p>
                }
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-white/5">
        <div className="max-w-3xl mx-auto flex gap-2 items-end bg-white/5 rounded-2xl border border-white/10 p-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message Spinup AI..."
            disabled={streaming}
            className="flex-1 bg-transparent resize-none text-sm text-white placeholder-slate-500 outline-none py-2 px-2 max-h-40 scrollbar-hide"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="w-8 h-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-2">
          Powered by routeplane · <span style={{ color: activeModel.color }}>{activeModel.label}</span>
        </p>
      </div>
    </div>
  );
}
