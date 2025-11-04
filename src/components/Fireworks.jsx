import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useShouldReduceMotion } from '../lib/motion.js';

const FIREWORK_COLORS = ['#EA5020', '#F89221', '#FFB15C'];

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
        const peakY = 18 + Math.random() * 60;
        const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        setLaunches((current) => [
          ...current,
          {
            id,
            x: baseX,
            peakY,
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
        scheduleNext(4000 + Math.random() * 3200);
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
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
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
const RAY_COUNT = 12;

const Launch = ({ launch }) => {
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
        animate={{ y: `-${launch.peakY}vh`, opacity: 0.9, scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <MotionSpan
          className="block h-28 w-2 rounded-full bg-gradient-to-b from-white/90 via-white/40 to-transparent shadow-[0_0_16px_rgba(255,255,255,0.7)]"
          animate={{ opacity: [0, 1, 0.4], scaleY: [0.7, 1, 1] }}
          transition={{ duration: 2.4, ease: EASE }}
        />
      </MotionDiv>

      <MotionDiv
        className="absolute h-[35vmin] w-[35vmin]"
        style={{
          left: `${launch.x}%`,
          top: `${launch.peakY}vh`,
          transform: 'translate(-50%, -50%)',
          color: launch.color,
        }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, ease: EASE, delay: 2.1 }}
      >
        <MotionSpan
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: `${launch.color}55` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0.6, 0.2, 0], scale: 1.1 }}
          transition={{ duration: 2.2, ease: EASE, delay: 2.1 }}
        />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.85)]" />
        {Array.from({ length: RAY_COUNT }).map((_, idx) => (
          <MotionSpan
            key={`${launch.id}-ray-${idx}`}
            className="absolute left-1/2 top-1/2 h-1 w-1/2 origin-left rounded-full"
            style={{ rotate: (360 / RAY_COUNT) * idx, backgroundColor: launch.color }}
            initial={{ scaleX: 0.2, opacity: 0 }}
            animate={{ scaleX: [0.2, 1.2, 1.4], opacity: [0.8, 0.6, 0] }}
            transition={{ duration: 2.2, ease: EASE, delay: 2.1 }}
          />
        ))}
      </MotionDiv>
    </div>
  );
};
