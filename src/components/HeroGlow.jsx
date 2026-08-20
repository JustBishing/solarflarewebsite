import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 1500;

const HeroGlow = () => {
  const canvasRef = useRef(null);
  const rafId = useRef(null);
  const particles = useRef([]);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let running = false;

    const init = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const beamCX = w * 0.78;
      const beamCY = h * 0.45;

      particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
        // Use gaussian-like distribution for natural scatter
        const randGauss = () => {
          let u = 0, v = 0;
          while (u === 0) u = Math.random();
          while (v === 0) v = Math.random();
          return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        };

        // Position along the beam axis with gaussian spread perpendicular
        const along = (Math.random() - 0.5) * 1.2;
        const perp = randGauss() * 0.18;

        const angle = -Math.PI / 4.5;
        const ax = along * w * 0.5;
        const ay = perp * h * 0.5;

        return {
          x: beamCX + ax * Math.cos(angle) - ay * Math.sin(angle),
          y: beamCY + ax * Math.sin(angle) + ay * Math.cos(angle),
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          size: Math.random() * 2.0 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002,
          drift: (Math.random() - 0.5) * 0.06,
        };
      });
    };

    const draw = () => {
      time.current += 1;
      ctx.clearRect(0, 0, w, h);

      const breathe = 1 + Math.sin(time.current * 0.006) * 0.04;
      const cx = w * 0.78;
      const cy = h * 0.45;
      const angle = -Math.PI / 4.5;

      // Diagonal beam glow
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const beamLen = w * 0.9 * breathe;
      const beamWidth = h * 0.5 * breathe;
      const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, beamLen * 0.5);
      g1.addColorStop(0, 'rgba(255, 145, 77, 0.30)');
      g1.addColorStop(0.25, 'rgba(255, 160, 100, 0.18)');
      g1.addColorStop(0.5, 'rgba(255, 145, 77, 0.08)');
      g1.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.fillStyle = g1;
      ctx.scale(1, beamWidth / beamLen);
      ctx.beginPath();
      ctx.arc(0, 0, beamLen * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Hot bright core
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const coreLen = w * 0.5 * breathe;
      const coreW = h * 0.12 * breathe;
      const g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, coreLen * 0.5);
      g2.addColorStop(0, 'rgba(255, 220, 190, 0.28)');
      g2.addColorStop(0.3, 'rgba(255, 178, 122, 0.15)');
      g2.addColorStop(0.7, 'rgba(255, 145, 77, 0.05)');
      g2.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.fillStyle = g2;
      ctx.scale(1, coreW / coreLen);
      ctx.beginPath();
      ctx.arc(0, 0, coreLen * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Particles
      const cosA = Math.cos(-angle);
      const sinA = Math.sin(-angle);

      for (const p of particles.current) {
        p.x += p.vx + p.drift * Math.sin(time.current * p.speed);
        p.y += p.vy + p.drift * Math.cos(time.current * p.speed);

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const dx = p.x - cx;
        const dy = p.y - cy;
        const rx = dx * cosA - dy * sinA;
        const ry = dx * sinA + dy * cosA;
        const normDist = Math.sqrt(
          (rx / (w * 0.45)) ** 2 + (ry / (h * 0.18)) ** 2
        );
        const inBeam = Math.max(0, 1 - normDist);

        const flicker =
          0.55 + Math.sin(time.current * p.speed * 4 + p.phase) * 0.45;
        const alpha = (0.05 + inBeam * inBeam * 0.95) * flicker;

        if (alpha < 0.015) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 190, 140, ${alpha})`;
        ctx.fill();
      }

      rafId.current = running ? requestAnimationFrame(draw) : null;
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId.current = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };

    /** One frame, no follow-up — the still image for reduced-motion users. */
    const drawStill = () => {
      stop();
      draw();
    };

    // This was an unconditional 1500-particle rAF loop: it ignored
    // prefers-reduced-motion entirely (while Fireworks honoured it), and it
    // kept running when scrolled past or when the tab was hidden.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let onScreen = true;

    const sync = () => {
      if (reduceMotion.matches) {
        stop();
        drawStill();
        return;
      }
      if (onScreen && !document.hidden) start();
      else stop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );

    const onResize = () => {
      init();
      if (reduceMotion.matches) drawStill();
    };

    init();
    observer.observe(canvas);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener('change', sync);
    sync();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', sync);
      reduceMotion.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    />
  );
};

export default HeroGlow;
