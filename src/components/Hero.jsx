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
  const hoverPrimary = shouldReduceMotion ? {} : { whileHover: { scale: 1.02 } };
  const hoverSecondary = shouldReduceMotion ? {} : { whileHover: { scale: 1.01 } };

  return (
    <section className="relative overflow-hidden text-sf-text">
      <div className="absolute inset-0 -z-20 bg-sf-bg" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(234,80,32,0.4),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(32,46,90,0.8),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 opacity-60 mix-blend-screen bg-[conic-gradient(from_120deg_at_50%_50%,rgba(248,146,33,0.25),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(9,13,26,0.4),transparent)]" />

      <div className="container flex min-h-[72vh] flex-col justify-center py-24 sm:py-32">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.4rem] text-sf-muted/80 sm:text-sm"
            variants={itemVariants}
          >
            FTC Team #25707 · Into the Deep
          </motion.p>
          <motion.h1
            className="mt-6 text-4xl font-extrabold leading-tight text-sf-text sm:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            Lighting the future of FTC innovation.
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-sf-muted sm:text-xl"
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
              className="rounded-xl bg-sf-orange-1 px-6 py-3 text-base font-semibold text-sf-bg shadow-[0_20px_38px_-18px_rgba(234,80,32,0.65)] transition hover:bg-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverPrimary}
            >
              Meet the team
            </MotionLink>
            <MotionLink
              to="/sponsorships"
              className="rounded-xl border border-sf-border/80 px-6 py-3 text-base font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverSecondary}
            >
              Support our season
            </MotionLink>
          </motion.div>
          <motion.div
            className="mt-10 grid gap-4 text-sm text-sf-muted sm:grid-cols-2"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 rounded-xl border border-sf-border/80 bg-sf-surface/70 px-4 py-3 backdrop-blur-sm">
              <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-sf-orange-1 shadow-[0_0_12px_rgba(234,80,32,0.75)]" />
              <span>2024-25 Excelsior Finalist Alliance Captain & Design Award winners.</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-sf-border/80 bg-sf-surface/70 px-4 py-3 backdrop-blur-sm">
              <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-white/80" />
              <span>Fiscally sponsored by Hack Club Bank · donations stay tax-deductible.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
