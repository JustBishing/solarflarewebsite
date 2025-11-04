import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useShouldReduceMotion } from '../lib/motion.js';

const FIREWORK_COLORS = ['#EA5020', '#F89221', '#FFB15C'];
const MIN_HEIGHT = 25;
const MAX_HEIGHT = 60;
const ROCKET_DURATION = 2.6;
const EXPLOSION_DELAY = 2.45;
const EXPLOSION_DURATION = 2.6;

const Fireworks = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const [launches, setLaunches] = useState([]);
  const schedulerRef = useRef();
  const cleanupTimersRef = useRef([]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    let mounted = true;

    const scheduleNext = (delay) => {
      schedulerRef.current = window.setTimeout(() => {
        if (!mounted) {
          return;
        }

        const baseX = 15 + Math.random() * 70;
        const peakY = MIN_HEIGHT + Math.random() * (MAX_HEIGHT - MIN_HEIGHT);
        const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        setLaunches((current) => [
          ...current,
          {
            id,
            x: baseX,
            height: peakY,
            color,
          },
        ]);

        const removalTimeout = window.setTimeout(() => {
          setLaunches((current) =>
            current.filter((firework) => firework.id !== id),
          );
          cleanupTimersRef.current = cleanupTimersRef.current.filter(
            (timerId) => timerId !== removalTimeout,
          );
        }, 4000);

        cleanupTimersRef.current.push(removalTimeout);
        scheduleNext(4200 + Math.random() * 2800);
      }, delay);
    };

    scheduleNext(2000 + Math.random() * 2000);

    return () => {
      mounted = false;
      window.clearTimeout(schedulerRef.current);
      cleanupTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      cleanupTimersRef.current = [];
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {launches.map((launch) => (
        <Launch key={launch.id} launch={launch} />
      ))}
    </div>
  );
};

export default Fireworks;

const EASE = [0.22, 1, 0.36, 1];
const MotionDiv = motion.div;
const MotionSpan = motion.span;
const PARTICLE_COUNT = 18;

const Launch = ({ launch }) => {
  const travelDistance = 100 - launch.height;
  const particlesRef = useRef(null);

  if (!particlesRef.current) {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
      const baseAngle = (Math.PI * 2 * index) / PARTICLE_COUNT;
      const jitter = (Math.random() - 0.5) * 0.4;
      return {
        angle: baseAngle + jitter,
        radius: 120 + Math.random() * 100,
        size: 4 + Math.random() * 6,
        opacity: 0.75 + Math.random() * 0.2,
        duration: EXPLOSION_DURATION + Math.random() * 0.4,
      };
    });
  }

  const particles = particlesRef.current;

  return (
    <div className="absolute inset-0">
      <MotionDiv
        className="absolute"
        style={{
          left: `${launch.x}%`,
          top: '100%',
          transform: 'translate(-50%, 0)',
        }}
        initial={{ y: 0, opacity: 0, scale: 0.9 }}
        animate={{ y: `-${travelDistance}vh`, opacity: 1, scale: 1 }}
        transition={{ duration: ROCKET_DURATION, ease: EASE }}
      >
        <MotionSpan
          className="block h-32 w-2 rounded-full bg-gradient-to-b from-white/95 via-white/45 to-transparent shadow-[0_0_18px_rgba(255,255,255,0.75)]"
          animate={{ opacity: [0.15, 1, 0.4], scaleY: [0.6, 1, 1] }}
          transition={{ duration: ROCKET_DURATION, ease: EASE }}
        />
      </MotionDiv>

      <MotionDiv
        className="absolute h-[45vmin] w-[45vmin]"
        style={{
          left: `${launch.x}%`,
          top: `${launch.height}vh`,
          transform: 'translate(-50%, -50%)',
          color: launch.color,
        }}
        initial={{ scale: 0.35, opacity: 0 }}
        animate={{ scale: [0.35, 1.05, 1.1], opacity: [0, 0.55, 0] }}
        transition={{ duration: EXPLOSION_DURATION, ease: EASE, delay: EXPLOSION_DELAY }}
      >
        <MotionSpan
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: `${launch.color}88` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0.4, 0.15, 0], scale: 1.05 }}
          transition={{ duration: EXPLOSION_DURATION, ease: EASE, delay: EXPLOSION_DELAY }}
        />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85 shadow-[0_0_16px_rgba(255,255,255,0.85)]" />
        {particles.map((particle, idx) => (
          <MotionSpan
            key={`${launch.id}-ray-${idx}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: launch.color,
              filter: 'blur(0.5px)',
            }}
            initial={{ x: 0, y: 0, opacity: particle.opacity }}
            animate={{
              x: Math.cos(particle.angle) * particle.radius,
              y: Math.sin(particle.angle) * particle.radius,
              opacity: [particle.opacity, particle.opacity * 0.6, 0],
              scale: [1, 0.85, 0.6],
            }}
            transition={{
              duration: particle.duration,
              ease: EASE,
              delay: EXPLOSION_DELAY + 0.05 * Math.random(),
            }}
          />
        ))}
      </MotionDiv>
    </div>
  );
};
