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
import HeroGlow from './HeroGlow.jsx';
import KineticHeading from './KineticHeading.jsx';
import ScrollBadge from './ScrollBadge.jsx';

const MotionLink = motion(Link);

const Hero = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { hero, branding },
  } = useSiteContent();
  const containerVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const itemVariants = resolveVariant(fadeInUp, shouldReduceMotion);
  const hoverPrimary = shouldReduceMotion ? {} : { whileHover: { scale: 1.02 } };
  const hoverSecondary = shouldReduceMotion ? {} : { whileHover: { scale: 1.01 } };

  return (
    <section className="relative overflow-hidden text-sf-text">
      <HeroGlow />
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

      {/* Oversized team number filling the empty right half of the hero. */}
      <span
        aria-hidden="true"
        className="heading-hero pointer-events-none absolute right-[-2%] top-1/2 hidden -translate-y-1/2 select-none font-black leading-none text-white/[0.04] xl:block"
        style={{ fontSize: 'clamp(12rem, 22vw, 22rem)' }}
      >
        {branding.teamNumber}
      </span>

      <div className="container relative flex min-h-[80vh] flex-col justify-center py-24 sm:py-28">
        <motion.div
          className="max-w-4xl"
          variants={containerVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          <motion.p
            className="label-mono inline-flex items-center gap-3 text-sf-orange-2"
            variants={itemVariants}
          >
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-sf-orange-1 shadow-[0_0_14px_rgba(255,145,77,0.9)]" />
            {hero.eyebrow}
          </motion.p>

          <KineticHeading
            text={hero.title}
            className="mt-8"
            style={{
              fontSize: 'clamp(2.75rem, 7.2vw, 5.5rem)',
              lineHeight: 1.06,
            }}
          />

          <motion.p
            className="mt-8 max-w-xl text-lg leading-[1.75] text-sf-muted"
            variants={itemVariants}
          >
            {hero.description}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
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
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
          variants={itemVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          <div className="grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex items-start gap-3">
                <span
                  className={`mt-1.5 inline-flex h-1.5 w-1.5 shrink-0 rotate-45 ${
                    stat.accent === 'orange'
                      ? 'bg-sf-orange-1 shadow-[0_0_12px_rgba(255,145,77,0.75)]'
                      : 'bg-white/70'
                  }`}
                />
                <span className="text-sm leading-relaxed text-sf-muted/80">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <ScrollBadge className="shrink-0 self-center lg:self-auto" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
