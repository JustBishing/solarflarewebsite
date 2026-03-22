import { motion } from 'framer-motion';
import Section from '../components/Section.jsx';
import TeamCard from '../components/TeamCard.jsx';
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
        title={team.intro.title}
        description={team.intro.description}
      >
        <MotionDiv
          className="space-y-4 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {team.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionDiv>
      </Section>

      <Section title={team.roster.title}>
        <MotionDiv
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          variants={listVariants}
        >
          {team.roster.members.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </MotionDiv>
      </Section>

      <Section title={team.connect.title}>
        <MotionDiv
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-sf-border bg-sf-elevated px-6 py-6 text-sm text-sf-text shadow-[0_28px_46px_-32px_rgba(0,0,0,0.65)]"
          variants={textVariants}
        >
          <span className="font-semibold uppercase tracking-[0.3rem] text-sf-orange-1">
            {team.connect.label}
          </span>
          {team.connect.links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="rounded-full border border-sf-border px-4 py-2 transition hover:border-sf-orange-1 hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
            >
              {link.label}
            </a>
          ))}
        </MotionDiv>
      </Section>
    </>
  );
};

export default Team;
