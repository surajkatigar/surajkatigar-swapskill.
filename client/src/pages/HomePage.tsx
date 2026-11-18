import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coins,
  Users,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Workshop } from '../types';
import { RatingStars } from '../components/RatingStars';
import { BookingModal } from '../components/BookingModal';
import StippleOrbLanding from '../components/stipple-orb-landing/stipple-orb-landing';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

  useEffect(() => {
    api.get('/users?level=EXPERT')
      .then((res) => setFeaturedUsers(res.data.slice(0, 4)))
      .catch(() => {});
    api.get('/workshops')
      .then((res) => setWorkshops(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <StippleOrbLanding
        brand="SwapSkill"
        palette="swapskill"
        onNavigate={(path) => navigate(path)}
        logo={
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white mr-2 shadow-sm">
            <Sparkles size={16} />
          </div>
        }
        nav={[
          { label: "Explore Skills", href: "/explore" },
          { label: "How It Works", href: "#how" },
          { label: "Peer Matches", href: "/matches" },
          { label: "Workshops", href: "/workshops" },
          { label: "FAQ", href: "#faq" },
        ]}
        navAction={
          user
            ? { label: "Go to Dashboard", href: "/matches" }
            : { label: "Join & Get 2 Credits", href: "/register" }
        }
        hero={{
          title: "*Learn anything,*\nTrade Skills Directly",
          text: "The decentralized peer-to-peer barter network. Teach what you excel at—coding, design, languages, music—and bank time credits to learn from verified peers worldwide. No money. Pure knowledge exchange.",
          action: user
            ? { label: "View Peer Matches", href: "/matches" }
            : { label: "Get 2 Free Credits", href: "/register" },
          social: "Over 5,000+ peer exchanges completed",
          backersLabel: "Trending skill trades:",
          backers: [
            { name: "Full-Stack Dev ↔ UI/UX Design", mark: "rings" },
            { name: "Spanish ↔ Python", mark: "wave" },
            { name: "Music Production ↔ Video Editing", mark: "monogram" },
          ],
        }}
        thesis={{
          title: "Bootcamps and tutors charge thousands. *Peer barter is direct,* collaborative, and 100% free.",
          action: { label: "Browse Peer Directory", href: "/explore" },
          more: 340,
          stake: 0.5,
          investors: [
            { name: "Sarah Chen", amount: 140 },
            { name: "David Miller", amount: 95 },
            { name: "Elena Rostova", amount: 110 },
          ],
          streams: [
            { label: "Web & Software Dev", value: 3400, icon: "rocket" },
            { label: "UI/UX & 3D Design", value: 2150, icon: "spark" },
            { label: "Languages & Fluency", value: 1890, icon: "megaphone" },
            { label: "Music & Audio", value: 1420, icon: "note" },
            { label: "Data Science & AI", value: 1180, icon: "case" },
          ],
        }}
        paths={{
          title: "Teach your craft, or master something new",
          model: {
            income: 60,
            growth: 0.25,
            share: 0.8,
            raise: 120,
            years: 5,
          },
          investors: {
            title: "For Learners",
            text: "Book 1-on-1 sessions with verified practitioners across hundreds of topics. Every session is protected by smart escrow and 5-star peer reviews.",
            link: "Browse skills",
            bullets: [
              "100% non-monetary learning",
              "2 free credits immediately on signup",
              "Interactive 1-on-1 video & shared practice",
            ],
            caption: "Time credits spent on learning",
          },
          individuals: {
            title: "For Mentors & Teachers",
            text: "Share your expertise on your own schedule. Every 1 hour of teaching credits your account with 1 full credit to fund whatever you want to learn.",
            link: "Start teaching",
            bullets: [
              "Set your own flexible schedule",
              "Host group workshops for multiple learners",
              "Build a verified portfolio & community reputation",
            ],
            caption: "Learning credits earned by teaching",
          },
        }}
        steps={{
          title: "How SwapSkill Works",
          items: [
            {
              title: "1. Create your profile",
              text: "Select what skills you can teach and what you want to learn. Get 2 free starter credits instantly.",
            },
            {
              title: "2. Smart peer matching",
              text: "Find complementary peers with reciprocal interests, or join small-group community workshops.",
            },
            {
              title: "3. Learn & exchange",
              text: "Hold a 1-on-1 session. Credits are held safely in escrow and transferred upon confirmed completion.",
            },
          ],
        }}
        stories={{
          title: "Real Peer Exchange Stories",
          items: [
            {
              name: "Arjun Mehta",
              role: "Frontend Engineer",
              reach: "Swapped React 19 for Conversational Spanish",
              points: [
                "Taught modern React and TypeScript to 16 peers",
                "Used earned credits to reach conversational Spanish fluency",
                "Completed 42 barter sessions with $0 spent on courses",
                "Now leading an open Spanish practice circle",
              ],
              raised: 42,
              share: 1.0,
              years: 1,
              growth: [2, 4, 8, 12, 16, 21, 26, 31, 35, 38, 40, 42],
            },
            {
              name: "Elena Rostova",
              role: "Product Designer",
              reach: "Swapped Figma & Design Systems for Python",
              points: [
                "Reviewed design portfolios and taught component systems",
                "Learned Python data scripting and automated design tokens",
                "Estimated $3,200 saved in private tutoring fees",
                "Maintains a 4.96 rating across 38 sessions",
              ],
              raised: 38,
              share: 1.0,
              years: 1,
              growth: [1, 3, 6, 10, 14, 18, 23, 27, 30, 33, 35, 38],
            },
            {
              name: "Marcus Vance",
              role: "Audio Producer",
              reach: "Swapped Sound Design for Web Development",
              points: [
                "Taught synth design and mixing to indie game developers",
                "Learned frontend development to build his own audio web app",
                "Collaborated on 3 open source creative coding projects",
                "100% fair mutual barter with zero financial barriers",
              ],
              raised: 55,
              share: 1.0,
              years: 1,
              growth: [3, 6, 11, 17, 23, 29, 36, 42, 47, 50, 52, 55],
            },
          ],
        }}
        cta={{
          title: "Ready to *learn anything* without *spending a single dollar?*",
          action: user
            ? { label: "Go to Your Matches", href: "/matches" }
            : { label: "Join SwapSkill Free (+2 Credits)", href: "/register" },
        }}
        faq={{
          title: "Frequently Asked Questions",
          groups: [
            {
              title: "For Learners",
              items: [
                {
                  q: "Do I need to pay any real money?",
                  a: "No! SwapSkill is 100% non-monetary. You teach to earn credits, and spend credits to learn. All new accounts get 2 free starter credits upon signup.",
                },
                {
                  q: "How are sessions conducted?",
                  a: "Sessions take place via 1-on-1 video call and direct messaging. You can coordinate links directly on the platform and practice with shared tasks.",
                },
                {
                  q: "What if a peer doesn't show up?",
                  a: "Credits are protected in escrow. If a session is cancelled or a participant fails to attend, credits are safely refunded back to your balance.",
                },
                {
                  q: "Can I attend group workshops?",
                  a: "Yes! Mentors frequently host multi-learner interactive workshops on specialized topics like Git mastery or conversational practice.",
                },
              ],
            },
            {
              title: "For Mentors & Teachers",
              items: [
                {
                  q: "Do I need a teaching license or certificate?",
                  a: "No formal diploma or certification is required. Practical knowledge and enthusiasm to help peers learn are all you need.",
                },
                {
                  q: "How do I earn credits?",
                  a: "For every confirmed 1-on-1 session you complete, 1 credit is transferred from escrow into your available balance.",
                },
                {
                  q: "Can I teach more than one skill?",
                  a: "Yes! You can list multiple skills (e.g. JavaScript, Guitar, French) with your proficiency and teaching focus for each.",
                },
                {
                  q: "How does reputation work?",
                  a: "After every session, learners submit ratings and reviews, which display on your public profile and boost your matchmaking rank.",
                },
              ],
            },
          ],
        }}
        footer={{
          tagline: "SwapSkill — The decentralized, credit-based peer skill exchange network.",
          columns: [
            {
              title: "Platform",
              links: [
                { label: "Explore Skills", href: "/explore" },
                { label: "Peer Matches", href: "/matches" },
                { label: "Workshops", href: "/workshops" },
                { label: "Learning Circles", href: "/circles" },
                { label: "Practice Tasks", href: "/practice" },
              ],
            },
            {
              title: "Account",
              links: [
                { label: "Sign In", href: "/login" },
                { label: "Create Account", href: "/register" },
                { label: "My Profile", href: "/profile" },
                { label: "My Sessions", href: "/sessions" },
              ],
            },
            {
              title: "Community",
              links: [
                { label: "Code of Conduct", href: "/explore" },
                { label: "Teaching Guidelines", href: "/explore" },
                { label: "Trust & Safety", href: "/explore" },
              ],
            },
          ],
          note: "SwapSkill is a non-monetary community barter platform. All skill exchanges are conducted via time-based credits.",
          credit: "© 2026 SwapSkill. All rights reserved.",
        }}
        onRequestAccess={async (req) => {
          navigate(`/register?role=${req.role}&name=${encodeURIComponent(req.name)}&email=${encodeURIComponent(req.email)}`);
          return true;
        }}
      >
        {/* Featured Community Peers Section */}
        {featuredUsers.length > 0 && (
          <section className="sol-sec py-16" style={{ padding: "64px 0" }}>
            <div className="sol-wrap">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
                <div>
                  <span className="sol-mono block mb-2" style={{ color: "var(--sol-accent)" }}>
                    Top Rated Practitioners
                  </span>
                  <h2 className="sol-h2">Featured Community Peers</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/explore')}
                  className="sol-btn mt-4 sm:mt-0"
                >
                  <span>Browse All 500+ Peers</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredUsers.map((peer) => {
                  const teachSkills = peer.skills?.filter((s) => s.type === 'TEACH') || [];
                  const learnSkills = peer.skills?.filter((s) => s.type === 'LEARN') || [];

                  return (
                    <div
                      key={peer.id}
                      className="rounded-2xl p-5 border transition-all flex flex-col justify-between"
                      style={{
                        background: "var(--sol-card)",
                        borderColor: "var(--sol-line)",
                        boxShadow: "var(--sol-shadow)",
                      }}
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={peer.name}
                            className="w-12 h-12 rounded-xl object-cover border"
                            style={{ borderColor: "var(--sol-line)" }}
                          />
                          <div className="min-w-0 flex-1">
                            <span
                              onClick={() => navigate(`/users/${peer.id}`)}
                              className="font-bold text-sm truncate block cursor-pointer hover:underline"
                            >
                              {peer.name}
                            </span>
                            <p className="text-[11px] truncate opacity-70">{peer.headline}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs mb-3 opacity-80">
                          <RatingStars rating={Math.round(peer.averageRating || 5)} size={12} />
                          <span className="font-semibold">{peer.averageRating || '5.0'}</span>
                          <span>•</span>
                          <span>{peer.completedSessions || 0} sessions</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: "var(--sol-accent)" }}>
                              Can Teach
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {teachSkills.slice(0, 2).map((s) => (
                                <span
                                  key={s.id}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-medium"
                                  style={{
                                    background: "rgba(99, 102, 241, 0.12)",
                                    color: "var(--sol-ink)",
                                  }}
                                >
                                  {s.skillName}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider block mb-1 opacity-70">
                              Wants to Learn
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {learnSkills.slice(0, 2).map((s) => (
                                <span
                                  key={s.id}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-medium opacity-80"
                                  style={{
                                    background: "rgba(16, 185, 129, 0.12)",
                                    color: "var(--sol-ink)",
                                  }}
                                >
                                  {s.skillName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t flex items-center space-x-2" style={{ borderColor: "var(--sol-line)" }}>
                        <button
                          onClick={() => setSelectedTeacher(peer)}
                          className="sol-btn w-full justify-center text-xs"
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </StippleOrbLanding>

      {/* Booking Modal */}
      {selectedTeacher && (
        <BookingModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onSuccess={() => {
            setSelectedTeacher(null);
            alert('Session requested! 1 credit will be held in escrow once teacher confirms.');
          }}
        />
      )}
    </div>
  );
};
