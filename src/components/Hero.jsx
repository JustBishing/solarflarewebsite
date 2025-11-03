import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  fadeInUp,
  resolveVariant,
  scaleTap,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionLink = motion(Link);

const Hero = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const containerVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const itemVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const hoverPrimary = shouldReduceMotion
    ? {}
    : { whileHover: { scale: 1.02 } };
  const hoverSecondary = shouldReduceMotion
    ? {}
    : { whileHover: { scale: 1.01 } };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#EA5020,#F89221)] text-white">
      <div className="container flex min-h-[70vh] flex-col justify-center py-24 sm:py-32">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          <motion.p
            className="text-sm font-semibold uppercase tracking-[0.3rem] text-white/70"
            variants={itemVariants}
          >
            FTC Team #25707
          </motion.p>
          <motion.h1
            className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            The next level of innovation.
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-white/85 sm:text-xl"
            variants={itemVariants}
          >
            Solar Flare Robotics is an FTC team from the NY-Excelsior region,
            building advanced robots, mentoring peers, and expanding STEM access
            across our community. We are fiscally sponsored by Hack Club, so
            every contribution is tax-deductible.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            variants={itemVariants}
          >
            <MotionLink
              to="/team"
              className="rounded-xl bg-sf-black px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverPrimary}
            >
              Meet the team
            </MotionLink>
            <MotionLink
              to="/sponsorships"
              className="rounded-xl border border-sf-black px-6 py-3 text-base font-semibold text-sf-black transition hover:border-sf-orange-1 hover:text-sf-orange-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverSecondary}
            >
              Support our season
            </MotionLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
