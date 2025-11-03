import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  hoverLift,
  resolveVariant,
  useShouldReduceMotion,
} from '../lib/motion.js';

const SponsorGrid = ({ sponsors, className = '' }) => {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {sponsors.map((sponsor) => {
        const MotionTag = sponsor.website ? motion.a : motion.div;
        const hoverProps = shouldReduceMotion ? {} : { whileHover: hoverLift };
        return (
          <MotionTag
            key={sponsor.name}
            href={sponsor.website}
            target={sponsor.website ? '_blank' : undefined}
            rel={sponsor.website ? 'noreferrer' : undefined}
            className="flex flex-col items-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-[0_18px_36px_-30px_rgba(0,0,0,0.55)] transition-shadow"
            variants={resolveVariant(fadeInUp, shouldReduceMotion)}
            {...hoverProps}
          >
            <img
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              className="h-16 w-auto object-contain"
              loading="lazy"
            />
            <div className="mt-4">
              <p className="text-base font-semibold text-sf-black">
                {sponsor.name}
              </p>
              <p className="mt-1 text-sm text-sf-black/70">
                {sponsor.contribution}
              </p>
            </div>
          </MotionTag>
        );
      })}
    </div>
  );
};

SponsorGrid.propTypes = {
  sponsors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      contribution: PropTypes.string.isRequired,
      website: PropTypes.string,
      logo: PropTypes.string.isRequired,
    }),
  ).isRequired,
  className: PropTypes.string,
};

export default SponsorGrid;
