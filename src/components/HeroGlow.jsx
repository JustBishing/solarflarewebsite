import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 800;

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

      particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
        // Concentrate along the diagonal band (upper-right to lower-left)
        const t = Math.random();
        const spread = (Math.random() - 0.5);
        // Tighter spread = denser band, wider = scattered dust
        const bandTightness = Math.random() < 0.7 ? 0.35 : 0.8;
        const bx = (1 - t) + spread * bandTightness * 0.5;
        const by = t + spread * bandTightness * 0.5;

        return {
          x: bx * w,
          y: by * h,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          size: Math.random() * 1.2 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002,
          drift: (Math.random() - 0.5) * 0.05,
        };
      });
    };

    const draw = () => {
      time.current += 1;
      ctx.clearRect(0, 0, w, h);

      const breathe = 1 + Math.sin(time.current * 0.008) * 0.04;

      // Subtle diagonal glow — very soft, not a visible circle
      ctx.save();
      const cx = w * 0.6;
      const cy = h * 0.3;
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 4.5);
      const beamLen = w * 0.8 * breathe;
      const beamWidth = h * 0.3 * breathe;
      const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, beamLen * 0.5);
      g1.addColorStop(0, 'rgba(255, 145, 77, 0.07)');
      g1.addColorStop(0.4, 'rgba(255, 160, 100, 0.03)');
      g1.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.fillStyle = g1;
      ctx.scale(1, beamWidth / beamLen);
      ctx.beginPath();
      ctx.arc(0, 0, beamLen * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dust particles
      const angle = -Math.PI / 4.5;
      const cosA = Math.cos(-angle);
      const sinA = Math.sin(-angle);

      for (const p of particles.current) {
        p.x += p.vx + p.drift * Math.sin(time.current * p.speed);
        p.y += p.vy + p.drift * Math.cos(time.current * p.speed);

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Distance from beam center in rotated space
        const dx = p.x - cx;
        const dy = p.y - cy;
        const rx = dx * cosA - dy * sinA;
        const ry = dx * sinA + dy * cosA;
        const normDist = Math.sqrt(
          (rx / (w * 0.4)) ** 2 + (ry / (h * 0.15)) ** 2
        );
        const inBeam = Math.max(0, 1 - normDist);

        const flicker =
          0.6 + Math.sin(time.current * p.speed * 4 + p.phase) * 0.4;
        const alpha = (0.04 + inBeam * 0.8) * flicker;

        if (alpha < 0.015) continue;

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
