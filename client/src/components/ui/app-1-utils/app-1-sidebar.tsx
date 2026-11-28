import {
  LayoutDashboard,
  Search,
  Sparkles,
  Calendar,
  MessageSquare,
  Users,
  Layers,
  BookOpen,
  ShieldCheck,
  Settings,
  HelpCircle,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useSidebar } from "@/components/ui/app-1-utils/sidebar";
import { app1User } from "@/components/ui/app-1-utils/app-1-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Peer Matches", icon: Sparkles, href: "/matches" },
  { label: "Explore Skills", icon: Search, href: "/explore" },
  { label: "Skill Sessions", icon: Calendar, href: "/sessions" },
  { label: "Chat & Messages", icon: MessageSquare, href: "/chat" },
  { label: "Workshops", icon: Users, href: "/workshops" },
  { label: "Learning Circles", icon: Layers, href: "/circles" },
  { label: "Practice Tasks", icon: BookOpen, href: "/practice" },
];

const SECONDARY_ITEMS = [
  { label: "My Profile", icon: Settings, href: "/profile" },
  { label: "Escrow & Credits", icon: CreditCard, href: "/dashboard" },
  { label: "Admin Console", icon: ShieldCheck, href: "/admin" },
  { label: "Support & FAQs", icon: HelpCircle, href: "/explore" },
];

export function App1Sidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();

  const currentUser = user || app1User;
  const displayName = user?.name || app1User.name;
  const displayEmail = user?.email || app1User.email;
  const displayAvatar = user?.avatar || app1User.avatar;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out shrink-0",
        open ? "w-64" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 text-white font-bold shadow-md shadow-indigo-500/20">
            S
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-foreground">SwapSkill</span>
              <span className="text-[10px] text-muted-foreground">Unified Skill Hub</span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-3">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {open && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 border-t pt-4">
          <nav className="flex flex-col gap-1">
            {SECONDARY_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {open && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 rounded-xl border bg-accent/40 p-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            {open && (
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-foreground">
                  {displayName}
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  {displayEmail}
                </span>
              </div>
            )}
            {open && logout && (
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
