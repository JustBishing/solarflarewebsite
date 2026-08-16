import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useInView } from 'framer-motion';
import { useShouldReduceMotion } from '../lib/motion.js';

const MotionDiv = motion.div;

/** Splits "#10" into prefix "#", digits "10", suffix "". */
const VALUE_PATTERN = /^(\D*?)(\d[\d,]*)(.*)$/;
const COUNT_MS = 1100;
const easeOutExpo = (progress) =>
  progress >= 1 ? 1 : 1 - 2 ** (-10 * progress);

/**
 * Counts the numeric portion of `value` up from zero once the block scrolls
 * into view. Non-numeric values (and reduced-motion visitors) render the
 * final string immediately.
 */
const useCountUp = (value, enabled, inView) => {
  const match = VALUE_PATTERN.exec(value);
  const target = match ? Number.parseInt(match[2].replace(/,/g, ''), 10) : null;
  const [current, setCurrent] = useState(() =>
    enabled && target !== null ? 0 : target,
  );

  useEffect(() => {
    if (!enabled || target === null || !inView) {
      setCurrent(target);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / COUNT_MS, 1);
      setCurrent(Math.round(easeOutExpo(progress) * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, inView, target]);

  if (!match || target === null) {
    return { prefix: '', display: value, suffix: '' };
  }

  return {
    prefix: match[1],
    display: (current ?? target).toLocaleString('en-US'),
    suffix: match[3],
  };
};

const StatBlock = ({ value, label, caption, accent = false }) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { prefix, display, suffix } = useCountUp(
    value,
    !shouldReduceMotion,
    inView,
  );

  return (
    <MotionDiv
      ref={ref}
      className="flex items-center gap-4 sm:gap-5"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className={`heading-hero shrink-0 font-black leading-[0.82] tabular-nums ${
          accent ? 'text-sf-ember' : 'text-sf-text'
        }`}
        style={{ fontSize: 'clamp(3.25rem, 7vw, 5.5rem)' }}
      >
        <span className={accent ? 'text-sf-ember/55' : 'text-white/35'}>
          {prefix}
        </span>
        {display}
        {suffix}
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
