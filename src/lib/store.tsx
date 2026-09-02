/**
 * Client-side app store.
 *
 * Holds every piece of interactive state (posts, comments, follows,
 * notifications, profile edits, spaces) so actions persist across pages.
 * Backend hook-up point: swap the reducers below for Lovable Cloud queries.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  currentUserId,
  notifications as seedNotifications,
  posts as seedPosts,
  profiles as seedProfiles,
  type Notification,
  type Post,
  type Profile,
} from "@/lib/mock-data";

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  likeCount: number;
  likedByMe: boolean;
};

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const seedComments: Comment[] = [
  { id: "c_1", post_id: "p1", user_id: "u_priya", body: "The tenth draft is where the real writing starts. Every time.", created_at: minutesAgo(5), likeCount: 42, likedByMe: false },
  { id: "c_2", post_id: "p1", user_id: "u_marcus", body: "Same with grading footage. The first pass is just finding out what you don't want.", created_at: minutesAgo(3), likeCount: 18, likedByMe: true },
  { id: "c_3", post_id: "p2", user_id: "u_clara", body: "The falloff on the edges is gorgeous. What lens?", created_at: minutesAgo(30), likeCount: 77, likedByMe: false },
  { id: "c_4", post_id: "p2", user_id: "u_yuki", body: "Imperfection as texture. Filing this away for the next prototype.", created_at: minutesAgo(21), likeCount: 25, likedByMe: false },
  { id: "c_5", post_id: "p3", user_id: "u_me", body: "90ms is exactly where our testers started calling it 'laggy'. Wild how consistent that number is.", created_at: minutesAgo(80), likeCount: 61, likedByMe: false },
  { id: "c_6", post_id: "p5", user_id: "u_me", body: "Negative-line diffs are the best diffs.", created_at: minutesAgo(200), likeCount: 120, likedByMe: false },
  { id: "c_7", post_id: "p6", user_id: "u_priya", body: "the motion curves alone are worth the rewrite", created_at: minutesAgo(96), likeCount: 33, likedByMe: false },
  { id: "c_8", post_id: "p6", user_id: "u_clara", body: "It reads calmer. Fewer things asking for attention at once.", created_at: minutesAgo(60), likeCount: 29, likedByMe: false },
];

type State = {
  posts: Post[];
  comments: Comment[];
  profiles: Profile[];
  following: string[];
  notifications: Notification[];
  joinedSpaceId: string | null;
  reminders: string[];
  composerOpen: boolean;
  composerReplyTo: string | null;
  theme: "light" | "dark";
};

type Action =
  | { type: "toggleLike"; id: string }
  | { type: "toggleRepost"; id: string }
  | { type: "toggleBookmark"; id: string }
  | { type: "addPost"; content: string; tags: string[]; gradient: string | null }
  | { type: "deletePost"; id: string }
  | { type: "addComment"; postId: string; body: string }
  | { type: "toggleCommentLike"; id: string }
  | { type: "toggleFollow"; userId: string }
  | { type: "readNotification"; id: string }
  | { type: "readAllNotifications" }
  | { type: "joinSpace"; id: string | null }
  | { type: "toggleReminder"; id: string }
  | { type: "openComposer"; replyTo?: string }
  | { type: "closeComposer" }
  | { type: "updateProfile"; patch: Partial<Profile> }
  | { type: "setTheme"; theme: "light" | "dark" };

const initial: State = {
  posts: seedPosts,
  comments: seedComments,
  profiles: seedProfiles,
  following: ["u_clara", "u_priya"],
  notifications: seedNotifications,
  joinedSpaceId: null,
  reminders: [],
  composerOpen: false,
  composerReplyTo: null,
  theme: "light",
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "toggleLike":
      return {
        ...s,
        posts: s.posts.map((p) =>
          p.id === a.id
            ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likeCount + (p.likedByMe ? -1 : 1) }
            : p,
        ),
      };
    case "toggleRepost":
      return {
        ...s,
        posts: s.posts.map((p) =>
          p.id === a.id
            ? { ...p, repostedByMe: !p.repostedByMe, repostCount: p.repostCount + (p.repostedByMe ? -1 : 1) }
            : p,
        ),
      };
    case "toggleBookmark":
      return {
        ...s,
        posts: s.posts.map((p) => (p.id === a.id ? { ...p, bookmarkedByMe: !p.bookmarkedByMe } : p)),
      };
    case "addPost":
      return {
        ...s,
        posts: [
          {
            id: `p_${Date.now()}`,
            user_id: currentUserId,
            content: a.content,
            image_gradient: a.gradient,
            created_at: new Date().toISOString(),
            likeCount: 0,
            commentCount: 0,
            repostCount: 0,
            viewCount: 1,
            likedByMe: false,
            bookmarkedByMe: false,
            repostedByMe: false,
            tags: a.tags,
          },
          ...s.posts,
        ],
      };
    case "deletePost":
      return { ...s, posts: s.posts.filter((p) => p.id !== a.id) };
    case "addComment":
      return {
        ...s,
        comments: [
          ...s.comments,
          {
            id: `c_${Date.now()}`,
            post_id: a.postId,
            user_id: currentUserId,
            body: a.body,
            created_at: new Date().toISOString(),
            likeCount: 0,
            likedByMe: false,
          },
        ],
        posts: s.posts.map((p) => (p.id === a.postId ? { ...p, commentCount: p.commentCount + 1 } : p)),
      };
    case "toggleCommentLike":
      return {
        ...s,
        comments: s.comments.map((c) =>
          c.id === a.id
            ? { ...c, likedByMe: !c.likedByMe, likeCount: c.likeCount + (c.likedByMe ? -1 : 1) }
            : c,
        ),
      };
    case "toggleFollow": {
      const isFollowing = s.following.includes(a.userId);
      return {
        ...s,
        following: isFollowing ? s.following.filter((id) => id !== a.userId) : [...s.following, a.userId],
        profiles: s.profiles.map((p) => {
          if (p.id === a.userId) return { ...p, followers: p.followers + (isFollowing ? -1 : 1) };
          if (p.id === currentUserId) return { ...p, following: p.following + (isFollowing ? -1 : 1) };
          return p;
        }),
      };
    }
    case "readNotification":
      return { ...s, notifications: s.notifications.map((n) => (n.id === a.id ? { ...n, read: true } : n)) };
    case "readAllNotifications":
      return { ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) };
    case "joinSpace":
      return { ...s, joinedSpaceId: a.id };
    case "toggleReminder":
      return {
        ...s,
        reminders: s.reminders.includes(a.id) ? s.reminders.filter((r) => r !== a.id) : [...s.reminders, a.id],
      };
    case "openComposer":
      return { ...s, composerOpen: true, composerReplyTo: a.replyTo ?? null };
    case "closeComposer":
      return { ...s, composerOpen: false, composerReplyTo: null };
    case "updateProfile":
      return { ...s, profiles: s.profiles.map((p) => (p.id === currentUserId ? { ...p, ...a.patch } : p)) };
    case "setTheme":
      return { ...s, theme: a.theme };
  }
}

const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  const { state, dispatch } = ctx;

  const getProfile = useCallback(
    (id: string) => state.profiles.find((p) => p.id === id) ?? state.profiles[0]!,
    [state.profiles],
  );
  const getProfileByUsername = useCallback(
    (username: string) => state.profiles.find((p) => p.username === username),
    [state.profiles],
  );
  const isFollowing = useCallback((id: string) => state.following.includes(id), [state.following]);
  const commentsFor = useCallback(
    (postId: string) => state.comments.filter((c) => c.post_id === postId),
    [state.comments],
  );

  return {
    ...state,
    dispatch,
    me: getProfile(currentUserId),
    unreadNotifications: state.notifications.filter((n) => !n.read).length,
    getProfile,
    getProfileByUsername,
    isFollowing,
    commentsFor,
  };
}

export function extractTags(text: string) {
  return Array.from(new Set(Array.from(text.matchAll(/#(\w+)/g), (m) => m[1]!)));
}
