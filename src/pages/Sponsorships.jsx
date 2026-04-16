import { motion } from 'framer-motion';
import Card from '../components/Card.jsx';
import Section from '../components/Section.jsx';
import SponsorGrid from '../components/SponsorGrid.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
  scaleTap,
} from '../lib/motion.js';

const MotionDiv = motion.div;
const MotionAnchor = motion.a;

const Sponsorships = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { sponsorships, sponsors },
  } = useSiteContent();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const hoverProps = shouldReduceMotion
    ? {}
    : { whileHover: { scale: 1.02 } };

  return (
    <>
      <Section
        title={sponsorships.intro.title}
        description={sponsorships.intro.description}
      >
        <MotionDiv
          className="space-y-5 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {sponsorships.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="flex flex-wrap gap-4">
            <MotionAnchor
              href={sponsorships.intro.primaryCtaLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverProps}
            >
              {sponsorships.intro.primaryCtaLabel}
            </MotionAnchor>
            <MotionAnchor
              href={sponsorships.intro.secondaryCtaLink}
              className="btn-ghost focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverProps}
            >
              {sponsorships.intro.secondaryCtaLabel}
            </MotionAnchor>
          </div>
        </MotionDiv>
      </Section>

      <Section title={sponsorships.tiers.title}>
        <MotionDiv
          className="grid gap-6 md:grid-cols-2"
          variants={listVariants}
        >
          {sponsorships.tiers.items.map((tier) => (
            <Card key={tier.title} title={tier.title} subtitle={tier.amount}>
              <ul className="space-y-2 text-sm leading-relaxed text-sf-muted sm:text-base">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-sf-orange-1" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </MotionDiv>
      </Section>

      <Section
        title={sponsorships.currentSponsors.title}
        description={sponsorships.currentSponsors.description}
      >
        <MotionDiv variants={listVariants} className="space-y-8">
          <SponsorGrid sponsors={sponsors} />
        </MotionDiv>
      </Section>
    </>
  );
};

export default Sponsorships;
