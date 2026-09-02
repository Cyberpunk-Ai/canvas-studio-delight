import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  BarChart3,
  MoreHorizontal,
  BadgeCheck,
  Link2,
  Trash2,
  UserPlus,
  UserMinus,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/social/Avatar";
import { compact, currentUserId, timeAgo, type Post } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
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
  onClick?: (e: React.MouseEvent) => void;
  filled?: boolean;
}) {
  const [pop, setPop] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setPop(true);
        onClick?.(e);
      }}
      onAnimationEnd={() => setPop(false)}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "group/action flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 sm:gap-2 sm:px-2.5",
        active ? activeClass : "hover:text-foreground",
      )}
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 group-hover/action:bg-foreground/5">
        <Icon
          className={cn(
            "h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-active/action:scale-90",
            active && "scale-110",
            active && filled && "fill-current",
            pop && active && "animate-in zoom-in-50 duration-300",
          )}
        />
      </span>
      {count !== undefined && <span className="tabular-nums">{compact(count)}</span>}
    </button>
  );
}

function PostContent({ text }: { text: string }) {
  const navigate = useNavigate();
  const parts = text.split(/(#\w+|@\w+)/g);
  return (
    <p className="mt-2 whitespace-pre-wrap text-[0.975rem] leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith("#")) {
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: "/explore", search: { q: part } });
              }}
              className="font-semibold text-brand hover:underline"
            >
              {part}
            </button>
          );
        }
        if (part.startsWith("@")) {
          return (
            <Link
              key={i}
              to="/u/$username"
              params={{ username: part.slice(1) }}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-brand hover:underline"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export function PostCard({
  post,
  index = 0,
  detail = false,
}: {
  post: Post;
  index?: number;
  detail?: boolean;
}) {
  const { getProfile, dispatch, isFollowing } = useStore();
  const navigate = useNavigate();
  const author = getProfile(post.user_id);
  const mine = post.user_id === currentUserId;
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [menu]);

  function openDetail() {
    if (detail) return;
    navigate({ to: "/post/$id", params: { id: post.id } });
  }

  async function share(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${author.display_name} on Lumen`, text: post.content, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      /* user cancelled */
    }
  }

  const following = isFollowing(post.user_id);

  return (
    <article
      onClick={openDetail}
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "glass-panel animate-in fade-in slide-in-from-bottom-3 rounded-3xl p-5 shadow-soft duration-700 ease-out fill-mode-both transition-all",
        !detail && "cursor-pointer hover:shadow-lift",
      )}
    >
      <header className="flex items-start gap-3">
        <Link
          to="/u/$username"
          params={{ username: author.username }}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 transition-transform duration-300 hover:scale-105"
        >
          <Avatar name={author.display_name} src={author.avatar_url} className="h-11 w-11 text-xs" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5">
            <Link
              to="/u/$username"
              params={{ username: author.username }}
              onClick={(e) => e.stopPropagation()}
              className="truncate font-bold hover:underline"
            >
              {author.display_name}
            </Link>
            {author.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />}
            <span className="truncate text-sm text-muted-foreground">@{author.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="shrink-0 text-sm text-muted-foreground">{timeAgo(post.created_at)}</span>
          </div>
          <PostContent text={post.content} />
        </div>

        <div ref={menuRef} className="relative">
          <button
            aria-label="More options"
            aria-expanded={menu}
            onClick={(e) => {
              e.stopPropagation();
              setMenu((m) => !m);
            }}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-panel absolute right-0 top-10 z-20 w-56 animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl p-1.5 shadow-lift duration-200"
            >
              <MenuItem
                icon={Link2}
                label="Copy link"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                  toast.success("Link copied");
                  setMenu(false);
                }}
              />
              {!mine && (
                <MenuItem
                  icon={following ? UserMinus : UserPlus}
                  label={following ? `Unfollow @${author.username}` : `Follow @${author.username}`}
                  onClick={() => {
                    dispatch({ type: "toggleFollow", userId: post.user_id });
                    toast.success(following ? `Unfollowed ${author.display_name}` : `Following ${author.display_name}`);
                    setMenu(false);
                  }}
                />
              )}
              {!mine && (
                <MenuItem
                  icon={Flag}
                  label="Report post"
                  onClick={() => {
                    toast("Thanks — we'll take a look.");
                    setMenu(false);
                  }}
                />
              )}
              {mine && (
                <MenuItem
                  icon={Trash2}
                  label="Delete post"
                  danger
                  onClick={() => {
                    dispatch({ type: "deletePost", id: post.id });
                    toast.success("Post deleted");
                    setMenu(false);
                    if (detail) navigate({ to: "/feed" });
                  }}
                />
              )}
            </div>
          )}
        </div>
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
            <button
              key={t}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: "/explore", search: { q: `#${t}` } });
              }}
              className="rounded-full bg-brand/8 px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand/15"
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      <footer className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
        <Action
          icon={Heart}
          label="Like"
          count={post.likeCount}
          active={post.likedByMe}
          filled
          activeClass="text-rose-500"
          onClick={() => dispatch({ type: "toggleLike", id: post.id })}
        />
        <Action
          icon={MessageCircle}
          label="Comment"
          count={post.commentCount}
          activeClass=""
          onClick={() => navigate({ to: "/post/$id", params: { id: post.id } })}
        />
        <Action
          icon={Repeat2}
          label="Repost"
          count={post.repostCount}
          active={post.repostedByMe}
          activeClass="text-emerald-500"
          onClick={() => {
            dispatch({ type: "toggleRepost", id: post.id });
            if (!post.repostedByMe) toast.success("Reposted to your followers");
          }}
        />
        <span className="hidden sm:block">
          <Action icon={BarChart3} label="Views" count={post.viewCount} activeClass="" />
        </span>
        <Action
          icon={Bookmark}
          label="Bookmark"
          active={post.bookmarkedByMe}
          filled
          activeClass="text-brand"
          onClick={() => {
            dispatch({ type: "toggleBookmark", id: post.id });
            toast.success(post.bookmarkedByMe ? "Removed from bookmarks" : "Saved to bookmarks");
          }}
        />
        <Action icon={Share2} label="Share" activeClass="" onClick={share} />
      </footer>
    </article>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Heart;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-foreground/5",
        danger ? "text-destructive" : "text-foreground",
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
