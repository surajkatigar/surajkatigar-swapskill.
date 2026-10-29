export interface User {
  id: string;
  name: string;
  email: string;
  headline?: string;
  bio?: string;
  avatar?: string;
  credits: number;
  role: 'USER' | 'ADMIN';
  languages?: string;
  availability?: string;
  skills?: UserSkill[];
  portfolio?: PortfolioItem[];
  averageRating?: number;
  reviewCount?: number;
  completedSessions?: number;
  completedAsTeacher?: number;
  completedAsLearner?: number;
  createdAt?: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  category: string;
  type: 'TEACH' | 'LEARN';
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsExperience: number;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  projectUrl?: string;
  mediaUrl?: string;
}

export interface SessionBooking {
  id: string;
  learnerId: string;
  learner: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    headline?: string;
  };
  teacherId: string;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    headline?: string;
  };
  skillName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
  escrowCreditLocked: boolean;
  learnerConfirmed: boolean;
  teacherConfirmed: boolean;
  meetingLink?: string;
  location?: string;
  goalDescription?: string;
  createdAt: string;
  reviews?: Review[];
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  sessionId?: string;
  description: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  sessionId?: string;
  content: string;
  attachmentUrl?: string;
  fileName?: string;
  read: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  skillQualityRating: number;
  punctualityRating: number;
  createdAt: string;
  reviewer?: {
    id: string;
    name: string;
    avatar?: string;
    headline?: string;
  };
  session?: {
    skillName: string;
    scheduledAt: string;
  };
}

export interface Workshop {
  id: string;
  hostId: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
    headline?: string;
  };
  title: string;
  description: string;
  category: string;
  scheduledAt: string;
  durationMinutes: number;
  maxParticipants: number;
  creditCost: number;
  meetingLink?: string;
  enrollments: { userId: string }[];
}

export interface LearningCircle {
  id: string;
  creatorId: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
    headline?: string;
  };
  title: string;
  topic: string;
  category: string;
  goalDescription: string;
  meetingSchedule: string;
  members: {
    userId: string;
    user: { id: string; name: string; avatar?: string };
  }[];
}

export interface PracticeTask {
  id: string;
  teacherId: string;
  teacher: { id: string; name: string; avatar?: string };
  learnerId: string;
  learner: { id: string; name: string; avatar?: string };
  sessionId?: string;
  session?: { skillName: string };
  title: string;
  instructions: string;
  submissionText?: string;
  feedback?: string;
  status: 'ASSIGNED' | 'SUBMITTED' | 'REVIEWED';
  createdAt: string;
}

export interface MatchResult {
  user: User;
  matchType: 'MUTUAL_EXCHANGE' | 'CAN_TEACH_YOU' | 'WANTS_YOUR_SKILL' | 'EXPLORE';
  matchScore: number;
  canTeachMe: string[];
  canLearnFromMe: string[];
}
