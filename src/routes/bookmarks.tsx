import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Search } from "lucide-react";
import { AppShell, PageHeader, Panel } from "@/components/social/AppShell";
import { PostCard } from "@/components/social/PostCard";
import { DefaultRail } from "@/components/social/RightRail";
import { getProfile, posts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — Lumen" },
      {
        name: "description",
        content:
          "Your saved posts on Lumen. Keep the essays, frames and threads worth returning to in one private, searchable collection.",
      },
      { property: "og:title", content: "Bookmarks — Lumen" },
      {
        property: "og:description",
        content: "A private collection of the posts you saved on Lumen.",
      },
    ],
  }),
  component: BookmarksPage,
});

const collections = ["All saves", "Design", "Reading", "Inspiration"] as const;

function BookmarksPage() {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState<(typeof collections)[number]>("All saves");

  const saved = posts.filter((p) => p.bookmarkedByMe || p.tags.length > 0);
  const visible = saved.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const author = getProfile(p.user_id);
    return (
      p.content.toLowerCase().includes(q) ||
      author.display_name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <AppShell title="Bookmarks" right={<DefaultRail />}>
      <div className="mx-auto max-w-2xl space-y-5">
        <PageHeader
          title="Bookmarks"
          subtitle={`${saved.length} saved posts — only visible to you`}
        />

        <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-3 shadow-soft transition-shadow duration-300 focus-within:shadow-glow">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your saves"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {collections.map((c) => (
            <button
              key={c}
              onClick={() => setCollection(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 active:scale-95",
                collection === c
                  ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                  : "border border-border text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {visible.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}

          {visible.length === 0 && (
            <Panel className="flex flex-col items-center gap-3 py-14 text-center">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
              <p className="font-bold">No saves match that search</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Tap the bookmark icon on any post to keep it here for later.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
