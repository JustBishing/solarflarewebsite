import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import SponsorGrid from '../components/SponsorGrid.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

const Home = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { home, sponsors },
  } = useSiteContent();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);

  return (
    <>
      <Hero />
      <Section
        title={home.about.title}
        description={home.about.description}
      >
        <MotionDiv
          className="space-y-5 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {home.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionDiv>
      </Section>

      <Section
        title={home.highlights.title}
        description={home.highlights.description}
      >
        <MotionDiv
          className="grid gap-6 md:grid-cols-2"
          variants={listVariants}
        >
          {home.highlights.items.map((achievement) => (
            <Card
              key={`${achievement.event}-${achievement.date}`}
              title={achievement.event}
              subtitle={achievement.date}
            >
              {achievement.summary}
            </Card>
          ))}
        </MotionDiv>
      </Section>

      <Section
        title={home.sponsors.title}
        description={home.sponsors.description}
      >
        <MotionDiv variants={listVariants} className="space-y-8">
          <SponsorGrid sponsors={sponsors} />
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sf-border bg-sf-elevated px-6 py-6 shadow-[0_28px_46px_-32px_rgba(0,0,0,0.65)]">
            <p className="max-w-2xl text-sm text-sf-muted">
              {home.sponsors.ctaDescription}
            </p>
            <Link
              to={home.sponsors.ctaLink}
              className="rounded-xl border border-sf-orange-1 px-5 py-2 text-sm font-semibold text-sf-orange-1 transition hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
            >
              {home.sponsors.ctaLabel}
            </Link>
          </div>
        </MotionDiv>
      </Section>
    </>
  );
};

export default Home;
