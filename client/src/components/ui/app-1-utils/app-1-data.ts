import type { ChartConfig } from "@/components/ui/chart";

export const app1User = {
  name: "Alex Morgan",
  initials: "AM",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  email: "alex@swapskill.io",
  role: "Full-Stack Mentor",
};

export const app1Chart = [
  { week: "Wk 1", opened: 12, completed: 8 },
  { week: "Wk 2", opened: 18, completed: 15 },
  { week: "Wk 3", opened: 14, completed: 18 },
  { week: "Wk 4", opened: 22, completed: 20 },
  { week: "Wk 5", opened: 26, completed: 24 },
  { week: "Wk 6", opened: 19, completed: 25 },
  { week: "Wk 7", opened: 28, completed: 27 },
  { week: "Wk 8", opened: 32, completed: 30 },
];

export const app1ChartConfig: ChartConfig = {
  opened: {
    label: "Tasks Opened",
    color: "hsl(var(--primary))",
  },
  completed: {
    label: "Completed",
    color: "#10b981",
  },
};

export const app1Projects = [
  {
    id: "p-1",
    name: "Interactive Python Mentorship",
    status: "In progress" as const,
    description: "Mentoring developers in async concurrency & FastAPI patterns",
    progress: 78,
    dueDate: "Dec 12",
    team: [
      { name: "Alex", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80", initials: "AM" },
      { name: "Chloe", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&fit=crop&q=80", initials: "CD" },
    ],
  },
  {
    id: "p-2",
    name: "UI/UX & Design Systems Exchange",
    status: "In review" as const,
    description: "Figma token system architecture and dark-mode component library",
    progress: 92,
    dueDate: "Dec 05",
    team: [
      { name: "Marcus", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80", initials: "MV" },
    ],
  },
  {
    id: "p-3",
    name: "Machine Learning Foundations",
    status: "Planning" as const,
    description: "PyTorch embeddings and collaborative vector database indexing",
    progress: 35,
    dueDate: "Jan 15",
    team: [
      { name: "Sophia", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80", initials: "SL" },
      { name: "Alex", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80", initials: "AM" },
    ],
  },
];

export const app1Activity = [
  {
    id: "act-1",
    person: {
      name: "Chloe Davis",
      initials: "CD",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&fit=crop&q=80",
    },
    action: "completed a 60-min Rust fundamentals session with David R.",
    time: "25 minutes ago",
  },
  {
    id: "act-2",
    person: {
      name: "Marcus Vance",
      initials: "MV",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80",
    },
    action: "released 1.5 SwapSkill tokens via smart escrow verification.",
    time: "2 hours ago",
  },
  {
    id: "act-3",
    person: {
      name: "Sarah Kim",
      initials: "SK",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80",
    },
    action: "requested a skill swap for Advanced Docker Orchestration.",
    time: "4 hours ago",
  },
  {
    id: "act-4",
    person: {
      name: "David Ross",
      initials: "DR",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80",
    },
    action: 'left a 5.0 ★ review: "Clarified state machines and concurrency instantly!"',
    time: "Yesterday",
  },
];
