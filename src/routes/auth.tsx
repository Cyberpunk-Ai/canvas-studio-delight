import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Join Lumen — Sign in or create your account" },
      {
        name: "description",
        content:
          "Sign in to Lumen or create a free account to share moments, join live Spaces, and follow the creators you love.",
      },
      { property: "og:title", content: "Join Lumen — Sign in or create your account" },
      {
        property: "og:description",
        content: "Create your free Lumen account and join creators and communities in minutes.",
      },
    ],
  }),
  component: AuthPage,
});

const perks = [
  "Smart feeds tuned to what you actually care about",
  "Live Spaces with crystal-clear audio",
  "Private, encrypted conversations",
];

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/feed" }), 700);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-24 top-0 h-[30rem] w-[30rem] rounded-full bg-violet-300 blur-[140px]" />
        <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-pink-300 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-2">
        {/* pitch */}
        <div className="hidden lg:block">
          <Link to="/" className="mb-8 inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-pink">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">Lumen</span>
          </Link>
          <h1 className="max-w-md text-5xl font-extrabold leading-[1.05] tracking-tight">
            Where your world <span className="gradient-text">comes to life</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            One calm home for your posts, your people, and your live rooms.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-r from-brand to-brand-pink">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* form */}
        <div className="glass-panel mx-auto w-full max-w-md rounded-3xl p-7 shadow-lift">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-pink">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">Lumen</span>
          </Link>

          <div className="mb-6 flex rounded-full bg-foreground/5 p-1.5">
            {(["signup", "signin"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300",
                  mode === m
                    ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "signup" ? "Create account" : "Sign in"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <Field
                icon={User}
                label="Display name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Avery Quinn"
              />
            )}
            <Field
              icon={Mail}
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="you@example.com"
            />
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl bg-foreground/5 px-4 py-3 transition-shadow duration-300 focus-within:shadow-glow">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink px-6 py-3.5 font-bold text-white shadow-soft transition-all duration-300 hover:shadow-glow disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? "One moment…" : mode === "signup" ? "Create account" : "Sign in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Demo experience — no account is created yet. Backend coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl bg-foreground/5 px-4 py-3 transition-shadow duration-300 focus-within:shadow-glow">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
