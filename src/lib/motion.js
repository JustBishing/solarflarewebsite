import { useReducedMotion } from 'framer-motion';

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const disabledVariant = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

export const resolveVariant = (variant, shouldReduceMotion) =>
  shouldReduceMotion ? disabledVariant : variant;

export const scaleTap = { scale: 0.98 };

export const hoverLift = { y: -2 };

export const viewportConfig = (shouldReduceMotion) => ({
  once: true,
  amount: shouldReduceMotion ? 0.05 : 0.22,
});

export const useShouldReduceMotion = () => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion;
};
