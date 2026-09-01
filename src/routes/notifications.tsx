import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, UserPlus, MessageCircle, Repeat2, AtSign, Radio, CheckCheck, BellOff } from "lucide-react";
import { AppShell, PageHeader, Panel } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import { DefaultRail } from "@/components/social/RightRail";
import { getProfile, notifications as seed, timeAgo, type Notification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Lumen" },
      {
        name: "description",
        content:
          "Every like, follow, mention and live Space invite in one clean timeline. Stay close to your Lumen community without the noise.",
      },
      { property: "og:title", content: "Notifications — Lumen" },
      {
        property: "og:description",
        content: "Likes, follows, mentions and Space invites — all in one calm timeline.",
      },
    ],
  }),
  component: NotificationsPage,
});

const meta: Record<Notification["type"], { icon: typeof Heart; tint: string }> = {
  like: { icon: Heart, tint: "from-rose-500 to-pink-500" },
  follow: { icon: UserPlus, tint: "from-violet-500 to-fuchsia-500" },
  comment: { icon: MessageCircle, tint: "from-sky-500 to-cyan-500" },
  repost: { icon: Repeat2, tint: "from-emerald-500 to-teal-500" },
  mention: { icon: AtSign, tint: "from-amber-500 to-orange-500" },
  space: { icon: Radio, tint: "from-indigo-500 to-violet-500" },
};

const filters = ["All", "Mentions", "Follows", "Likes"] as const;

function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(seed);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = items.filter((n) =>
    filter === "All"
      ? true
      : filter === "Mentions"
        ? n.type === "mention" || n.type === "comment"
        : filter === "Follows"
          ? n.type === "follow"
          : n.type === "like" || n.type === "repost",
  );

  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell title="Notifications" right={<DefaultRail />}>
      <div className="mx-auto max-w-2xl space-y-5">
        <PageHeader
          title="Notifications"
          subtitle={unread ? `${unread} new since your last visit` : "You're all caught up"}
          action={
            <button
              onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-foreground/5 active:scale-95"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          }
        />

        <div className="glass-panel flex items-center gap-1 rounded-full p-1.5 shadow-soft">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300",
                filter === f
                  ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visible.map((n, i) => {
            const actor = getProfile(n.actor_id);
            const { icon: Icon, tint } = meta[n.type];
            return (
              <button
                key={n.id}
                onClick={() =>
                  setItems((p) => p.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                }
                style={{ animationDelay: `${i * 45}ms` }}
                className={cn(
                  "glass-panel flex w-full animate-in items-start gap-3 rounded-3xl p-4 text-left shadow-soft transition-all duration-300 fade-in slide-in-from-bottom-3 hover:-translate-y-0.5 hover:shadow-lift",
                  !n.read && "ring-1 ring-brand/25",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white",
                    tint,
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <Avatar name={actor.display_name} src={actor.avatar_url} className="h-6 w-6 text-[0.6rem]" />
                    <span className="truncate text-sm font-bold">{actor.display_name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{n.body}</span>
                </span>
                {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />}
              </button>
            );
          })}

          {visible.length === 0 && (
            <Panel className="flex flex-col items-center gap-3 py-12 text-center">
              <BellOff className="h-8 w-8 text-muted-foreground" />
              <p className="font-bold">Nothing here yet</p>
              <p className="text-sm text-muted-foreground">
                New {filter.toLowerCase()} will show up in this tab.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
