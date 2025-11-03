import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import {
  fadeInUp,
  resolveVariant,
  viewportConfig,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionSection = motion.section;

const AnimatedSection = ({ children, className = '', variant = fadeInUp, id }) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const resolvedVariant = resolveVariant(variant, shouldReduceMotion);

  return (
    <MotionSection
      id={id}
      className={className}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={viewportConfig(shouldReduceMotion)}
      variants={resolvedVariant}
    >
      {children}
    </MotionSection>
  );
};

AnimatedSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.object,
  id: PropTypes.string,
};

export default AnimatedSection;
