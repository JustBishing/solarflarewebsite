import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  resolveVariant,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

/** Splits "#10" into prefix "#", digits "10", suffix "" so the prefix can be dimmed. */
const VALUE_PATTERN = /^(\D*?)(\d[\d,]*)(.*)$/;

/**
 * Competition figure at scoreboard scale.
 *
 * This deliberately renders the value as static text. It previously counted
 * up on scroll, via rAF and then via a MotionValue, and both raced badly
 * enough in a production build to leave the figures frozen part way — the
 * live site showed "#2" where it should have read "#10". These numbers are
 * the most load-bearing content on the page, so they are not worth risking
 * for a tick animation. The entrance fade below is the only motion here.
 */
const StatBlock = ({ value, label, caption, accent = false }) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const match = VALUE_PATTERN.exec(value);

  return (
    <MotionDiv
      className="flex items-center gap-4 sm:gap-5"
      variants={resolveVariant(fadeInUp, shouldReduceMotion)}
    >
      <span
        className={`heading-hero shrink-0 font-black leading-[0.82] tabular-nums ${
          accent ? 'text-sf-ember' : 'text-sf-text'
        }`}
        style={{ fontSize: 'clamp(3.25rem, 7vw, 5.5rem)' }}
      >
        {match ? (
          <>
            <span className={accent ? 'text-sf-ember/55' : 'text-white/35'}>
              {match[1]}
            </span>
            {match[2]}
            {match[3]}
          </>
        ) : (
          value
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-1.5 border-l border-white/10 pl-4 sm:pl-5">
        <span className="label-mono leading-[1.7] text-sf-muted/85">{label}</span>
        {caption ? (
          <span className="label-mono text-[0.6rem] text-white/35">{caption}</span>
        ) : null}
      </span>
    </MotionDiv>
  );
};

StatBlock.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  caption: PropTypes.string,
  accent: PropTypes.bool,
};

export default StatBlock;
