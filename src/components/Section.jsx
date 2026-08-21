import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection.jsx';
import SectionIndex from './SectionIndex.jsx';
import KineticHeading from './KineticHeading.jsx';
import {
  fadeIn,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

/**
 * Layout variants exist so consecutive sections don't share one rhythm.
 *  - default : heading over content, measure-constrained
 *  - wide    : same stack at full container width, for grids
 *  - split   : heading parked in a sticky left column, content right
 *  - feature : centred, for the stat band
 */
const VARIANTS = {
  default: {
    container: 'max-w-6xl',
    header: 'max-w-2xl',
    split: false,
    heading: 'text-3xl sm:text-5xl',
  },
  wide: {
    container: 'max-w-7xl',
    header: 'max-w-3xl',
    split: false,
    heading: 'text-3xl sm:text-5xl',
  },
  split: {
    container: 'max-w-7xl',
    header: '',
    split: true,
    // The split heading lives in a 22rem column, so it gets a smaller step
    // than a full-width one. At 5xl a title like "Explore opportunities in
    // sponsorships" broke to four lines and stranded "in" on its own.
    heading: 'text-3xl sm:text-4xl',
  },
  feature: {
    container: 'max-w-6xl',
    header: 'max-w-3xl',
    split: false,
    heading: 'text-3xl sm:text-5xl',
  },
};

const BANDS = {
  none: '',
  angled: 'band-angled',
  'angled-alt': 'band-angled-alt',
};

const Section = ({
  title,
  titleAccent,
  eyebrow,
  description,
  children,
  className = '',
  id,
  variant = 'default',
  band = 'none',
  railLabel,
  index,
  headingLevel = 'h2',
}) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const layout = VARIANTS[variant] ?? VARIANTS.default;
  const bandClass = BANDS[band] ?? '';
  const headingLines = [title, titleAccent].filter(Boolean);

  const header = (
    <MotionDiv
      variants={resolveVariant(fadeIn, shouldReduceMotion)}
      className={layout.split ? 'lg:sticky lg:top-32' : `mb-10 ${layout.header}`}
    >
      {eyebrow ? (
        <p className="label-mono mb-5 text-sf-orange-2">{eyebrow}</p>
      ) : null}
      <KineticHeading
        as={headingLevel}
        lines={headingLines}
        trigger="view"
        className={`leading-[1.08] ${layout.heading}`}
      />
      {description ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-sf-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </MotionDiv>
  );

  return (
    <AnimatedSection id={id} className={bandClass} variant={staggerChildren}>
      <div className={`py-16 sm:py-24 ${className}`}>
        <div className={`container relative ${layout.container}`}>
          {railLabel ? <SectionIndex label={railLabel} index={index} /> : null}
          {layout.split ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
              <div>{header}</div>
              <div className="grid gap-8">{children}</div>
            </div>
          ) : (
            <>
              {header}
              <div className="grid gap-8">{children}</div>
            </>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  titleAccent: PropTypes.string,
  eyebrow: PropTypes.string,
  description: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'wide', 'split', 'feature']),
  band: PropTypes.oneOf(['none', 'angled', 'angled-alt']),
  railLabel: PropTypes.string,
  index: PropTypes.string,
  /**
   * The heading element for the section title. Every Section rendered h2, so
   * /team, /past-seasons and /sponsorships had no h1 at all — the first
   * section on a page should pass "h1".
   */
  headingLevel: PropTypes.oneOf(['h1', 'h2']),
};

export default Section;
