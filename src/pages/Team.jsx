import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../components/Section.jsx';
import TeamCard from '../components/TeamCard.jsx';
import GhostWordmark from '../components/GhostWordmark.jsx';
import ArcDivider from '../components/ArcDivider.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

const Team = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { team },
  } = useSiteContent();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);

  return (
    <>
      <Section
        variant="split"
        railLabel="About"
        eyebrow="The Roster"
        title={team.intro.title}
        description={team.intro.description}
        className="relative"
      >
        <GhostWordmark text="Team" />
        <MotionDiv
          className="relative space-y-5 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {team.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionDiv>
      </Section>

      <Section
        variant="wide"
        band="angled"
        railLabel="Members"
        title={team.roster.title}
      >
        <MotionDiv
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          variants={listVariants}
        >
          {team.roster.members.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </MotionDiv>
      </Section>

      <ArcDivider />

      <Section variant="wide" railLabel="Connect" title={team.connect.title}>
        <MotionDiv
          className="flex flex-wrap items-center gap-3"
          variants={textVariants}
        >
          <span className="label-mono mr-2 text-sf-orange-2">
            {team.connect.label}
          </span>
          {team.connect.links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold transition hover:border-sf-orange-2 hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
            >
              {link.label}
            </a>
          ))}
        </MotionDiv>
      </Section>

      <Section
        variant="feature"
        band="angled-alt"
        railLabel="Join"
        eyebrow="Recruiting"
        title={team.apply.title}
        description={team.apply.description}
      >
        <MotionDiv
          className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8"
          variants={textVariants}
        >
          <p className="max-w-2xl text-base leading-relaxed text-sf-muted/85">
            Tell us about your experience, what you want to work on, and why
            you want to join Solar Flare.
          </p>
          <Link
            to={team.apply.buttonLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
          >
            {team.apply.buttonLabel}
          </Link>
        </MotionDiv>
      </Section>
    </>
  );
};

export default Team;
