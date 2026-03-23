import { motion } from 'framer-motion';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
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

  return (
    <>
      <Section
        title={pastSeasons.intro.title}
        description={pastSeasons.intro.description}
      >
        <MotionDiv
          className="space-y-4 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {pastSeasons.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionDiv>
      </Section>

      <Section
        title={pastSeasons.archive.title}
        description={pastSeasons.archive.description}
      >
        <MotionDiv className="grid gap-6 md:grid-cols-2" variants={listVariants}>
          {pastSeasons.archive.seasons.map((season, index) => (
            <Card
              key={`${season.title}-${index}`}
              title={season.title}
              subtitle={season.year}
            >
              <div className="space-y-4">
                <p>{season.summary}</p>
                <ul className="space-y-2 text-sm leading-relaxed text-sf-muted sm:text-base">
                  {season.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span
                        className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-sf-orange-1"
                        aria-hidden="true"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </MotionDiv>
      </Section>
    </>
  );
};

export default PastSeasons;
