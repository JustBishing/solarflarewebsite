import { motion } from 'framer-motion';
import Section from '../components/Section.jsx';
import SponsorGrid from '../components/SponsorGrid.jsx';
import StatBlock from '../components/StatBlock.jsx';
import GhostWordmark from '../components/GhostWordmark.jsx';
import ArcDivider from '../components/ArcDivider.jsx';
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
  const hoverProps = shouldReduceMotion ? {} : { whileHover: { scale: 1.02 } };

  return (
    <>
      <Section
        headingLevel="h1"
        variant="split"
        railLabel="Support"
        eyebrow="Partner with us"
        title={sponsorships.intro.title}
        description={sponsorships.intro.description}
        className="relative"
      >
        <GhostWordmark text="Support" />
        <MotionDiv
          className="relative space-y-6 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          {sponsorships.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="flex flex-wrap gap-4 pt-2">
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

      {/* Tiers ascend by amount, so the numbering tracks a real order. */}
      <Section
        variant="wide"
        band="angled"
        railLabel="Tiers"
        title={sponsorships.tiers.title}
      >
        <MotionDiv
          className="divide-y divide-white/[0.07]"
          variants={listVariants}
        >
          {sponsorships.tiers.items.map((tier, position) => (
            <motion.article
              key={tier.title}
              className="grid gap-6 py-9 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14"
              variants={resolveVariant(fadeInUp, shouldReduceMotion)}
            >
              <div>
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="label-mono text-sf-orange-1/90">
                    {String(position + 1).padStart(2, '0')}
                  </span>
                  <h3 className="heading-display text-lg font-bold uppercase tracking-wide text-sf-text">
                    {tier.title}
                  </h3>
                </div>
                <StatBlock
                  value={tier.amount}
                  label="Per season"
                  accent={position === sponsorships.tiers.items.length - 1}
                />
              </div>
              {/* content-start, not content-center: centring floated a
                  two-bullet tier above its own price. */}
              <div className="grid content-start gap-5">
                <ul className="grid gap-3">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-sf-orange-1/80"
                      />
                      <span className="text-base leading-relaxed text-sf-muted/85">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* Every tier gets its own way to act. The page used to carry a
                    single button at the very top, so deciding on Gold halfway
                    down meant scrolling a full page back up to do anything. */}
                {sponsorships.intro.primaryCtaLink ? (
                  <MotionAnchor
                    href={sponsorships.intro.primaryCtaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
                    whileTap={scaleTap}
                    {...hoverProps}
                  >
                    {`Become a ${tier.title} sponsor`}
                  </MotionAnchor>
                ) : null}
              </div>
            </motion.article>
          ))}
        </MotionDiv>
      </Section>

      <ArcDivider />

      <Section
        variant="wide"
        railLabel="Partners"
        title={sponsorships.currentSponsors.title}
        description={sponsorships.currentSponsors.description}
      >
        <MotionDiv variants={listVariants}>
          <SponsorGrid sponsors={sponsors} showContribution />
        </MotionDiv>
      </Section>
    </>
  );
};

export default Sponsorships;
