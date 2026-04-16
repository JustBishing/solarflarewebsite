import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  fadeInUp,
  resolveVariant,
  scaleTap,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';
import { useSiteContent } from '../context/useSiteContent.js';

const MotionLink = motion(Link);

const Hero = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { hero },
  } = useSiteContent();
  const containerVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const itemVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const hoverPrimary = shouldReduceMotion ? {} : { whileHover: { scale: 1.02 } };
  const hoverSecondary = shouldReduceMotion ? {} : { whileHover: { scale: 1.01 } };

  return (
    <section className="relative overflow-hidden text-sf-text">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-[-5%] h-[30vh] w-[30vh] rounded-full bg-sf-orange-1/12 blur-3xl animate-aura-drift" />
        <div className="absolute top-1/2 left-[-5%] h-[22vh] w-[22vh] rounded-full bg-sf-orange-2/8 blur-3xl animate-aura-drift-slow" />
        <div className="absolute bottom-[-10%] right-1/3 h-[24vh] w-[24vh] rounded-full bg-red-600/8 blur-3xl animate-aura-drift" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.75) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.75) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 75%)',
        }}
      />

      <div className="container flex min-h-[78vh] flex-col justify-center py-24 sm:py-32">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          <motion.p
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.35rem] text-white backdrop-blur-sm sm:text-xs"
            variants={itemVariants}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            className="heading-display mt-10 text-5xl font-bold sm:text-6xl lg:text-7xl text-gradient-flare drop-shadow-[0_0_24px_rgba(255,255,255,0.10)]"
            style={{ lineHeight: 1.25 }}
            variants={itemVariants}
          >
            {hero.title}
          </motion.h1>
          <motion.p
            className="mt-10 max-w-2xl text-lg leading-[1.8] text-sf-muted sm:text-xl"
            variants={itemVariants}
          >
            {hero.description}
          </motion.p>
          <motion.div
            className="mt-14 flex flex-wrap gap-4"
            variants={itemVariants}
          >
            <MotionLink
              to={hero.primaryCtaLink}
              className="btn-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverPrimary}
            >
              {hero.primaryCtaLabel}
            </MotionLink>
            <MotionLink
              to={hero.secondaryCtaLink}
              className="btn-ghost focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2"
              whileTap={scaleTap}
              {...hoverSecondary}
            >
              {hero.secondaryCtaLabel}
            </MotionLink>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-4 text-sm text-sf-muted sm:grid-cols-2"
            variants={itemVariants}
          >
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md"
              >
                <span
                  className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${
                    stat.accent === 'orange'
                      ? 'bg-sf-orange-1 shadow-[0_0_12px_rgba(234,80,32,0.75)]'
                      : 'bg-white/80'
                  }`}
                />
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
