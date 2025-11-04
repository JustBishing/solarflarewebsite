import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useShouldReduceMotion } from '../lib/motion.js';

const FIREWORK_COLORS = ['#EA5020', '#F89221', '#FF7A3D', '#FFB15C', '#FFCB7A'];
const EXPLOSION_DURATION = 4;

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
        const baseY = 20 + Math.random() * 50;
        const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        setLaunches((current) => [
          ...current,
          {
            id,
            x: baseX,
            y: baseY,
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
        }, 6200);

        cleanupTimersRef.current.push(removalTimeout);
        scheduleNext(4200 + Math.random() * 2600);
      }, delay);
    };

    scheduleNext(1800 + Math.random() * 2200);

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
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
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
const PARTICLE_COUNT = 24;

const Launch = ({ launch }) => {
  const particlesRef = useRef(null);

  if (!particlesRef.current) {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
      const baseAngle = (Math.PI * 2 * index) / PARTICLE_COUNT;
      const jitter = (Math.random() - 0.5) * 0.4;
      return {
        angle: baseAngle + jitter,
        radius: 180 + Math.random() * 140,
        size: 7 + Math.random() * 10,
        opacity: 0.92 + Math.random() * 0.08,
        duration: EXPLOSION_DURATION + Math.random() * 0.8,
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      };
    });
  }

  const particles = particlesRef.current;

  return (
    <div className="absolute inset-0">
      <MotionDiv
        className="absolute h-[60vmin] w-[60vmin]"
        style={{
          left: `${launch.x}%`,
          top: `${launch.y}vh`,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0.25, opacity: 0 }}
        animate={{ scale: [0.25, 1.15, 1.25], opacity: [0, 0.75, 0] }}
        transition={{ duration: EXPLOSION_DURATION, ease: EASE }}
      >
        <MotionSpan
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: `${launch.color}CC` }}
          initial={{ opacity: 0, scale: 0.35 }}
          animate={{ opacity: [0.75, 0.35, 0], scale: 1.05 }}
          transition={{ duration: EXPLOSION_DURATION, ease: EASE }}
        />
        <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.95)]" />
        {particles.map((particle, idx) => (
          <MotionSpan
            key={`${launch.id}-ray-${idx}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              filter: 'blur(0.6px)',
              boxShadow: `0 0 18px ${particle.color}88`,
            }}
            initial={{ x: 0, y: 0, opacity: particle.opacity }}
            animate={{
              x: Math.cos(particle.angle) * particle.radius,
              y: Math.sin(particle.angle) * particle.radius,
              opacity: [particle.opacity, particle.opacity * 0.7, 0],
              scale: [1, 0.9, 0.6],
            }}
            transition={{
              duration: particle.duration,
              ease: EASE,
              delay: 0.08 * Math.random(),
            }}
          />
        ))}
      </MotionDiv>
    </div>
  );
};
