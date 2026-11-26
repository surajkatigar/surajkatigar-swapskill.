import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AstroAssociationTemplate from '../components/astro-association-template/astro-association-template';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AstroAssociationTemplate
      brand="SWAPSKiLL."
      navCta={user ? "Dashboard" : "Join Free (+2 Credits)"}
      onNavCta={() => navigate(user ? "/matches" : "/register")}
      hero={{
        wordmark: "SwapSkill",
        issue: "#2026",
        title: "LEARN ANYTHING.\nTRADE SKILLS.",
        blurb:
          "The decentralized peer-to-peer skill barter network. Teach what you excel at—coding, design, languages, music—and bank time credits to learn from verified peers worldwide. No money. Pure knowledge exchange.",
        credit: "SwapSkill Network · Decentralized Knowledge Exchange",
        primaryCta: user ? "Go to Dashboard" : "Join & Get 2 Free Credits",
        secondaryCta: "Explore Workshops",
        hint: "Click the skill bubbles. They pop.",
      }}
      mission={{
        bandTitle: "SWAPSKiLL.\nNETWORK",
        kicker: "PEER-TO-PEER KNOWLEDGE BARTER",
        meta: ["100% Non-Monetary", "Smart Time Credits", "Verified Practitioners"],
        title: "Learn directly from practitioners. Teach what you love.",
        body:
          "Bootcamps and private tutors charge thousands of dollars. We believe learning should be collaborative, direct, and accessible to everyone. On SwapSkill, one hour of teaching earns you one credit to spend on learning any topic from peers across the globe.",
        stats: [
          { value: "5,400+", label: "Exchanges Completed" },
          { value: "1,840+", label: "Active Members" },
          { value: "480+", label: "Skills Catalogued" },
          { value: "100%", label: "Free Peer Barter" },
        ],
      }}
      projectsCopy={{
        title: "SWAPSKiLL\nTRACKS",
        issue: "2026",
        ribbonText: "peer knowledge · mutual barter",
        heading: "Curated learning tracks, organized by community practitioners.",
        body:
          "Connect directly with mentors who work in the industry. Practice with real project code, get live feedback on your design systems, and accelerate your craft without paying for courses.",
      }}
      footer={{
        bandTitle: "SWAPSKiLL.\nNETWORK",
        tagline: "ALL SKILLS CAN BE SHARED.  ALL CAN BE LEARNED.",
        credit: "SWAPSKILL · THE DECENTRALIZED PEER SKILL EXCHANGE NETWORK",
        links: [
          { label: "Explore Skills", href: "/explore" },
          { label: "Peer Matches", href: "/matches" },
          { label: "Workshops", href: "/workshops" },
          { label: "Learning Circles", href: "/circles" },
          { label: "Sign In", href: "/login" },
        ],
      }}
      onJoin={(member) => {
        navigate(`/register?name=${encodeURIComponent(member.name)}&email=${encodeURIComponent(member.email)}&tier=${encodeURIComponent(member.tier)}`);
      }}
      onContribute={() => {
        navigate('/explore');
      }}
      onRsvp={() => {
        navigate(user ? '/sessions' : '/register');
      }}
    />
  );
};
export default HomePage;


