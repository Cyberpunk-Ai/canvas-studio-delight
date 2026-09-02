import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Smile, MapPin, Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/social/Avatar";
import { extractTags, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LIMIT = 280;

const gradients = [
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-orange-400 via-rose-400 to-violet-500",
  "from-sky-400 via-cyan-400 to-emerald-400",
  "from-amber-400 via-orange-500 to-rose-500",
];

const emojis = ["✨", "🔥", "🎉", "💜", "😂", "👀", "🙌", "☕"];

export function Composer({
  autoFocus = false,
  onPosted,
  placeholder = "What's lighting you up today?",
}: {
  autoFocus?: boolean;
  onPosted?: () => void;
  placeholder?: string;
}) {
  const { me, dispatch } = useStore();
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [focused, setFocused] = useState(autoFocus);
  const [gradient, setGradient] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const remaining = LIMIT - draft.length;
  const pct = Math.min(draft.length / LIMIT, 1);
  const canPost = draft.trim().length > 0 && remaining >= 0 && !posting;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canPost) return;
    setPosting(true);
    // Backend hook-up point: replace with an insert into `posts`.
    window.setTimeout(() => {
      const content = location ? `${draft.trim()}\n📍 ${location}` : draft.trim();
      dispatch({ type: "addPost", content, tags: extractTags(draft), gradient });
      setDraft("");
      setGradient(null);
      setLocation(null);
      setPosting(false);
      toast.success("Posted to your feed");
      onPosted?.();
    }, 450);
  }

  const expanded = focused || draft.length > 0 || gradient !== null;

  return (
    <form
      onSubmit={submit}
      className={cn(
        "glass-panel rounded-3xl p-5 transition-all duration-500",
        focused ? "shadow-lift ring-1 ring-brand/25" : "shadow-soft",
      )}
    >
      <div className="flex gap-3">
        <Avatar name={me.display_name} className="h-11 w-11 text-xs" />
        <div className="min-w-0 flex-1">
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit(e);
            }}
            rows={expanded ? 3 : 1}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent text-[1.05rem] leading-relaxed placeholder:text-muted-foreground focus:outline-none"
          />

          {gradient && (
            <div className="relative mt-2 animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl duration-300">
              <div className={cn("aspect-[16/9] w-full bg-gradient-to-br", gradient)} />
              <button
                type="button"
                onClick={() => setGradient(null)}
                aria-label="Remove image"
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur transition-transform hover:scale-110"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {location && (
            <button
              type="button"
              onClick={() => setLocation(null)}
              className="mt-2 flex items-center gap-1 rounded-full bg-brand/8 px-3 py-1 text-xs font-semibold text-brand"
            >
              <MapPin className="h-3 w-3" /> {location} <X className="h-3 w-3" />
            </button>
          )}

          {showEmoji && (
            <div className="mt-2 flex animate-in fade-in slide-in-from-top-1 flex-wrap gap-1 duration-200">
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setDraft((d) => d + e);
                    ref.current?.focus();
                  }}
                  className="rounded-xl p-1.5 text-lg transition-transform hover:scale-125 active:scale-95"
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
            <div className="flex items-center gap-0.5 text-brand">
              <button
                type="button"
                aria-label="Add image"
                onClick={() => setGradient(gradients[Math.floor(Math.random() * gradients.length)]!)}
                className="rounded-full p-2 transition-all duration-200 hover:bg-brand/10 active:scale-90"
              >
                <ImageIcon className="h-[1.1rem] w-[1.1rem]" />
              </button>
              <button
                type="button"
                aria-label="Add emoji"
                onClick={() => setShowEmoji((v) => !v)}
                className={cn(
                  "rounded-full p-2 transition-all duration-200 hover:bg-brand/10 active:scale-90",
                  showEmoji && "bg-brand/10",
                )}
              >
                <Smile className="h-[1.1rem] w-[1.1rem]" />
              </button>
              <button
                type="button"
                aria-label="Add location"
                onClick={() => setLocation(location ? null : me.location)}
                className="rounded-full p-2 transition-all duration-200 hover:bg-brand/10 active:scale-90"
              >
                <MapPin className="h-[1.1rem] w-[1.1rem]" />
              </button>
              <button
                type="button"
                aria-label="Polish with AI"
                onClick={() => {
                  if (!draft.trim()) return toast("Write something first, then I'll polish it ✨");
                  const polished = draft.trim().replace(/\s+/g, " ");
                  setDraft(polished.charAt(0).toUpperCase() + polished.slice(1));
                  toast.success("Tidied up your draft");
                }}
                className="rounded-full p-2 transition-all duration-200 hover:bg-brand/10 active:scale-90"
              >
                <Sparkles className="h-[1.1rem] w-[1.1rem]" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {draft.length > 0 && (
                <div className="relative h-7 w-7">
                  <svg viewBox="0 0 36 36" className="h-7 w-7 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" className="stroke-border" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${pct * 94.2} 94.2`}
                      className={cn(
                        "transition-all duration-300",
                        remaining < 0
                          ? "stroke-destructive"
                          : remaining < 40
                            ? "stroke-amber-500"
                            : "stroke-brand",
                      )}
                    />
                  </svg>
                  {remaining < 40 && (
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-[0.6rem] font-bold tabular-nums",
                        remaining < 0 ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {remaining}
                    </span>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={!canPost}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:shadow-glow hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {posting && <Loader2 className="h-4 w-4 animate-spin" />}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
