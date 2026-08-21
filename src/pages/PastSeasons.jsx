import { motion } from 'framer-motion';
import Section from '../components/Section.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

const PastSeasons = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { pastSeasons },
  } = useSiteContent();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const seasons = pastSeasons.archive.seasons;

  return (
    <>
      <Section
        headingLevel="h1"
        variant="split"
        railLabel="Archive"
        eyebrow="History"
        title={pastSeasons.intro.title}
        description={pastSeasons.intro.description}
        className="relative"
      >
        <MotionDiv
          className="relative space-y-5 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {pastSeasons.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionDiv>
      </Section>

      {/* Seasons are chronological, so the spine and its numbers carry
          real ordering rather than decoration. */}
      <Section
        variant="wide"
        band="angled"
        railLabel="Timeline"
        title={pastSeasons.archive.title}
        description={pastSeasons.archive.description}
      >
        <MotionDiv variants={listVariants} className="relative">
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-sf-orange-1/50 via-white/10 to-transparent sm:block"
          />
          <div className="space-y-12">
            {seasons.map((season, position) => (
              <motion.article
                key={`${season.title}-${position}`}
                className="group relative sm:pl-12"
                variants={resolveVariant(fadeInUp, shouldReduceMotion)}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 hidden h-[15px] w-[15px] rotate-45 border border-sf-orange-1/60 bg-sf-bg transition-colors duration-300 group-hover:bg-sf-orange-1 sm:block"
                />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="label-mono text-sf-orange-1/90">
                    {String(seasons.length - position).padStart(2, '0')}
                  </span>
                  <span className="label-mono text-white/65">{season.year}</span>
                </div>
                <h3 className="heading-display mt-3 text-2xl font-bold text-sf-text sm:text-3xl">
                  {season.title}
                </h3>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-sf-muted/90">
                  {season.summary}
                </p>
                <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {season.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-sf-orange-1/80"
                      />
                      <span className="text-sm leading-relaxed text-sf-muted/80">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </MotionDiv>
      </Section>
    </>
  );
};

export default PastSeasons;
