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
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_28px_40px_-35px_rgba(0,0,0,0.5)] transition-shadow ${className}`}
      variants={resolveVariant(fadeInUp, shouldReduceMotion)}
      {...hoverProps}
      whileTap={scaleTap}
    >
      <span className="h-1 w-full bg-sf-orange-1" />
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div>
          {subtitle ? (
            <p className="text-sm font-semibold uppercase tracking-[0.15rem] text-sf-orange-1/90">
              {subtitle}
            </p>
          ) : null}
          {title ? (
            <h3 className="mt-3 text-xl font-semibold text-sf-black sm:text-2xl">
              {title}
            </h3>
          ) : null}
        </div>
        {children ? (
          <div className="mt-4 text-base leading-relaxed text-sf-black/80">
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
