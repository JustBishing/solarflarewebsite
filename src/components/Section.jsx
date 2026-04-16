import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection.jsx';
import { fadeIn, resolveVariant, staggerChildren, useShouldReduceMotion } from '../lib/motion.js';

const MotionDiv = motion.div;

const Section = ({
  title,
  eyebrow,
  description,
  children,
  className = '',
  id,
}) => {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <AnimatedSection
      id={id}
      className={`py-16 sm:py-24 ${className}`}
      variant={staggerChildren}
    >
      <div className="container max-w-6xl">
        <MotionDiv variants={resolveVariant(fadeIn, shouldReduceMotion)} className="mb-8 max-w-2xl">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3rem] text-sf-orange-2">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="heading-display mt-4 text-3xl font-bold leading-tight text-sf-text sm:text-5xl">
            {title}
          </h2>
          <div className="mt-4 h-[2px] w-20 rounded-full bg-gradient-to-r from-sf-orange-1 via-sf-orange-2 to-transparent" />
          {description ? (
            <p className="mt-6 text-base text-sf-muted sm:text-lg">
              {description}
            </p>
          ) : null}
        </MotionDiv>
        <div className="grid gap-8">{children}</div>
      </div>
    </AnimatedSection>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  eyebrow: PropTypes.string,
  description: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Section;
