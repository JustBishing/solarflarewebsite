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
 * the sponsors read as one set.
 *
 * `showContribution` is off by default. The amount belongs on /sponsorships,
 * where a prospective sponsor is reading terms — printing "$200 credit" under
 * a logo on the home page answers a question nobody asked there and values the
 * partner at the size of the cheque instead of the name.
 */
const SponsorGrid = ({ sponsors, showContribution = false, className = '' }) => {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <div
      // Hairlines come from each tile's own 1px outer shadow filling the 1px
      // gap, not from a background behind the grid. A sponsor count that
      // doesn't divide evenly then leaves a genuinely empty cell instead of a
      // lighter panel that reads as a missing logo.
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {sponsors.map((sponsor) => {
        const MotionTag = sponsor.website ? motion.a : motion.div;

        return (
          <MotionTag
            key={sponsor.name}
            href={sponsor.website}
            target={sponsor.website ? '_blank' : undefined}
            rel={sponsor.website ? 'noreferrer' : undefined}
            className="group flex flex-col items-center justify-between gap-5 bg-sf-bg shadow-[0_0_0_1px_rgba(255,255,255,0.07)] p-6 text-center transition-colors duration-300 hover:bg-sf-elevated focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sf-orange-2 sm:p-8"
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
              {showContribution && sponsor.contribution ? (
                <p className="label-mono mt-2 text-white/65">
                  {sponsor.contribution}
                </p>
              ) : null}
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
      contribution: PropTypes.string,
      website: PropTypes.string,
      logo: PropTypes.string.isRequired,
    }),
  ).isRequired,
  showContribution: PropTypes.bool,
  className: PropTypes.string,
};

export default SponsorGrid;
