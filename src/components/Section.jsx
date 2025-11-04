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
            <p className="text-sm font-semibold uppercase tracking-[0.2rem] text-sf-orange-1">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-4 text-3xl font-bold leading-tight text-sf-text sm:text-4xl">
            {title}
          </h2>
          <div className="mt-3 h-0.5 w-16 bg-sf-orange-1" />
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
