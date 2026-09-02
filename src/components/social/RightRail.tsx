import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, TrendingUp, Radio, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/social/Avatar";
import { Panel } from "@/components/social/AppShell";
import { compact, spaces, trendingTags, currentUserId } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SearchBox({
  placeholder = "Search Lumen",
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const navigate = useNavigate();
  const [local, setLocal] = useState("");
  const controlled = onChange !== undefined;
  const v = controlled ? (value ?? "") : local;

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (!controlled && v.trim()) navigate({ to: "/explore", search: { q: v.trim() } });
      }}
      className="group relative"
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
      <input
        value={v}
        onChange={(e) => (controlled ? onChange(e.target.value) : setLocal(e.target.value))}
        placeholder={placeholder}
        aria-label={placeholder}
        className="glass-panel h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:shadow-soft focus:ring-2 focus:ring-brand/30"
      />
    </form>
  );
}

export function FollowButton({ userId, size = "sm" }: { userId: string; size?: "sm" | "md" }) {
  const { isFollowing, dispatch, getProfile } = useStore();
  const following = isFollowing(userId);
  if (userId === currentUserId) return null;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "toggleFollow", userId });
        toast.success(following ? `Unfollowed ${getProfile(userId).display_name}` : `Following ${getProfile(userId).display_name}`);
      }}
      aria-pressed={following}
      className={cn(
        "flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 active:scale-95",
        size === "sm" ? "px-4 py-1.5 text-xs" : "px-5 py-2.5 text-sm",
        following
          ? "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
          : "bg-gradient-to-r from-brand to-brand-pink text-white hover:shadow-glow",
      )}
    >
      {following ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {following ? "Following" : "Follow"}
    </button>
  );
}

export function TrendingPanel() {
  return (
    <Panel>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <TrendingUp className="h-4 w-4 text-brand" /> Trending now
      </h2>
      <ul className="space-y-1">
        {trendingTags.slice(0, 4).map((t) => (
          <li key={t.tag}>
            <Link
              to="/explore"
              search={{ q: t.tag }}
              className="block rounded-2xl px-3 py-2.5 transition-colors duration-300 hover:bg-foreground/5"
            >
              <p className="text-xs text-muted-foreground">{t.category}</p>
              <p className="font-bold">{t.tag}</p>
              <p className="text-xs text-muted-foreground">{t.count}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SuggestionsPanel() {
  const { profiles, isFollowing } = useStore();
  const people = profiles.filter((p) => p.id !== currentUserId && !isFollowing(p.id)).slice(0, 3);
  if (people.length === 0) return null;
  return (
    <Panel>
      <h2 className="mb-4 text-lg font-bold">Who to follow</h2>
      <ul className="space-y-3">
        {people.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <Link to="/u/$username" params={{ username: p.username }}>
              <Avatar name={p.display_name} src={p.avatar_url} className="h-10 w-10 text-xs" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to="/u/$username"
                params={{ username: p.username }}
                className="block truncate text-sm font-bold hover:underline"
              >
                {p.display_name}
              </Link>
              <p className="truncate text-xs text-muted-foreground">
                @{p.username} · {compact(p.followers)} followers
              </p>
            </div>
            <FollowButton userId={p.id} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function LiveSpacesPanel() {
  const live = spaces.filter((s) => s.live);
  return (
    <Panel>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
        </span>
        Live Spaces
      </h2>
      <ul className="space-y-3">
        {live.map((s) => (
          <li key={s.id}>
            <Link
              to="/spaces"
              search={{ join: s.id }}
              className="block overflow-hidden rounded-2xl p-3 transition-colors duration-300 hover:bg-foreground/5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                    s.gradient,
                  )}
                >
                  <Radio className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {compact(s.listeners)} listening
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function RailFooter() {
  const links = ["About", "Help", "Privacy", "Terms", "Guidelines", "Status"];
  return (
    <p className="px-4 text-xs leading-relaxed text-muted-foreground">
      {links.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => toast(`${l} page coming soon`)}
          className="mr-2 transition-colors hover:text-brand"
        >
          {l}
        </button>
      ))}
      <span className="mt-2 block">© 2026 Lumen</span>
    </p>
  );
}

export function DefaultRail() {
  return (
    <div className="space-y-5">
      <SearchBox />
      <TrendingPanel />
      <LiveSpacesPanel />
      <SuggestionsPanel />
      <RailFooter />
    </div>
  );
}
