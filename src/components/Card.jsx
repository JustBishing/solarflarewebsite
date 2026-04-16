import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  hoverLift,
  resolveVariant,
  scaleTap,
  useShouldReduceMotion,
} from '../lib/motion.js';

const Card = ({
  title,
  subtitle,
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
      <span
        aria-hidden="true"
        className="h-[2px] w-full bg-gradient-to-r from-sf-orange-1 via-sf-orange-2 to-transparent"
      />
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div>
          {subtitle ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22rem] text-sf-orange-2">
              {subtitle}
            </p>
          ) : null}
          {title ? (
            <h3 className="heading-display mt-3 text-xl font-semibold text-sf-text sm:text-2xl">
              {title}
            </h3>
          ) : null}
        </div>
        {children ? (
          <div className="mt-4 text-base leading-relaxed text-sf-muted">
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
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.string,
};

export default Card;
