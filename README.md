# SwapSkill - Peer-to-Peer Skill Exchange Platform

> **Project Definition**: SwapSkill is a peer-to-peer web application where users exchange personal skills directly with peers without spending money, using a peer-matching and time-based credit system.

---

## 🚀 Key Highlights & Blueprint Alignment

### 1. Technology Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL / SQLite via Prisma ORM (bundled with seeded SQLite for immediate zero-config runnability)
- **Real-Time Chat**: Socket.IO with typing status, user presence & file sharing
- **Authentication**: JWT & HttpOnly cookies + password encryption

### 2. Time-Based Credit Engine
- **1. Signup**: New user immediately receives **2 starter credits**.
- **2. Booking**: **1 credit is held in escrow** when a 30-min session is confirmed by the teacher.
- **3. Session**: Peer conducts 30-minute learning session via live video or campus room.
- **4. Transfer**: 1 credit is transferred from escrow into the teacher's balance upon completion & mutual confirmation.
- **Refunds**: If cancelled or declined, escrow credits are automatically refunded to the learner.
- **Ledger**: Complete immutable credit history with transaction breakdowns.

### 3. Core Scope Features
- **User Profiles**: "Can Teach" and "Want to Learn" skills with proficiency levels (Beginner, Intermediate, Advanced, Expert) and schedule availability.
- **Smart Search & Filters**: Filter peers by category, language, level, and exchange direction.
- **Bi-Directional Peer Matchmaker**: Automated algorithm scoring mutual exchange compatibility (e.g. 98% match when User A teaches what User B needs AND User B teaches what User A needs).
- **Session Booking**: Propose, accept, decline, cancel, and mark sessions complete.
- **Direct Chat & Files**: In-app real-time messaging with Socket.IO, session context header, and practice attachments.
- **Ratings & Reviews**: 5-star scoring with teaching quality, punctuality ratings, and written testimonials.
- **Admin Dashboard**: Real-time metrics, skill categories taxonomy manager, and dispute resolution with escrow refund controls.

### 4. Value-Add Extra Features
- **Small Group Workshops**: One expert hosts a session for multiple learners simultaneously (e.g. Git workflows, French pronunciation).
- **Learning Circles**: Recurring study cohorts for shared milestones (e.g. LeetCode algorithms, UI/UX portfolio review).
- **Practice Tasks & Quizzes**: Teachers assign exercises between sessions; learners submit solutions; teachers deliver personalized feedback.
- **Skill Portfolio Evidence**: Attach sample projects, repositories, or external portfolio evidence to validate qualifications.

---

## 🏃 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start Backend Server
```bash
cd swapskill/server
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Start Frontend Client
```bash
cd swapskill/client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 👥 Demo Accounts (Password: `password123`)

| Name | Role / Expertise | Learning Goal | Credits |
|---|---|---|---|
| **Alex Rivera** (`alex@example.com`) | React & TypeScript (Expert) | Conversational French | 3 Credits |
| **Chloe Martin** (`chloe@example.com`) | French Teacher (Native) | React & TypeScript | 2 Credits |
| **David Kim** (`david@example.com`) | Python & Data Science (Expert) | Figma UI/UX Design | 4 Credits |
| **Priya Patel** (`priya@example.com`) | Product Designer (Expert) | Python for Data | 2 Credits |
| **Marcus Chen** (`marcus@example.com`) | Guitar & Music Theory | Public Speaking | 3 Credits |
| **Admin** (`admin@swapskill.com`) | Platform Safety & Disputes | Platform Moderation | 10 Credits |

*Tip: Use the **"Switch Persona"** dropdown in the top navigation bar to instantaneously swap between peers and test end-to-end exchanges!*
