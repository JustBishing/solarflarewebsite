import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import SponsorGrid from '../components/SponsorGrid.jsx';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { SPONSORS } from '../data/sponsors.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

const Home = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);

  return (
    <>
      <Hero />
      <Section
        title="About Solar Flare"
        description="Solar Flare Robotics is a first-year FIRST Tech Challenge team pushing Into the Deep with bold ideas and community impact."
      >
        <MotionDiv
          className="space-y-5 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          <p>
            We are FTC Team #25707, a crew of determined students from Edgemont
            Jr./Sr. High School and the broader NY-Excelsior region. Our team
            formed to explore the intersection of creativity and engineering,
            challenging ourselves to design smarter robots every match.
          </p>
          <p>
            FIRST Tech Challenge gives us the space to prototype, iterate, and
            solve real-world problems together. Through the program we hone
            programming, CAD, machining, and leadership skills that extend far
            beyond the field.
          </p>
          <p>
            Solar Flare is fiscally sponsored by Hack Club, a 501(c)(3)
            organization. That partnership means every donation is
            tax-deductible and directly funds parts, upgrades, tools, and
            outreach that sustain our mission.
          </p>
        </MotionDiv>
      </Section>

      <Section
        title="Season Highlights"
        description="Turning our first season Into the Deep into an unforgettable run with hardware breakthroughs, award recognition, and alliances that keep us learning."
      >
        <MotionDiv
          className="grid gap-6 md:grid-cols-2"
          variants={listVariants}
        >
          {ACHIEVEMENTS.map((achievement) => (
            <Card
              key={achievement.event}
              title={achievement.event}
              subtitle={achievement.date}
            >
              {achievement.summary}
            </Card>
          ))}
        </MotionDiv>
      </Section>

      <Section
        title="Thanks to Our Sponsors"
        description="We’re grateful for the partners who fuel our builds, scrimmages, and community events. Their support keeps Solar Flare blazing forward."
      >
        <MotionDiv variants={listVariants} className="space-y-8">
          <SponsorGrid sponsors={SPONSORS} />
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sf-border bg-sf-elevated px-6 py-6 shadow-[0_28px_46px_-32px_rgba(0,0,0,0.65)]">
            <p className="max-w-2xl text-sm text-sf-muted">
              Interested in partnering with Solar Flare? Explore our sponsorship
              tiers to learn how your organization can make an impact during the
              2024-2025 Into the Deep season.
            </p>
            <Link
              to="/sponsorships"
              className="rounded-xl border border-sf-orange-1 px-5 py-2 text-sm font-semibold text-sf-orange-1 transition hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
            >
              View sponsorships
            </Link>
          </div>
        </MotionDiv>
      </Section>
    </>
  );
};

export default Home;
