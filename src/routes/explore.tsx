import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, TrendingUp, Users, Hash } from "lucide-react";
import { AppShell, Panel, PageHeader } from "@/components/social/AppShell";
import { PostCard } from "@/components/social/PostCard";
import { SearchBox, FollowButton, RailFooter } from "@/components/social/RightRail";
import { Avatar } from "@/components/social/Avatar";
import {
  compact,
  currentUserId,
  posts,
  profiles,
  topics,
  trendingTags,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Discover Creators & Topics on Lumen" },
      {
        name: "description",
        content:
          "Explore trending tags, rising creators, and the topics moving fastest across Lumen right now.",
      },
      { property: "og:title", content: "Explore — Discover Creators & Topics on Lumen" },
      {
        property: "og:description",
        content: "Trending tags, rising creators, and the topics moving fastest on Lumen.",
      },
    ],
  }),
  component: ExplorePage,
});

const filters = ["Top", "People", "Topics", "Media"] as const;

function ExplorePage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Top");
  const people = profiles.filter((p) => p.id !== currentUserId);

  return (
    <AppShell
      title="Explore"
      right={
        <div className="space-y-5">
          <Panel>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Hash className="h-4 w-4 text-brand" /> All trends
            </h2>
            <ul className="space-y-1">
              {trendingTags.map((t, i) => (
                <li
                  key={t.tag}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-foreground/5"
                >
                  <span className="w-4 text-sm font-bold text-muted-foreground">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate font-bold">{t.tag}</p>
                    <p className="text-xs text-muted-foreground">{t.count}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <RailFooter />
        </div>
      }
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader title="Explore" subtitle="What the community is lighting up right now." />

        <SearchBox placeholder="Search people, topics and posts" />

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 active:scale-95",
                filter === f
                  ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                  : "glass-panel text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Flame className="h-4 w-4 text-brand-orange" /> Topics for you
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <button
                key={t.name}
                style={{ animationDelay: `${i * 50}ms` }}
                className="group animate-in fade-in slide-in-from-bottom-3 relative overflow-hidden rounded-3xl p-5 text-left shadow-soft duration-700 fill-mode-both transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-110",
                    t.gradient,
                  )}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="relative block">
                  <span className="block text-lg font-bold text-white">{t.name}</span>
                  <span className="block text-sm text-white/80">{t.posts} posts</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Users className="h-4 w-4 text-brand" /> Rising creators
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {people.map((p, i) => (
              <div
                key={p.id}
                style={{ animationDelay: `${i * 50}ms` }}
                className="glass-panel animate-in fade-in slide-in-from-bottom-3 rounded-3xl p-5 shadow-soft duration-700 fill-mode-both transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={p.display_name} src={p.avatar_url} className="h-12 w-12 text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{p.display_name}</p>
                    <p className="truncate text-xs text-muted-foreground">@{p.username}</p>
                  </div>
                  <FollowButton />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.bio}</p>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                  {compact(p.followers)} followers · {compact(p.following)} following
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <TrendingUp className="h-4 w-4 text-brand-pink" /> Top posts today
          </h2>
          <div className="space-y-5">
            {[...posts]
              .sort((a, b) => b.likeCount - a.likeCount)
              .slice(0, 3)
              .map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
