/**
 * Local demo data.
 *
 * These types intentionally mirror the future database schema
 * (profiles, posts, post_likes, post_comments, post_reposts, post_bookmarks,
 * follows, spaces, conversations, messages, notifications) so that swapping
 * this module for real queries later is a drop-in change.
 */

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  location: string;
  website: string;
  followers: number;
  following: number;
  verified: boolean;
};

export type Post = {
  id: string;
  user_id: string;
  content: string;
  image_gradient: string | null;
  created_at: string;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  viewCount: number;
  likedByMe: boolean;
  bookmarkedByMe: boolean;
  repostedByMe: boolean;
  tags: string[];
};

export type Space = {
  id: string;
  title: string;
  host_id: string;
  topic: string;
  listeners: number;
  live: boolean;
  startsIn: string | null;
  gradient: string;
};

export type Conversation = {
  id: string;
  participant_id: string;
  preview: string;
  updated_at: string;
  unread: number;
  online: boolean;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type Notification = {
  id: string;
  actor_id: string;
  type: "like" | "follow" | "comment" | "repost" | "mention" | "space";
  body: string;
  created_at: string;
  read: boolean;
};

/* -------------------------------- profiles -------------------------------- */

export const currentUserId = "u_me";

export const profiles: Profile[] = [
  {
    id: "u_me",
    username: "avery",
    display_name: "Avery Quinn",
    bio: "Designing calm interfaces for loud ideas. Building Lumen in public.",
    avatar_url: null,
    location: "Lisbon, PT",
    website: "avery.design",
    followers: 12480,
    following: 384,
    verified: true,
  },
  {
    id: "u_clara",
    username: "clarawrites",
    display_name: "Clara Meyer",
    bio: "Essays on attention, craft, and slow internet.",
    avatar_url: null,
    location: "Berlin, DE",
    website: "clara.ink",
    followers: 42310,
    following: 512,
    verified: true,
  },
  {
    id: "u_marcus",
    username: "marcusfilm",
    display_name: "Marcus Bell",
    bio: "Cinematographer. Golden hour obsessive.",
    avatar_url: null,
    location: "Los Angeles, US",
    website: "marcus.film",
    followers: 88120,
    following: 220,
    verified: true,
  },
  {
    id: "u_yuki",
    username: "yuki",
    display_name: "Yuki Tanaka",
    bio: "Spatial computing, tiny robots, big diagrams.",
    avatar_url: null,
    location: "Tokyo, JP",
    website: "yuki.dev",
    followers: 30470,
    following: 190,
    verified: false,
  },
  {
    id: "u_diego",
    username: "diegom",
    display_name: "Diego Márquez",
    bio: "Sound designer. Field recordings from everywhere.",
    avatar_url: null,
    location: "Mexico City, MX",
    website: "diego.audio",
    followers: 15600,
    following: 640,
    verified: false,
  },
  {
    id: "u_priya",
    username: "priyas",
    display_name: "Priya Sharma",
    bio: "Product engineer. Shipping small things daily.",
    avatar_url: null,
    location: "Bengaluru, IN",
    website: "priya.sh",
    followers: 21900,
    following: 410,
    verified: true,
  },
];

export function getProfile(id: string): Profile {
  return profiles.find((p) => p.id === id) ?? profiles[0]!;
}

export const currentUser = getProfile(currentUserId);

/* ---------------------------------- posts --------------------------------- */

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const posts: Post[] = [
  {
    id: "p1",
    user_id: "u_clara",
    content:
      "Spent the morning rewriting a paragraph eleven times. The eleventh one took forty seconds. The first ten were the price of admission.",
    image_gradient: null,
    created_at: minutesAgo(8),
    likeCount: 1284,
    commentCount: 96,
    repostCount: 212,
    viewCount: 48200,
    likedByMe: false,
    bookmarkedByMe: true,
    repostedByMe: false,
    tags: ["writing", "craft"],
  },
  {
    id: "p2",
    user_id: "u_marcus",
    content:
      "Shot this one entirely on a 40-year-old lens. Every flaw in the glass became part of the frame. Sometimes the imperfection is the look.",
    image_gradient: "from-orange-400 via-rose-400 to-violet-500",
    created_at: minutesAgo(42),
    likeCount: 5310,
    commentCount: 244,
    repostCount: 880,
    viewCount: 194000,
    likedByMe: true,
    bookmarkedByMe: false,
    repostedByMe: false,
    tags: ["GoldenHour", "photography"],
  },
  {
    id: "p3",
    user_id: "u_yuki",
    content:
      "Prototype note: spatial UI stops feeling like magic the moment latency crosses 90ms. Everything after that is just physics you can feel.",
    image_gradient: null,
    created_at: minutesAgo(120),
    likeCount: 2044,
    commentCount: 158,
    repostCount: 401,
    viewCount: 77400,
    likedByMe: false,
    bookmarkedByMe: false,
    repostedByMe: true,
    tags: ["SpatialComputing"],
  },
  {
    id: "p4",
    user_id: "u_diego",
    content:
      "Recorded a thunderstorm from inside a parked car at 3am. Pitched it down two octaves and it became the calmest thing I own.",
    image_gradient: "from-sky-400 via-cyan-400 to-emerald-400",
    created_at: minutesAgo(260),
    likeCount: 932,
    commentCount: 61,
    repostCount: 143,
    viewCount: 28900,
    likedByMe: false,
    bookmarkedByMe: true,
    repostedByMe: false,
    tags: ["sounddesign"],
  },
  {
    id: "p5",
    user_id: "u_priya",
    content:
      "Shipped a 12-line change that removed a 400-line abstraction. Best week of the quarter and nobody will ever notice. That's the job.",
    image_gradient: null,
    created_at: minutesAgo(420),
    likeCount: 3611,
    commentCount: 187,
    repostCount: 622,
    viewCount: 121000,
    likedByMe: true,
    bookmarkedByMe: false,
    repostedByMe: false,
    tags: ["engineering"],
  },
  {
    id: "p6",
    user_id: "u_me",
    content:
      "New design system pass: fewer shadows, one accent, real motion curves. The interface finally feels like it breathes.",
    image_gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    created_at: minutesAgo(700),
    likeCount: 1876,
    commentCount: 132,
    repostCount: 298,
    viewCount: 64300,
    likedByMe: false,
    bookmarkedByMe: false,
    repostedByMe: false,
    tags: ["LumenDesign", "design"],
  },
];

/* --------------------------------- spaces --------------------------------- */

export const spaces: Space[] = [
  {
    id: "s1",
    title: "Designing for calm: interfaces that don't shout",
    host_id: "u_me",
    topic: "Design",
    listeners: 1842,
    live: true,
    startsIn: null,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "s2",
    title: "Shooting golden hour without golden hour",
    host_id: "u_marcus",
    topic: "Photography",
    listeners: 964,
    live: true,
    startsIn: null,
    gradient: "from-orange-500 to-rose-500",
  },
  {
    id: "s3",
    title: "Latency is the whole product",
    host_id: "u_yuki",
    topic: "Technology",
    listeners: 0,
    live: false,
    startsIn: "in 2h",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    id: "s4",
    title: "Field recording clinic: bring your worst audio",
    host_id: "u_diego",
    topic: "Audio",
    listeners: 0,
    live: false,
    startsIn: "tomorrow, 18:00",
    gradient: "from-emerald-500 to-teal-500",
  },
];

/* ------------------------------ conversations ----------------------------- */

export const conversations: Conversation[] = [
  {
    id: "c1",
    participant_id: "u_clara",
    preview: "Okay the new draft is so much sharper. Sending notes tonight.",
    updated_at: minutesAgo(4),
    unread: 2,
    online: true,
  },
  {
    id: "c2",
    participant_id: "u_marcus",
    preview: "Frames attached — tell me which one you want for the cover.",
    updated_at: minutesAgo(55),
    unread: 0,
    online: true,
  },
  {
    id: "c3",
    participant_id: "u_priya",
    preview: "Merged it. The bundle dropped 40kb 🎉",
    updated_at: minutesAgo(180),
    unread: 1,
    online: false,
  },
  {
    id: "c4",
    participant_id: "u_yuki",
    preview: "Let's do the Space on Thursday instead?",
    updated_at: minutesAgo(1400),
    unread: 0,
    online: false,
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    conversation_id: "c1",
    sender_id: "u_clara",
    body: "Just read the section on motion. It finally clicks.",
    created_at: minutesAgo(30),
  },
  {
    id: "m2",
    conversation_id: "c1",
    sender_id: "u_me",
    body: "That one took four rewrites. Glad it landed.",
    created_at: minutesAgo(26),
  },
  {
    id: "m3",
    conversation_id: "c1",
    sender_id: "u_clara",
    body: "Can we pull the easing chart earlier? It answers the question before people ask it.",
    created_at: minutesAgo(12),
  },
  {
    id: "m4",
    conversation_id: "c1",
    sender_id: "u_me",
    body: "Good call. Moving it above the fold.",
    created_at: minutesAgo(9),
  },
  {
    id: "m5",
    conversation_id: "c1",
    sender_id: "u_clara",
    body: "Okay the new draft is so much sharper. Sending notes tonight.",
    created_at: minutesAgo(4),
  },
  {
    id: "m6",
    conversation_id: "c2",
    sender_id: "u_marcus",
    body: "Frames attached — tell me which one you want for the cover.",
    created_at: minutesAgo(55),
  },
  {
    id: "m7",
    conversation_id: "c3",
    sender_id: "u_priya",
    body: "Merged it. The bundle dropped 40kb 🎉",
    created_at: minutesAgo(180),
  },
  {
    id: "m8",
    conversation_id: "c4",
    sender_id: "u_yuki",
    body: "Let's do the Space on Thursday instead?",
    created_at: minutesAgo(1400),
  },
];

/* ------------------------------ notifications ----------------------------- */

export const notifications: Notification[] = [
  {
    id: "n1",
    actor_id: "u_clara",
    type: "like",
    body: "liked your post about the new design system pass",
    created_at: minutesAgo(6),
    read: false,
  },
  {
    id: "n2",
    actor_id: "u_marcus",
    type: "follow",
    body: "started following you",
    created_at: minutesAgo(38),
    read: false,
  },
  {
    id: "n3",
    actor_id: "u_priya",
    type: "comment",
    body: "commented: “the motion curves alone are worth the rewrite”",
    created_at: minutesAgo(96),
    read: false,
  },
  {
    id: "n4",
    actor_id: "u_yuki",
    type: "repost",
    body: "reposted your note on interface latency",
    created_at: minutesAgo(300),
    read: true,
  },
  {
    id: "n5",
    actor_id: "u_diego",
    type: "space",
    body: "is live in “Field recording clinic”",
    created_at: minutesAgo(640),
    read: true,
  },
  {
    id: "n6",
    actor_id: "u_clara",
    type: "mention",
    body: "mentioned you in a thread about slow internet",
    created_at: minutesAgo(1500),
    read: true,
  },
];

/* -------------------------------- discovery ------------------------------- */

export const trendingTags = [
  { tag: "#LumenDesign", category: "Design · Trending", count: "12.4k posts" },
  { tag: "#SpatialComputing", category: "Technology", count: "8.2k posts" },
  { tag: "#GoldenHour", category: "Photography", count: "6.9k posts" },
  { tag: "#SlowInternet", category: "Culture", count: "4.1k posts" },
  { tag: "#FieldRecording", category: "Audio", count: "2.7k posts" },
];

export const topics = [
  { name: "Design", gradient: "from-violet-500 to-fuchsia-500", posts: "128k" },
  { name: "Photography", gradient: "from-orange-500 to-rose-500", posts: "96k" },
  { name: "Technology", gradient: "from-sky-500 to-cyan-500", posts: "212k" },
  { name: "Audio", gradient: "from-emerald-500 to-teal-500", posts: "44k" },
  { name: "Writing", gradient: "from-amber-500 to-orange-500", posts: "73k" },
  { name: "Film", gradient: "from-indigo-500 to-violet-500", posts: "58k" },
];

/* --------------------------------- helpers -------------------------------- */

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

export function compact(n: number) {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
