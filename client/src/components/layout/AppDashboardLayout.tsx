import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Bell, Search, Users, ChevronDown, Sparkles } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/app-1-utils/sidebar";
import { App1Sidebar } from "@/components/ui/app-1-utils/app-1-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreditBadge } from "@/components/CreditBadge";
import { useAuth } from "@/context/AuthContext";
import { app1User } from "@/components/ui/app-1-utils/app-1-data";
import api from "@/services/api";
import { User } from "@/types";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Skill Exchange Overview", subtitle: "Live trading metrics, active swaps, and throughput" },
  "/matches": { title: "Peer Barter Matches", subtitle: "AI-powered reciprocity matching across your skill inventory" },
  "/explore": { title: "Explore Skills Catalog", subtitle: "Discover peer skills across tech, design, and business" },
  "/sessions": { title: "Skill Exchange Sessions", subtitle: "Booked sessions, Google Meet rooms, and escrow status" },
  "/chat": { title: "Messages & Collab Hub", subtitle: "Direct peer communication and video session links" },
  "/workshops": { title: "Group Skill Workshops", subtitle: "Multi-participant interactive webinars & bootcamps" },
  "/circles": { title: "Learning Circles", subtitle: "Cohort-based peer study groups and weekly goals" },
  "/practice": { title: "Practice Tasks & Bounties", subtitle: "Hands-on projects reviewed by senior community mentors" },
  "/profile": { title: "My Profile & Skills", subtitle: "Manage your offer skills, learning wishlist, and barter reputation" },
  "/admin": { title: "Admin Operations Console", subtitle: "Platform governance, dispute adjudication, and category taxonomies" },
};

export const AppDashboardLayout: React.FC = () => {
  const location = useLocation();
  const { user, switchDemoUser } = useAuth();
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    api.get("/auth/demo-users")
      .then((res) => setDemoUsers(res.data))
      .catch((e) => console.error(e));
  }, []);

  const handleSwitchUser = async (du: User) => {
    setIsSwitching(true);
    setShowDemoDropdown(false);
    await switchDemoUser(du);
    setIsSwitching(false);
  };

  const displayName = user?.name || app1User.name;
  const displayAvatar = user?.avatar || app1User.avatar;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const currentInfo = PAGE_TITLES[location.pathname] || {
    title: `Welcome back, ${displayName.split(" ")[0]}`,
    subtitle: "SwapSkill Peer-to-Peer Barter Network",
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <App1Sidebar />

      <SidebarInset className="min-w-0 bg-[#070709] text-slate-100 flex flex-col flex-1">
        {/* Sticky App Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.08] bg-[#070709]/85 px-4 sm:px-6 backdrop-blur-md">
          <SidebarTrigger aria-label="Toggle navigation" className="text-slate-300 hover:text-white hover:bg-white/10" />

          {/* Current Page Title */}
          <div className="flex flex-col min-w-0 mr-auto">
            <h1 className="truncate text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentInfo.title}</span>
              {location.pathname === "/matches" && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  <Sparkles size={11} /> Reciprocal Barter
                </span>
              )}
            </h1>
            <p className="hidden md:block truncate text-[11px] text-slate-400">
              {currentInfo.subtitle}
            </p>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Credit Badge */}
            <CreditBadge />

            {/* Quick Persona Switcher */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                disabled={isSwitching}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 transition-colors disabled:opacity-50"
                title="Switch demo account to test reciprocal barter"
              >
                <Users size={13} className="text-indigo-400" />
                <span className="hidden md:inline">{isSwitching ? "Switching..." : "Switch Persona"}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {showDemoDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111116] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Test Account
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {demoUsers.map((du) => (
                      <button
                        key={du.id}
                        type="button"
                        disabled={isSwitching}
                        onClick={() => handleSwitchUser(du)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors ${
                          user?.id === du.id ? "bg-indigo-600/20 text-indigo-300" : "text-slate-300"
                        }`}
                      >
                        <img
                          src={du.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"}
                          alt={du.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-white">{du.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{du.headline}</p>
                        </div>
                        <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                          {du.credits}c
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              asChild
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <Link to="/explore">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </Button>

            <Link to="/profile" className="flex items-center gap-2 pl-1">
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className="bg-indigo-600 text-white text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Dashboard Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppDashboardLayout;
