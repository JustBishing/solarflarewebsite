import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 400;

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

      // Distribute particles along the diagonal band
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
        // Random position biased toward the diagonal band
        // Band runs from upper-right to lower-left
        const t = Math.random();
        const spread = (Math.random() - 0.5) * 0.6;
        const bx = (1 - t) + spread * 0.5;
        const by = t + spread * 0.5;

        return {
          x: bx * w,
          y: by * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.4 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002,
          drift: (Math.random() - 0.5) * 0.08,
        };
      });
    };

    const draw = () => {
      time.current += 1;
      ctx.clearRect(0, 0, w, h);

      // Diagonal beam — drawn as a rotated elongated gradient
      ctx.save();
      ctx.translate(w * 0.6, h * 0.3);
      ctx.rotate(-Math.PI / 4.5);

      // Slow breathing
      const breathe = 1 + Math.sin(time.current * 0.008) * 0.06;

      // Outer beam glow
      const beamW = w * 0.9 * breathe;
      const beamH = h * 0.45 * breathe;
      const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, beamW * 0.5);
      g1.addColorStop(0, 'rgba(255, 145, 77, 0.20)');
      g1.addColorStop(0.25, 'rgba(255, 160, 100, 0.12)');
      g1.addColorStop(0.5, 'rgba(255, 145, 77, 0.05)');
      g1.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.fillStyle = g1;
      ctx.scale(1, beamH / beamW);
      ctx.beginPath();
      ctx.arc(0, 0, beamW * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Hot core — brighter, tighter
      ctx.save();
      ctx.translate(w * 0.62, h * 0.28);
      ctx.rotate(-Math.PI / 4.5);
      const coreW = w * 0.4 * breathe;
      const coreH = h * 0.15 * breathe;
      const g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, coreW * 0.5);
      g2.addColorStop(0, 'rgba(255, 210, 175, 0.18)');
      g2.addColorStop(0.4, 'rgba(255, 178, 122, 0.08)');
      g2.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.fillStyle = g2;
      ctx.scale(1, coreH / coreW);
      ctx.beginPath();
      ctx.arc(0, 0, coreW * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Secondary warm glow — lower left
      ctx.save();
      ctx.translate(w * 0.25, h * 0.7);
      const g3 = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.22);
      g3.addColorStop(0, 'rgba(255, 145, 77, 0.08)');
      g3.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, w * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dust particles
      const beamCX = w * 0.6;
      const beamCY = h * 0.3;
      const angle = -Math.PI / 4.5;
      const cosA = Math.cos(-angle);
      const sinA = Math.sin(-angle);

      for (const p of particles.current) {
        p.x += p.vx + p.drift * Math.sin(time.current * p.speed);
        p.y += p.vy + p.drift * Math.cos(time.current * p.speed);

        // Wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Distance from beam center (in rotated space)
        const dx = p.x - beamCX;
        const dy = p.y - beamCY;
        const rx = dx * cosA - dy * sinA;
        const ry = dx * sinA + dy * cosA;
        const normDist = Math.sqrt(
          (rx / (w * 0.45)) ** 2 + (ry / (h * 0.22)) ** 2
        );
        const inBeam = Math.max(0, 1 - normDist);

        const flicker =
          0.65 + Math.sin(time.current * p.speed * 4 + p.phase) * 0.35;
        const alpha = (0.03 + inBeam * 0.7) * flicker;

        if (alpha < 0.02) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 190, 140, ${alpha})`;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    };

    init();
    window.addEventListener('resize', init);
    rafId.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', init);
      if (rafId.current) cancelAnimationFrame(rafId.current);
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
