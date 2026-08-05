import Link from "next/link";

const models = [
  { name: "Claude Sonnet", provider: "Anthropic", color: "#d97706" },
  { name: "GPT-4o", provider: "OpenAI", color: "#10b981" },
  { name: "DeepSeek V3", provider: "DeepSeek", color: "#6366f1" },
  { name: "Gemini Pro", provider: "Google", color: "#3b82f6" },
  { name: "Groq Llama", provider: "Groq", color: "#ec4899" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold">S</div>
          <span className="font-semibold text-white">Spinup AI</span>
        </div>
        <Link
          href="/chat"
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
        >
          Try free
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <div className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium">
          Claude · GPT-4o · DeepSeek · Gemini — one place
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
          All your AI models.
          <br />
          <span className="text-indigo-400">One subscription.</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl">
          Stop paying for 5 different AI subscriptions. Spinup AI gives you access to every major model
          in a single clean interface — at a fraction of the cost.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/chat"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          >
            Start chatting free
          </Link>
          <a
            href="mailto:jamilshaikh07@gmail.com"
            className="px-6 py-3 border border-white/10 hover:border-white/20 text-slate-300 rounded-lg font-medium transition-colors"
          >
            Get early access
          </a>
        </div>

        {/* Model pills */}
        <div className="flex gap-2 flex-wrap justify-center mt-4">
          {models.map((m) => (
            <div
              key={m.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <span className="text-slate-300">{m.name}</span>
              <span className="text-slate-500 text-xs">{m.provider}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
        {[
          { title: "Switch models instantly", desc: "Pick Claude for reasoning, DeepSeek for code, GPT-4o for writing. No re-logging." },
          { title: "Costs less", desc: "₹299/month covers what you'd pay ₹4,000+ for across individual subscriptions." },
          { title: "Built on real infra", desc: "Self-hosted gateway with token compression. Your data doesn't leave our servers." },
        ].map((f) => (
          <div key={f.title} className="p-8 flex flex-col gap-2">
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-white/5 px-6 py-4 text-center text-slate-500 text-xs">
        Spinup AI · Built by Jamil Shaikh · <a href="mailto:jamilshaikh07@gmail.com" className="hover:text-slate-300">jamilshaikh07@gmail.com</a>
      </footer>
    </main>
  );
}
