import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import SponsorGrid from '../components/SponsorGrid.jsx';
import Marquee from '../components/Marquee.jsx';
import GhostWordmark from '../components/GhostWordmark.jsx';
import ArcDivider from '../components/ArcDivider.jsx';
import ImageBand from '../components/ImageBand.jsx';
import StatBlock from '../components/StatBlock.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';
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

/**
 * Order is the ranking. The first result in Firestore is the one the section
 * is built around, the next two support it, and anything after that is a
 * footnote. Editors reorder in /admin; nothing here needs a new content field.
 */
const rankRecordStats = (stats) => ({
  lead: stats[0],
  supporting: stats.slice(1, 3),
  footnotes: stats.slice(3),
});

const Home = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { home, branding, sponsors },
  } = useSiteContent();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const timeline = home.highlights.items.filter((item) => !isSeasonSummary(item));
  const record = rankRecordStats(home.record.stats);

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

      <ImageBand
        src={home.showcase?.image}
        alt={home.showcase?.imageAlt}
        caption={home.showcase?.caption}
        priority
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
        <MotionDiv className="space-y-12" variants={listVariants}>
          {/* The headline figure holds the left column at full scale; its
              supporting results stack beside it rather than spreading edge to
              edge, so the three read as one claim with evidence. */}
          <div className="grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
            {record.lead ? (
              <StatBlock
                scale="lead"
                value={record.lead.value}
                label={record.lead.label}
                caption={record.lead.caption}
                accent={record.lead.accent}
              />
            ) : null}

            {record.supporting.length ? (
              <div className="grid content-center gap-9 border-t border-white/10 pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                {record.supporting.map((stat) => (
                  <StatBlock
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    caption={stat.caption}
                    accent={stat.accent}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {record.footnotes.length ? (
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-white/10 pt-8">
              {record.footnotes.map((stat) => (
                <StatBlock
                  key={stat.label}
                  scale="minor"
                  value={stat.value}
                  label={stat.label}
                  caption={stat.caption}
                  accent={stat.accent}
                />
              ))}
            </div>
          ) : null}
        </MotionDiv>
      </Section>

      {home.robot?.image ? (
        <Section
          variant="split"
          railLabel="Machine"
          eyebrow={home.robot.eyebrow}
          title={home.robot.title}
          titleAccent={home.robot.titleAccent}
          description={home.robot.description}
        >
          <MotionDiv variants={textVariants}>
            <figure className="m-0">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <img
                  src={resolveSiteAssetUrl(home.robot.image)}
                  alt={home.robot.imageAlt}
                  width="1500"
                  height="1317"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {home.robot.caption ? (
                <figcaption className="label-mono mt-4 leading-[1.7] text-sf-muted/85">
                  {home.robot.caption}
                </figcaption>
              ) : null}
            </figure>
          </MotionDiv>
        </Section>
      ) : null}

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
              <span className="label-mono text-sf-orange-1/90">
                {String(position + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="label-mono text-white/65">{item.date}</p>
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
