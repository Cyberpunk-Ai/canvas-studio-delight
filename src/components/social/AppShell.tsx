import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Home,
  Compass,
  Radio,
  MessagesSquare,
  Bell,
  Bookmark,
  User,
  Settings,
  Feather,
  Search,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Avatar } from "@/components/social/Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  to: string;
  icon: typeof Home;
  badge?: string;
};

export const navItems: NavItem[] = [
  { label: "Home", to: "/feed", icon: Home },
  { label: "Explore", to: "/explore", icon: Compass },
  { label: "Spaces", to: "/spaces", icon: Radio },
  { label: "Messages", to: "/messages", icon: MessagesSquare, badge: "3" },
  { label: "Notifications", to: "/notifications", icon: Bell, badge: "9+" },
  { label: "Bookmarks", to: "/bookmarks", icon: Bookmark },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Settings", to: "/settings", icon: Settings },
];

const mobileItems = navItems.filter((i) =>
  ["Home", "Explore", "Spaces", "Notifications", "Profile"].includes(i.label),
);

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === item.to;
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-[0.95rem] font-semibold transition-all duration-300",
        active
          ? "bg-gradient-to-r from-brand/12 to-brand-pink/12 text-brand"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand to-brand-pink transition-all duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        className={cn(
          "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
          active && "text-brand",
        )}
      />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto rounded-full bg-gradient-to-r from-brand to-brand-pink px-2 py-0.5 text-[0.65rem] font-bold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-2">
      <Link to="/" className="mb-4 flex items-center gap-2 px-4 py-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-pink">
          <Sparkles className="h-5 w-5 text-white" />
        </span>
        <span className="text-2xl font-extrabold tracking-tight">Lumen</span>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} item={item} onClick={onNavigate} />
        ))}
      </nav>

      <Link
        to="/feed"
        onClick={onNavigate}
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink px-6 py-3.5 font-bold text-white shadow-soft transition-all duration-300 hover:shadow-glow hover:brightness-105 active:scale-[0.98]"
      >
        <Feather className="h-4 w-4" /> Compose
      </Link>

      <div className="mt-auto pt-6">
        <div className="glass-panel flex items-center gap-3 rounded-2xl p-3 transition-shadow duration-300 hover:shadow-soft">
          <Avatar name={currentUser.display_name} className="h-10 w-10 text-xs" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{currentUser.display_name}</p>
            <p className="truncate text-xs text-muted-foreground">@{currentUser.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  right,
  title,
}: {
  children: ReactNode;
  right?: ReactNode;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div className="absolute -left-20 top-0 h-[26rem] w-[26rem] rounded-full bg-violet-300 blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-[24rem] w-[24rem] rounded-full bg-pink-300 blur-[130px]" />
      </div>

      {/* mobile top bar */}
      <header className="glass-panel sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="rounded-full p-2 transition-colors hover:bg-foreground/5"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg font-extrabold tracking-tight">{title}</span>
        <Link to="/explore" aria-label="Search" className="rounded-full p-2 hover:bg-foreground/5">
          <Search className="h-5 w-5" />
        </Link>
      </header>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[19rem] max-w-[85vw] bg-card p-5 shadow-lift transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="absolute right-4 top-4 rounded-full p-2 hover:bg-foreground/5"
          >
            <X className="h-5 w-5" />
          </button>
          <Sidebar onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] gap-6 px-4 pb-24 lg:px-6 lg:pb-10">
        <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 py-6 lg:block">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1 py-6">{children}</main>

        {right && (
          <aside className="sticky top-0 hidden h-screen w-[21rem] shrink-0 overflow-y-auto py-6 xl:block [scrollbar-width:none]">
            {right}
          </aside>
        )}
      </div>

      {/* mobile bottom nav */}
      <nav className="glass-panel fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 lg:hidden">
        {mobileItems.map((item) => (
          <MobileTab key={item.to} item={item} />
        ))}
      </nav>
    </div>
  );
}

function MobileTab({ item }: { item: NavItem }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === item.to;
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[0.65rem] font-semibold transition-colors",
        active ? "text-brand" : "text-muted-foreground",
      )}
    >
      <Icon className={cn("h-5 w-5 transition-transform duration-300", active && "scale-110")} />
      {item.label}
    </Link>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "glass-panel rounded-3xl p-5 shadow-soft transition-shadow duration-500 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
