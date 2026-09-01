import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Link2,
  MapPin,
  Settings2,
  Share2,
  Grid3X3,
} from "lucide-react";
import { AppShell, Panel } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import { PostCard } from "@/components/social/PostCard";
import { DefaultRail } from "@/components/social/RightRail";
import { compact, currentUser, posts, profiles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `${currentUser.display_name} (@${currentUser.username}) — Lumen` },
      {
        name: "description",
        content:
          "Your Lumen profile: posts, replies, media and the Spaces you host — with follower stats and a bio you control.",
      },
      { property: "og:title", content: `${currentUser.display_name} on Lumen` },
      { property: "og:description", content: currentUser.bio },
    ],
  }),
  component: ProfilePage,
});

const tabs = ["Posts", "Replies", "Media", "Likes"] as const;

function ProfilePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Posts");
  const [following, setFollowing] = useState(false);

  const mine = posts.filter((p) => p.user_id === currentUser.id);
  const media = posts.filter((p) => p.image_gradient);
  const liked = posts.filter((p) => p.likedByMe);
  const list = tab === "Posts" ? mine : tab === "Media" ? media : tab === "Likes" ? liked : posts.slice(0, 3);

  return (
    <AppShell title="Profile" right={<DefaultRail />}>
      <div className="mx-auto max-w-2xl space-y-5">
        {/* cover */}
        <div className="glass-panel overflow-hidden rounded-3xl shadow-soft">
          <div className="relative h-40 bg-gradient-to-br from-brand via-brand-pink to-brand-orange sm:h-52">
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_30%,white,transparent_55%)]" />
          </div>
          <div className="px-5 pb-5">
            <div className="-mt-12 flex items-end justify-between gap-3">
              <Avatar
                name={currentUser.display_name}
                src={currentUser.avatar_url}
                className="h-24 w-24 text-2xl ring-4 ring-card"
              />
              <div className="mb-1 flex items-center gap-2">
                <button className="rounded-full border border-border p-2.5 transition-all duration-300 hover:bg-foreground/5 active:scale-95">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="rounded-full border border-border p-2.5 transition-all duration-300 hover:bg-foreground/5 active:scale-95">
                  <Settings2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95",
                    following
                      ? "border border-border hover:bg-foreground/5"
                      : "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft hover:shadow-glow",
                  )}
                >
                  {following ? "Following" : "Edit profile"}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h1 className="flex items-center gap-1.5 text-2xl font-extrabold tracking-tight">
                {currentUser.display_name}
                {currentUser.verified && <BadgeCheck className="h-5 w-5 text-brand" />}
              </h1>
              <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed">{currentUser.bio}</p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {currentUser.location}
                </span>
                <span className="flex items-center gap-1.5 text-brand">
                  <Link2 className="h-4 w-4" /> {currentUser.website}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> Joined March 2021
                </span>
              </div>

              <div className="mt-4 flex gap-6 text-sm">
                <span>
                  <strong className="font-extrabold">{compact(currentUser.following)}</strong>{" "}
                  <span className="text-muted-foreground">Following</span>
                </span>
                <span>
                  <strong className="font-extrabold">{compact(currentUser.followers)}</strong>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </span>
                <span>
                  <strong className="font-extrabold">{mine.length}</strong>{" "}
                  <span className="text-muted-foreground">Posts</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* followed by */}
        <Panel className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {profiles.slice(1, 5).map((p) => (
              <Avatar key={p.id} name={p.display_name} src={p.avatar_url} ring className="h-8 w-8 text-[0.6rem]" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Followed by <strong className="font-semibold text-foreground">Clara</strong>,{" "}
            <strong className="font-semibold text-foreground">Marcus</strong> and 1.2k others
          </p>
        </Panel>

        {/* tabs */}
        <div className="glass-panel sticky top-2 z-30 flex items-center gap-1 rounded-full p-1.5 shadow-soft lg:top-4">
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

        <div className="space-y-5">
          {list.map((p, i) => (
            <PostCard key={`${tab}-${p.id}`} post={p} index={i} />
          ))}
          {list.length === 0 && (
            <Panel className="flex flex-col items-center gap-3 py-14 text-center">
              <Grid3X3 className="h-8 w-8 text-muted-foreground" />
              <p className="font-bold">Nothing in {tab.toLowerCase()} yet</p>
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
