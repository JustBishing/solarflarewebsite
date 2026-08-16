import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  hoverLift,
  resolveVariant,
  scaleTap,
  useShouldReduceMotion,
} from '../lib/motion.js';

/**
 * The old card led with a gradient strip on every instance, which is what
 * made stacked sections read as one repeating object. Hierarchy now comes
 * from the mono eyebrow and the display title instead.
 */
const Card = ({
  title,
  subtitle,
  eyebrow,
  children,
  className = '',
  as = 'article',
}) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const MotionComponent = motion[as] || motion.article;
  const hoverProps = shouldReduceMotion ? {} : { whileHover: hoverLift };

  return (
    <MotionComponent
      className={`glass-card group flex h-full flex-col overflow-hidden ${className}`}
      variants={resolveVariant(fadeInUp, shouldReduceMotion)}
      {...hoverProps}
      whileTap={scaleTap}
    >
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          {subtitle ? (
            <p className="label-mono text-sf-orange-2">{subtitle}</p>
          ) : null}
          {eyebrow ? (
            <p className="label-mono shrink-0 text-white/30">{eyebrow}</p>
          ) : null}
        </div>
        {title ? (
          <h3 className="heading-display mt-3 text-xl font-bold text-sf-text transition-colors group-hover:text-sf-orange-2 sm:text-2xl">
            {title}
          </h3>
        ) : null}
        {children ? (
          <div className="mt-4 text-base leading-relaxed text-sf-muted/90">
            {children}
          </div>
        ) : null}
      </div>
    </MotionComponent>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  eyebrow: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.string,
};

export default Card;
