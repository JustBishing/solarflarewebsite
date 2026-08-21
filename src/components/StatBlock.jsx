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
 * Type ramp per scale. `lead` is the one figure the section is built around;
 * `default` is a supporting result; `minor` is a fact that belongs on the page
 * but does not deserve scoreboard type — a 75th-place finish set at the same
 * size as a first-place one reads as though the team can't tell them apart.
 */
const SCALE = {
  lead: {
    narrow: 'clamp(4.5rem, 13vw, 9rem)',
    wide: 'clamp(3rem, 8vw, 5rem)',
    widest: 'clamp(2.25rem, 5.5vw, 3.5rem)',
    label: 'text-[0.78rem] tracking-[0.3em] text-sf-text',
  },
  default: {
    // Sized to sit beside the lead figure without competing with it: two of
    // these stacked come out roughly as tall as one lead numeral.
    narrow: 'clamp(2.5rem, 5vw, 3.75rem)',
    wide: 'clamp(2.75rem, 5.5vw, 4rem)',
    widest: 'clamp(2rem, 4vw, 2.75rem)',
    label: 'text-sf-muted/85',
  },
  minor: {
    narrow: 'clamp(1.75rem, 3vw, 2.25rem)',
    wide: 'clamp(1.5rem, 2.6vw, 2rem)',
    widest: 'clamp(1.25rem, 2.2vw, 1.6rem)',
    label: 'text-white/55',
  },
};

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
const StatBlock = ({ value, label, caption, accent = false, scale = 'default' }) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const match = VALUE_PATTERN.exec(value);
  const ramp = SCALE[scale] ?? SCALE.default;
  // Ranks ("#10", "1st") fit beside their label at hero scale. Currency tiers
  // ("$2,500+") do not — at that size they overrun a 20rem column and land on
  // top of the neighbouring copy, so they step down a size and stack instead.
  // The values come from Firestore, so the step has to hold for longer amounts
  // an editor might type later, not just the ones on the page today.
  const isWide = value.length > 3;
  const valueFontSize = !isWide
    ? ramp.narrow
    : value.length > 7
      ? ramp.widest
      : ramp.wide;

  // The lead figure stacks so the numeral owns its own line at full width;
  // minor figures run inline so a whole row of them costs one line of page.
  const stacksUnderValue = isWide || scale === 'lead';

  return (
    <MotionDiv
      className={`flex gap-3 sm:gap-5 ${
        stacksUnderValue ? 'flex-col items-start' : 'items-center gap-4'
      }`}
      variants={resolveVariant(fadeInUp, shouldReduceMotion)}
    >
      <span
        className={`heading-hero min-w-0 max-w-full shrink-0 font-black leading-[0.82] tabular-nums ${
          accent ? 'text-sf-ember' : 'text-sf-text'
        }`}
        style={{ fontSize: valueFontSize }}
      >
        {match ? (
          <>
            <span className={accent ? 'text-sf-ember/85' : 'text-white/60'}>
              {match[1]}
            </span>
            {match[2]}
            {match[3]}
          </>
        ) : (
          value
        )}
      </span>
      <span
        className={`flex min-w-0 flex-col gap-1.5 ${
          stacksUnderValue
            ? 'border-t border-white/10 pt-3'
            : 'border-l border-white/10 pl-4 sm:pl-5'
        }`}
      >
        <span className={`label-mono leading-[1.7] ${ramp.label}`}>{label}</span>
        {caption ? (
          <span className="label-mono text-[0.6rem] text-white/60">{caption}</span>
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
  scale: PropTypes.oneOf(['lead', 'default', 'minor']),
};

export default StatBlock;
