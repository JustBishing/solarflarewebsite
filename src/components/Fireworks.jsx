import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useShouldReduceMotion } from '../lib/motion.js';

const FIREWORK_COLORS = ['#EA5020', '#F89221', '#FFB15C'];
const RAY_COUNT = 8;
const EASE = [0.22, 1, 0.36, 1];

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const createFirework = () => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  x: 15 + Math.random() * 70,
  y: 18 + Math.random() * 60,
  color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
});

const Fireworks = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const [fireworks, setFireworks] = useState([]);
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

        const nextFirework = createFirework();
        setFireworks((current) => [...current, nextFirework]);

        const removalTimeout = window.setTimeout(() => {
          setFireworks((current) =>
            current.filter((firework) => firework.id !== nextFirework.id),
          );
          cleanupTimersRef.current = cleanupTimersRef.current.filter(
            (timerId) => timerId !== removalTimeout,
          );
        }, 1600);

        cleanupTimersRef.current.push(removalTimeout);
        scheduleNext(3600 + Math.random() * 2400);
      }, delay);
    };

    scheduleNext(1500 + Math.random() * 1500);

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
      {fireworks.map((firework) => (
        <MotionDiv
          key={firework.id}
          className="absolute h-28 w-28"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            transform: 'translate(-50%, -50%)',
            color: firework.color,
          }}
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <MotionSpan
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: firework.color }}
            initial={{ opacity: 0.8, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          {Array.from({ length: RAY_COUNT }).map((_, index) => (
            <MotionSpan
              key={`${firework.id}-ray-${index}`}
              className="absolute left-1/2 top-1/2 h-0.5 w-10 origin-left rounded-full"
              style={{ rotate: (360 / RAY_COUNT) * index, backgroundColor: firework.color }}
              initial={{ scaleX: 0, opacity: 0.9 }}
              animate={{ scaleX: 1.1, opacity: 0 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
          ))}
        </MotionDiv>
      ))}
    </div>
  );
};

export default Fireworks;
