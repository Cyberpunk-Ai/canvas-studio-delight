import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Palette,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";
import { AppShell, PageHeader, Panel } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lumen" },
      {
        name: "description",
        content:
          "Manage your Lumen account: profile details, notification preferences, privacy controls and appearance — all in one place.",
      },
      { property: "og:title", content: "Settings — Lumen" },
      {
        property: "og:description",
        content: "Profile, notifications, privacy and appearance controls for your Lumen account.",
      },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & safety", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
] as const;

type SectionId = (typeof sections)[number]["id"];

function Toggle({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl p-3 transition-colors duration-300 hover:bg-foreground/5">
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
          on ? "bg-gradient-to-r from-brand to-brand-pink" : "bg-foreground/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
            on ? "translate-x-[1.4rem]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [active, setActive] = useState<SectionId>("profile");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.display_name,
    username: currentUser.username,
    bio: currentUser.bio,
    location: currentUser.location,
    website: currentUser.website,
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <AppShell title="Settings">
      <div className="mx-auto max-w-4xl space-y-5">
        <PageHeader title="Settings" subtitle="Tune Lumen to fit the way you work." />

        <div className="grid gap-5 md:grid-cols-[15rem_1fr]">
          <Panel className="h-fit p-2">
            <nav className="space-y-1">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = s.id === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-brand/12 to-brand-pink/12 text-brand"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                    <ChevronRight
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform duration-300",
                        isActive && "translate-x-0.5",
                      )}
                    />
                  </button>
                );
              })}
            </nav>
          </Panel>

          <Panel className="animate-in fade-in slide-in-from-bottom-2 duration-300" key={active}>
            {active === "profile" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={currentUser.display_name}
                    src={currentUser.avatar_url}
                    className="h-16 w-16 text-lg"
                  />
                  <div>
                    <p className="text-sm font-bold">Profile photo</p>
                    <button className="mt-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-bold transition-all duration-300 hover:bg-foreground/5 active:scale-95">
                      Upload new
                    </button>
                  </div>
                </div>

                <TextField label="Display name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <TextField label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-2xl bg-foreground/5 px-4 py-3 text-sm outline-none transition-shadow duration-300 focus:shadow-glow"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
                  <TextField label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
                </div>

                <button
                  onClick={save}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink px-6 py-3 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:shadow-glow active:scale-95"
                >
                  {saved ? <Check className="h-4 w-4" /> : null}
                  {saved ? "Saved" : "Save changes"}
                </button>
              </div>
            )}

            {active === "notifications" && (
              <div className="space-y-1">
                <Toggle label="Likes and reposts" description="Ping me when someone reacts to my posts." defaultOn />
                <Toggle label="New followers" description="Know when someone joins your audience." defaultOn />
                <Toggle label="Mentions and replies" description="Never miss a direct conversation." defaultOn />
                <Toggle label="Live Spaces" description="Alert me when people I follow go live." />
                <Toggle label="Email digest" description="A weekly summary of what you missed." />
              </div>
            )}

            {active === "privacy" && (
              <div className="space-y-1">
                <Toggle label="Private account" description="Only approved followers can see your posts." />
                <Toggle label="Hide activity status" description="Don't show when you were last online." />
                <Toggle label="Filter sensitive content" description="Blur media flagged by the community." defaultOn />
                <Toggle label="Allow message requests" description="Let people you don't follow reach you." defaultOn />
              </div>
            )}

            {active === "appearance" && (
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-bold">Accent</p>
                  <div className="flex gap-3">
                    {[
                      "from-violet-500 to-fuchsia-500",
                      "from-orange-500 to-rose-500",
                      "from-sky-500 to-cyan-500",
                      "from-emerald-500 to-teal-500",
                    ].map((g, i) => (
                      <button
                        key={g}
                        aria-label={`Accent ${i + 1}`}
                        className={cn(
                          "h-10 w-10 rounded-full bg-gradient-to-br transition-transform duration-300 hover:scale-110 active:scale-95",
                          g,
                          i === 0 && "ring-2 ring-brand ring-offset-2 ring-offset-card",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <Toggle label="Reduce motion" description="Minimise animations across the app." />
                <Toggle label="Larger text" description="Increase base font size for readability." />
              </div>
            )}

            {active === "security" && (
              <div className="space-y-1">
                <Toggle label="Two-factor authentication" description="Require a code at every new sign-in." defaultOn />
                <Toggle label="Login alerts" description="Email me about new devices." defaultOn />
                <div className="rounded-2xl bg-foreground/5 p-4 text-sm text-muted-foreground">
                  Account controls like password changes and session management arrive with the
                  backend.
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-foreground/5 px-4 py-3 text-sm outline-none transition-shadow duration-300 focus:shadow-glow"
      />
    </div>
  );
}
