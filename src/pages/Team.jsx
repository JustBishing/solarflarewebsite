import { motion } from 'framer-motion';
import Section from '../components/Section.jsx';
import TeamCard from '../components/TeamCard.jsx';
import { TEAM_MEMBERS } from '../data/team.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

const Team = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);

  return (
    <>
      <Section
        title="A team of dedicated individuals"
        description="Solar Flare is made up of builders, programmers, storytellers, and leaders who show up ready to learn at every workshop and match."
      >
        <MotionDiv
          className="space-y-4 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          <p>
            We rally around a shared love of robotics, combining diverse skill
            sets in code, mechanical design, outreach, and match strategy. That
            collaboration helps us iterate quickly and deliver reliable
            performance on the field.
          </p>
          <p>
            Beyond competitions we mentor younger students, speak at community
            events, and advocate for equitable access to STEM. Solar Flare is
            proof that when driven students work together, we can build more than
            robots—we build opportunities.
          </p>
        </MotionDiv>
      </Section>

      <Section title="Meet the squad">
        <MotionDiv
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          variants={listVariants}
        >
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </MotionDiv>
      </Section>

      <Section title="Connect with us">
        <MotionDiv
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-sf-border bg-sf-elevated px-6 py-6 text-sm text-sf-text shadow-[0_28px_46px_-32px_rgba(0,0,0,0.65)]"
          variants={textVariants}
        >
          <span className="font-semibold uppercase tracking-[0.3rem] text-sf-orange-1">
            Follow
          </span>
          <a
            href="https://instagram.com/solarflarerobotics"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-sf-border px-4 py-2 transition hover:border-sf-orange-1 hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@solarflarerobotics"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-sf-border px-4 py-2 transition hover:border-sf-orange-1 hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
          >
            YouTube
          </a>
          <a
            href="mailto:team@solarflarerobotics.org"
            className="rounded-full border border-sf-border px-4 py-2 transition hover:border-sf-orange-1 hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
          >
            Email
          </a>
        </MotionDiv>
      </Section>
    </>
  );
};

export default Team;
