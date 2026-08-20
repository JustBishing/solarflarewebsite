import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  resolveVariant,
  useShouldReduceMotion,
} from '../lib/motion.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';

/**
 * Logo wall rather than a grid of cards. Tiles share hairline borders so
 * the sponsors read as one set; the contribution line only surfaces the
 * amount, which is the part a prospective sponsor is scanning for.
 */
const SponsorGrid = ({ sponsors, className = '' }) => {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] sm:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {sponsors.map((sponsor) => {
        const MotionTag = sponsor.website ? motion.a : motion.div;

        return (
          <MotionTag
            key={sponsor.name}
            href={sponsor.website}
            target={sponsor.website ? '_blank' : undefined}
            rel={sponsor.website ? 'noreferrer' : undefined}
            className="group flex flex-col items-center justify-between gap-5 bg-sf-bg p-6 text-center transition-colors duration-300 hover:bg-sf-elevated focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sf-orange-2 sm:p-8"
            variants={resolveVariant(fadeInUp, shouldReduceMotion)}
          >
            <div className="flex min-h-[6rem] w-full items-center justify-center">
              <img
                src={resolveSiteAssetUrl(sponsor.logo)}
                alt={`${sponsor.name} logo`}
                className="max-h-20 w-full object-contain opacity-75 transition-all duration-300 group-hover:opacity-100"
                loading="lazy"
              />
            </div>
            <div>
              <p className="heading-display text-sm font-semibold text-sf-text">
                {sponsor.name}
              </p>
              <p className="label-mono mt-2 text-white/65">
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
