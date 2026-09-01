import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Send, Phone, Video, Info, Smile, Paperclip, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import {
  conversations as seedConversations,
  currentUserId,
  getProfile,
  messages as seedMessages,
  timeAgo,
  type Message,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Lumen" },
      {
        name: "description",
        content:
          "Private, fast conversations on Lumen. Catch up with collaborators, share frames, and keep every thread in one calm inbox.",
      },
      { property: "og:title", content: "Messages — Lumen" },
      {
        property: "og:description",
        content: "Private, fast conversations with the people you create with on Lumen.",
      },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const [activeId, setActiveId] = useState(seedConversations[0]!.id);
  const [all, setAll] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = seedConversations.find((c) => c.id === activeId)!;
  const partner = getProfile(active.participant_id);
  const thread = useMemo(
    () => all.filter((m) => m.conversation_id === activeId),
    [all, activeId],
  );

  const list = seedConversations.filter((c) => {
    const p = getProfile(c.participant_id);
    const q = query.toLowerCase();
    return !q || p.display_name.toLowerCase().includes(q) || p.username.includes(q);
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.length]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    setAll((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        conversation_id: activeId,
        sender_id: currentUserId,
        body,
        created_at: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  return (
    <AppShell title="Messages">
      <div className="glass-panel grid h-[calc(100vh-8.5rem)] grid-cols-1 overflow-hidden rounded-3xl shadow-soft lg:h-[calc(100vh-3rem)] lg:grid-cols-[20rem_1fr]">
        {/* conversation list */}
        <div
          className={cn(
            "flex min-h-0 flex-col border-border/60 lg:flex lg:border-r",
            mobileOpen ? "hidden" : "flex",
          )}
        >
          <div className="border-b border-border/60 p-4">
            <h1 className="mb-3 text-xl font-extrabold tracking-tight">Messages</h1>
            <div className="flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-width:thin]">
            {list.map((c) => {
              const p = getProfile(c.participant_id);
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveId(c.id);
                    setMobileOpen(true);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-brand/12 to-brand-pink/12"
                      : "hover:bg-foreground/5",
                  )}
                >
                  <span className="relative">
                    <Avatar name={p.display_name} src={p.avatar_url} className="h-11 w-11 text-xs" />
                    {c.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-bold">{p.display_name}</span>
                      <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                        {timeAgo(c.updated_at)}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="line-clamp-1 flex-1 text-xs text-muted-foreground">
                        {c.preview}
                      </span>
                      {c.unread > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-brand to-brand-pink px-1.5 text-[0.65rem] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
            {list.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">No conversations found.</p>
            )}
          </div>
        </div>

        {/* thread */}
        <div className={cn("flex min-h-0 flex-col", mobileOpen ? "flex" : "hidden lg:flex")}>
          <div className="flex items-center gap-3 border-b border-border/60 p-4">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Back to conversations"
              className="rounded-full p-2 transition-colors hover:bg-foreground/5 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <Avatar name={partner.display_name} src={partner.avatar_url} className="h-10 w-10 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{partner.display_name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {active.online ? "Active now" : `Active ${timeAgo(active.updated_at)} ago`}
              </p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              {[Phone, Video, Info].map((Icon, i) => (
                <button
                  key={i}
                  className="rounded-full p-2 transition-all duration-300 hover:bg-foreground/5 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 [scrollbar-width:thin]">
            {thread.map((m) => {
              const mine = m.sender_id === currentUserId;
              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex animate-in fade-in slide-in-from-bottom-2 duration-300",
                    mine ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[78%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed shadow-soft",
                      mine
                        ? "rounded-br-lg bg-gradient-to-r from-brand to-brand-pink text-white"
                        : "rounded-bl-lg bg-foreground/5",
                    )}
                  >
                    <p>{m.body}</p>
                    <p
                      className={cn(
                        "mt-1 text-[0.65rem]",
                        mine ? "text-white/70" : "text-muted-foreground",
                      )}
                    >
                      {timeAgo(m.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border/60 p-3">
            <div className="flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-2">
              <button className="rounded-full p-2 text-muted-foreground transition-colors hover:text-brand">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={`Message ${partner.display_name.split(" ")[0]}`}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="rounded-full p-2 text-muted-foreground transition-colors hover:text-brand">
                <Smile className="h-4 w-4" />
              </button>
              <button
                onClick={send}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-r from-brand to-brand-pink text-white transition-all duration-300 hover:shadow-glow disabled:opacity-40 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
