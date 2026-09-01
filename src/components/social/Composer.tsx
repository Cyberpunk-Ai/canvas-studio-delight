import { useState } from "react";
import { Image as ImageIcon, Smile, MapPin, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/social/Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const LIMIT = 280;

export function Composer({ onPost }: { onPost?: (content: string) => void }) {
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [focused, setFocused] = useState(false);

  const remaining = LIMIT - draft.length;
  const pct = Math.min(draft.length / LIMIT, 1);
  const canPost = draft.trim().length > 0 && remaining >= 0 && !posting;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canPost) return;
    setPosting(true);
    // Backend hook-up point: replace with an insert into `posts`.
    window.setTimeout(() => {
      onPost?.(draft.trim());
      setDraft("");
      setPosting(false);
      toast.success("Posted to your feed");
    }, 500);
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "glass-panel rounded-3xl p-5 transition-all duration-500",
        focused ? "shadow-lift ring-1 ring-brand/25" : "shadow-soft",
      )}
    >
      <div className="flex gap-3">
        <Avatar name={currentUser.display_name} className="h-11 w-11 text-xs" />
        <div className="min-w-0 flex-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={focused || draft ? 3 : 1}
            placeholder="What's lighting you up today?"
            className="w-full resize-none bg-transparent text-[1.05rem] leading-relaxed placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
            <div className="flex items-center gap-0.5 text-brand">
              {[ImageIcon, Smile, MapPin, Sparkles].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label="Composer tool"
                  className="rounded-full p-2 transition-all duration-200 hover:bg-brand/10 active:scale-90"
                >
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                </button>
              ))}
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
