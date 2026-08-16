import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import SponsorGrid from '../components/SponsorGrid.jsx';
import Marquee from '../components/Marquee.jsx';
import GhostWordmark from '../components/GhostWordmark.jsx';
import ArcDivider from '../components/ArcDivider.jsx';
import StatBlock from '../components/StatBlock.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

/**
 * The season-summary entry is rendered as the record band above, so it is
 * filtered out of the timeline to avoid stating the same numbers twice.
 */
const isSeasonSummary = (item) => /season stats/i.test(item.date ?? '');

const Home = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { home, branding, sponsors },
  } = useSiteContent();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const timeline = home.highlights.items.filter((item) => !isSeasonSummary(item));

  return (
    <>
      <Hero />

      <Marquee
        items={[
          `FTC TEAM ${branding.teamNumber}`,
          branding.season,
          'NY-EXCELSIOR',
          'WORLD CHAMPIONSHIP QUALIFIER',
          'EDGEMONT JR./SR. HIGH SCHOOL',
        ]}
      />

      <Section
        variant="split"
        railLabel="About"
        title={home.about.title}
        description={home.about.description}
        className="relative"
      >
        <GhostWordmark text="Solar Flare" />
        <MotionDiv
          className="relative space-y-5 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {home.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionDiv>
      </Section>

      {/* Signature moment: competition results at scoreboard scale. */}
      <Section
        variant="feature"
        band="angled"
        railLabel="Record"
        eyebrow={home.record.eyebrow}
        title={home.record.title}
        titleAccent={home.record.titleAccent}
        description={home.record.description}
      >
        <MotionDiv
          className="grid gap-x-12 gap-y-10 sm:grid-cols-2"
          variants={listVariants}
        >
          {home.record.stats.map((stat) => (
            <StatBlock
              key={stat.label}
              value={stat.value}
              label={stat.label}
              caption={stat.caption}
              accent={stat.accent}
            />
          ))}
        </MotionDiv>
      </Section>

      <ArcDivider />

      {/* Genuinely chronological, so the index numbers encode real order. */}
      <Section
        variant="wide"
        railLabel="Timeline"
        title={home.highlights.title}
        description={home.highlights.description}
      >
        <MotionDiv className="divide-y divide-white/[0.07]" variants={listVariants}>
          {timeline.map((item, position) => (
            <motion.article
              key={`${item.event}-${item.date}`}
              className="group grid gap-3 py-7 md:grid-cols-[4rem_minmax(0,14rem)_minmax(0,1fr)] md:items-baseline md:gap-8"
              variants={resolveVariant(fadeInUp, shouldReduceMotion)}
            >
              <span className="label-mono text-sf-orange-1/60">
                {String(position + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="label-mono text-white/40">{item.date}</p>
                <h3 className="heading-display mt-2 text-xl font-bold text-sf-text transition-colors group-hover:text-sf-orange-2 sm:text-2xl">
                  {item.event}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-sf-muted/85">
                {item.summary}
              </p>
            </motion.article>
          ))}
        </MotionDiv>
      </Section>

      <Section
        variant="wide"
        band="angled-alt"
        railLabel="Partners"
        title={home.sponsors.title}
        description={home.sponsors.description}
      >
        <MotionDiv variants={listVariants} className="space-y-10">
          <SponsorGrid sponsors={sponsors} />
          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-8">
            <p className="max-w-2xl text-sm leading-relaxed text-sf-muted/80">
              {home.sponsors.ctaDescription}
            </p>
            <Link
              to={home.sponsors.ctaLink}
              className="btn-ghost !px-5 !py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
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
