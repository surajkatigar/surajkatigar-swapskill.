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
      navCta={user ? "Dashboard" : "Join Free"}
      onNavCta={() => navigate(user ? "/matches" : "/register")}
      hero={{
        wordmark: "SwapSkill",
        issue: "#102",
        title: "SWAPSKiLL.\nASSOCiATION",
        blurb:
          "Interplanetary exploration can be carried out by many means, from spacecraft and telescopes to a folding chair in a dark field. We do the last part together, every clear night.",
        credit: "SwapSkill Association · Project designed by its members",
        primaryCta: user ? "Go to Dashboard" : "Join the association",
        secondaryCta: "Tonight's sky",
        hint: "Click the bubbles. They pop.",
      }}
      mission={{
        bandTitle: "SWAPSKiLL.\nASSOCiATION",
        kicker: "SWAPSKiLL. ASSOCIATION PROJECT",
        meta: ["SwapSkill. Association project", "#102 daily design", "Designed by members"],
        title: "A club for people who keep looking up.",
        body:
          "We are amateurs in the old sense of the word: we do it for love. Members share telescopes, drive each other to dark sites, log what they see and turn it into open data that real observatories use. No experience needed — just curiosity and a warm coat.",
        stats: [
          { value: "1,840+", label: "Members" },
          { value: "312", label: "Nights logged" },
          { value: "48,600", label: "Objects catalogued" },
          { value: "27", label: "Countries" },
        ],
      }}
      projectsCopy={{
        title: "SWAPSKiLL\nASSOCiATION",
        issue: "102",
        ribbonText: "swapskill. association",
        heading: "Projects, numbered like issues.",
        body:
          "Interplanetary exploration projects can be carried out using a variety of means and equipment. They require a large amount of patient observation, and they require international cooperation and joint efforts.",
      }}
      footer={{
        bandTitle: "SWAPSKiLL.\nASSOCiATION",
        tagline: "ALL WE CAN FOUND.  ALL CAN BE FOUND.",
        credit: "SWAPSKILL PROJECT · DESIGNED BY ITS MEMBERS",
        links: [
          { label: "Explore Skills", href: "/explore" },
          { label: "Peer Matches", href: "/matches" },
          { label: "Workshops", href: "/workshops" },
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

