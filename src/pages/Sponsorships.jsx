import { motion } from 'framer-motion';
import Card from '../components/Card.jsx';
import Section from '../components/Section.jsx';
import SponsorGrid from '../components/SponsorGrid.jsx';
import { SPONSORS } from '../data/sponsors.js';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
  scaleTap,
} from '../lib/motion.js';

const MotionDiv = motion.div;
const MotionAnchor = motion.a;

const TIERS = [
  {
    title: 'Bronze',
    benefits: [
      'Logo on our website sponsorship wall',
      'Thank-you shoutout on social media',
    ],
    amount: '$250',
  },
  {
    title: 'Silver',
    benefits: [
      'All Bronze benefits',
      'Logo placement on the robot chassis',
      'Signed team poster and match updates',
    ],
    amount: '$500',
  },
  {
    title: 'Gold',
    benefits: [
      'All Silver benefits',
      'Logo on team shirts and pit banners',
      'Dedicated social media feature and newsletter highlight',
    ],
    amount: '$1,000',
  },
  {
    title: 'Platinum',
    benefits: [
      'All Gold benefits',
      'Team demo day for your company or community',
      'Custom presentation on how your support impacted our season',
    ],
    amount: '$2,500+',
  },
];

const Sponsorships = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const textVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const hoverProps = shouldReduceMotion
    ? {}
    : { whileHover: { scale: 1.02 } };

  return (
    <>
      <Section
        title="Explore opportunities in sponsorships"
        description="Partnerships help us compete at our best while expanding hands-on STEM opportunities for students throughout Westchester County."
      >
        <MotionDiv
          className="space-y-5 text-base leading-relaxed text-sf-muted sm:text-lg"
          variants={textVariants}
        >
          <p>
            Contributions directly fund robot parts, tools, competition fees, and
            outreach programs. Every donation or in-kind gift allows us to build
            higher-performing mechanisms, travel to events, and host workshops
            for aspiring engineers.
          </p>
          <p>
            As a fiscally sponsored project of Hack Club, a 501(c)(3), your
            sponsorship is fully tax-deductible. We provide regular season
            updates so you can see the impact of your support in action.
          </p>
          <div className="flex flex-wrap gap-4">
            <MotionAnchor
              href="https://hcb.hackclub.com/donations/start/solar-flare"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-sf-orange-1 px-6 py-3 text-base font-semibold text-sf-bg shadow-sm transition hover:bg-[#ff6a2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverProps}
            >
              Donate via Hack Club Bank
            </MotionAnchor>
            <MotionAnchor
              href="mailto:team@solarflarerobotics.org"
              className="rounded-xl border border-sf-orange-1 px-6 py-3 text-base font-semibold text-sf-orange-1 transition hover:bg-sf-orange-1 hover:text-sf-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverProps}
            >
              Start a conversation
            </MotionAnchor>
          </div>
        </MotionDiv>
      </Section>

      <Section title="Sponsorship tiers">
        <MotionDiv
          className="grid gap-6 md:grid-cols-2"
          variants={listVariants}
        >
          {TIERS.map((tier) => (
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
        title="Current sponsors"
        description="We are grateful for every organization investing in the future engineers, programmers, and makers on Solar Flare Robotics."
      >
        <MotionDiv variants={listVariants} className="space-y-8">
          <SponsorGrid sponsors={SPONSORS} />
        </MotionDiv>
      </Section>
    </>
  );
};

export default Sponsorships;
