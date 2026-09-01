import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark, Share2, BarChart3, MoreHorizontal, BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/social/Avatar";
import { compact, getProfile, timeAgo, type Post } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function Action({
  icon: Icon,
  count,
  active,
  activeClass,
  label,
  onClick,
  filled,
}: {
  icon: typeof Heart;
  count?: number;
  active?: boolean;
  activeClass: string;
  label: string;
  onClick?: () => void;
  filled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group/action flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200",
        active ? activeClass : "hover:text-foreground",
      )}
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 group-hover/action:bg-foreground/5">
        <Icon
          className={cn(
            "h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-active/action:scale-90",
            active && "scale-110",
            active && filled && "fill-current",
          )}
        />
      </span>
      {count !== undefined && <span className="tabular-nums">{compact(count)}</span>}
    </button>
  );
}

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const author = getProfile(post.user_id);
  const [state, setState] = useState({
    liked: post.likedByMe,
    likes: post.likeCount,
    reposted: post.repostedByMe,
    reposts: post.repostCount,
    saved: post.bookmarkedByMe,
  });

  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className="glass-panel animate-in fade-in slide-in-from-bottom-3 rounded-3xl p-5 shadow-soft duration-700 ease-out fill-mode-both transition-all hover:shadow-lift"
    >
      <header className="flex items-start gap-3">
        <Avatar name={author.display_name} src={author.avatar_url} className="h-11 w-11 text-xs" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-bold">{author.display_name}</p>
            {author.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />}
            <span className="truncate text-sm text-muted-foreground">@{author.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="shrink-0 text-sm text-muted-foreground">{timeAgo(post.created_at)}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-[0.975rem] leading-relaxed">{post.content}</p>
        </div>
        <button
          aria-label="More options"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      {post.image_gradient && (
        <div className="mt-4 overflow-hidden rounded-2xl">
          <div
            className={cn(
              "aspect-[16/10] w-full bg-gradient-to-br transition-transform duration-700 ease-out hover:scale-[1.03]",
              post.image_gradient,
            )}
          />
        </div>
      )}

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand/8 px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand/15"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <footer className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
        <Action
          icon={Heart}
          label="Like"
          count={state.likes}
          active={state.liked}
          filled
          activeClass="text-rose-500"
          onClick={() =>
            setState((s) => ({ ...s, liked: !s.liked, likes: s.likes + (s.liked ? -1 : 1) }))
          }
        />
        <Action icon={MessageCircle} label="Comment" count={post.commentCount} activeClass="" />
        <Action
          icon={Repeat2}
          label="Repost"
          count={state.reposts}
          active={state.reposted}
          activeClass="text-emerald-500"
          onClick={() =>
            setState((s) => ({
              ...s,
              reposted: !s.reposted,
              reposts: s.reposts + (s.reposted ? -1 : 1),
            }))
          }
        />
        <Action icon={BarChart3} label="Views" count={post.viewCount} activeClass="" />
        <Action
          icon={Bookmark}
          label="Bookmark"
          active={state.saved}
          filled
          activeClass="text-brand"
          onClick={() => setState((s) => ({ ...s, saved: !s.saved }))}
        />
        <Action icon={Share2} label="Share" activeClass="" />
      </footer>
    </article>
  );
}
