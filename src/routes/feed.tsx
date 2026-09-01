import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/social/AppShell";
import { Composer } from "@/components/social/Composer";
import { PostCard } from "@/components/social/PostCard";
import { DefaultRail } from "@/components/social/RightRail";
import { Avatar } from "@/components/social/Avatar";
import { currentUser, posts as seedPosts, profiles, type Post } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Your Feed — Lumen" },
      {
        name: "description",
        content:
          "Your Lumen home: share a moment, follow live Spaces, and see posts from the creators and communities you care about.",
      },
      { property: "og:title", content: "Your Feed — Lumen" },
      {
        property: "og:description",
        content: "Share moments, join live Spaces, and discover creators on Lumen.",
      },
    ],
  }),
  component: FeedPage,
});

const tabs = ["For you", "Following", "Latest"] as const;

function Stories() {
  const people = [currentUser, ...profiles.filter((p) => p.id !== currentUser.id)];
  return (
    <div className="glass-panel rounded-3xl p-4 shadow-soft">
      <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
        {people.map((p, i) => (
          <button key={p.id} className="group flex w-16 shrink-0 flex-col items-center gap-2">
            <span
              className={cn(
                "rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105 group-active:scale-95",
                i === 0
                  ? "bg-border"
                  : "bg-gradient-to-tr from-brand via-brand-pink to-brand-orange",
              )}
            >
              <span className="block rounded-full bg-card p-[2px]">
                <Avatar name={p.display_name} src={p.avatar_url} className="h-14 w-14 text-sm" />
              </span>
            </span>
            <span className="w-full truncate text-center text-[0.7rem] font-medium text-muted-foreground">
              {i === 0 ? "Your story" : p.display_name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("For you");
  const [posts, setPosts] = useState<Post[]>(seedPosts);

  const visible =
    tab === "Following"
      ? posts.filter((p) => p.user_id !== currentUser.id)
      : tab === "Latest"
        ? [...posts].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        : posts;

  function addPost(content: string) {
    setPosts((prev) => [
      {
        id: `p_${Date.now()}`,
        user_id: currentUser.id,
        content,
        image_gradient: null,
        created_at: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        repostCount: 0,
        viewCount: 1,
        likedByMe: false,
        bookmarkedByMe: false,
        repostedByMe: false,
        tags: [],
      },
      ...prev,
    ]);
  }

  return (
    <AppShell title="Home" right={<DefaultRail />}>
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="glass-panel sticky top-2 z-30 flex items-center gap-1 rounded-full p-1.5 shadow-soft lg:top-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300",
                tab === t
                  ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <Stories />
        <Composer onPost={addPost} />

        <div className="space-y-5">
          {visible.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-brand" /> You're all caught up
        </div>
      </div>
    </AppShell>
  );
}
