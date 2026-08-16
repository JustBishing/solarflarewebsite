import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useShouldReduceMotion, viewportConfig } from '../lib/motion.js';

/**
 * Two-tone headline: the first line sits in solid white, every following
 * line in the flare gradient. Each line wipes in via clip-path.
 *
 * The wipe is deliberate. Per-character transforms break `background-clip:
 * text`, so animating the clip instead keeps one continuous gradient across
 * the line rather than restarting it per word.
 */

/** Splits a headline at the middle word boundary when lines aren't given. */
const splitHeadline = (text) => {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) {
    return [text];
  }
  const pivot = Math.ceil(words.length / 2);
  return [words.slice(0, pivot).join(' '), words.slice(pivot).join(' ')];
};

const lineVariants = {
  hidden: { clipPath: 'inset(0 100% -25% 0)', y: 10 },
  visible: {
    clipPath: 'inset(0 0% -25% 0)',
    y: 0,
    transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
  },
};

const staticVariants = {
  hidden: { clipPath: 'inset(0 0% -25% 0)', y: 0 },
  visible: { clipPath: 'inset(0 0% -25% 0)', y: 0, transition: { duration: 0 } },
};

const KineticHeading = ({
  text,
  lines,
  className = '',
  style,
  as = 'h1',
  trigger = 'mount',
}) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const resolvedLines = (lines ?? splitHeadline(text ?? '')).filter(Boolean);
  const variants = shouldReduceMotion ? staticVariants : lineVariants;
  const MotionHeading = motion[as] || motion.h1;

  const animationProps =
    trigger === 'view'
      ? {
          whileInView: 'visible',
          viewport: viewportConfig(shouldReduceMotion),
        }
      : { animate: 'visible' };

  return (
    <MotionHeading
      className={`heading-hero font-extrabold ${className}`}
      style={style}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.14 }}
      {...animationProps}
    >
      {resolvedLines.map((line, index) => (
        <motion.span
          key={line}
          className={`block ${index === 0 ? 'text-sf-text' : 'text-gradient-flare'}`}
          variants={variants}
        >
          {line}
        </motion.span>
      ))}
    </MotionHeading>
  );
};

KineticHeading.propTypes = {
  text: PropTypes.string,
  lines: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  style: PropTypes.object,
  as: PropTypes.string,
  trigger: PropTypes.oneOf(['mount', 'view']),
};

export default KineticHeading;
