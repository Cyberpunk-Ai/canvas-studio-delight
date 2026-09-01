import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radio, Mic, Calendar, Headphones, Play, Plus } from "lucide-react";
import { AppShell, Panel, PageHeader } from "@/components/social/AppShell";
import { RailFooter, SearchBox } from "@/components/social/RightRail";
import { Avatar } from "@/components/social/Avatar";
import { compact, getProfile, profiles, spaces, type Space } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/spaces")({
  head: () => ({
    meta: [
      { title: "Spaces — Live Audio Rooms on Lumen" },
      {
        name: "description",
        content:
          "Join live audio Spaces on Lumen: design clinics, photography workshops, and creator conversations happening right now.",
      },
      { property: "og:title", content: "Spaces — Live Audio Rooms on Lumen" },
      {
        property: "og:description",
        content: "Live audio rooms for creators: join, listen, or host your own Space.",
      },
    ],
  }),
  component: SpacesPage,
});

function SpaceCard({ space, index }: { space: Space; index: number }) {
  const host = getProfile(space.host_id);
  const guests = profiles.filter((p) => p.id !== space.host_id).slice(0, 4);
  return (
    <article
      style={{ animationDelay: `${index * 70}ms` }}
      className="group glass-panel animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden rounded-3xl p-6 shadow-soft duration-700 fill-mode-both transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      <span
        className={cn(
          "absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br opacity-25 blur-2xl transition-transform duration-700 group-hover:scale-125",
          space.gradient,
        )}
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          {space.live ? (
            <span className="flex items-center gap-1.5 rounded-full bg-rose-500/12 px-3 py-1 text-xs font-bold text-rose-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1 text-xs font-bold text-muted-foreground">
              <Calendar className="h-3 w-3" /> {space.startsIn}
            </span>
          )}
          <span className="rounded-full bg-brand/8 px-3 py-1 text-xs font-bold text-brand">
            {space.topic}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold leading-snug">{space.title}</h3>

        <div className="mt-4 flex items-center gap-3">
          <Avatar name={host.display_name} src={host.avatar_url} className="h-10 w-10 text-xs" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{host.display_name}</p>
            <p className="text-xs text-muted-foreground">Host</p>
          </div>
          <div className="ml-auto flex -space-x-2">
            {guests.map((g) => (
              <Avatar
                key={g.id}
                name={g.display_name}
                src={g.avatar_url}
                ring
                className="h-8 w-8 text-[0.6rem]"
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Headphones className="h-4 w-4" />
            {space.live ? `${compact(space.listeners)} listening` : "Reminder available"}
          </p>
          <button
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95",
              space.live
                ? "bg-gradient-to-r from-brand to-brand-pink text-white hover:shadow-glow"
                : "bg-foreground/5 text-foreground hover:bg-foreground/10",
            )}
          >
            {space.live ? <Play className="h-4 w-4 fill-current" /> : <Calendar className="h-4 w-4" />}
            {space.live ? "Join Space" : "Remind me"}
          </button>
        </div>
      </div>
    </article>
  );
}

const tabs = ["Live now", "Upcoming", "Recorded"] as const;

function SpacesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Live now");
  const list =
    tab === "Live now"
      ? spaces.filter((s) => s.live)
      : tab === "Upcoming"
        ? spaces.filter((s) => !s.live)
        : spaces;

  return (
    <AppShell
      title="Spaces"
      right={
        <div className="space-y-5">
          <SearchBox placeholder="Search Spaces" />
          <Panel>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
              <Mic className="h-4 w-4 text-brand" /> Host a Space
            </h2>
            <p className="text-sm text-muted-foreground">
              Go live in seconds. Invite co-hosts, open the floor, and record for later.
            </p>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-glow active:scale-[0.98]">
              <Plus className="h-4 w-4" /> Start a Space
            </button>
          </Panel>
          <RailFooter />
        </div>
      }
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Spaces"
          subtitle="Live audio rooms hosted by the people you follow."
          action={
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:shadow-glow active:scale-95">
              <Radio className="h-4 w-4" /> Go live
            </button>
          }
        />

        <div className="glass-panel flex gap-1 rounded-full p-1.5 shadow-soft">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300",
                tab === t
                  ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          {list.map((s, i) => (
            <SpaceCard key={s.id} space={s} index={i} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
