import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  MessageSquare,
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
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Find Matches", icon: Sparkles, href: "/matches" },
  { label: "Skill Sessions", icon: Calendar, href: "/sessions" },
  { label: "Messages", icon: MessageSquare, href: "/chat" },
  { label: "Community", icon: Users, href: "/dashboard" },
  { label: "Escrow & Credits", icon: CreditCard, href: "/dashboard" },
];

const SECONDARY_ITEMS = [
  { label: "Verification & Safety", icon: ShieldCheck, href: "/dashboard" },
  { label: "Preferences", icon: Settings, href: "/dashboard" },
  { label: "Support & FAQs", icon: HelpCircle, href: "/dashboard" },
];

export function App1Sidebar() {
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out shrink-0",
        open ? "w-64" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow">
          S
        </div>
        {open && (
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-sm text-foreground">SwapSkill</span>
            <span className="text-[10px] text-muted-foreground">Skill Trading Hub</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-3">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {open && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
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
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={app1User.avatar} alt={app1User.name} />
              <AvatarFallback>{app1User.initials}</AvatarFallback>
            </Avatar>
            {open && (
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-foreground">
                  {app1User.name}
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  {app1User.email}
                </span>
              </div>
            )}
            {open && (
              <button
                type="button"
                title="Sign out"
                className="text-muted-foreground hover:text-destructive p-1"
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
