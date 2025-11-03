import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useShouldReduceMotion } from '../lib/motion.js';

const MotionDiv = motion.div;

const RouteTransition = ({ children }) => {
  const shouldReduceMotion = useShouldReduceMotion();

  const variants = shouldReduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 8 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0,
          y: -8,
          transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <MotionDiv
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="flex flex-1 flex-col"
    >
      {children}
    </MotionDiv>
  );
};

RouteTransition.propTypes = {
  children: PropTypes.node,
};

export default RouteTransition;
