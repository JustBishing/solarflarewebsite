import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 150;

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

      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.003,
      }));
    };

    const draw = () => {
      time.current += 1;
      ctx.clearRect(0, 0, w, h);

      // Animated diagonal glow band that drifts slowly
      const cx = w * 0.65 + Math.sin(time.current * 0.004) * w * 0.08;
      const cy = h * 0.35 + Math.cos(time.current * 0.003) * h * 0.08;

      // Outer warm glow
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.55);
      g1.addColorStop(0, 'rgba(255, 145, 77, 0.16)');
      g1.addColorStop(0.35, 'rgba(255, 178, 122, 0.07)');
      g1.addColorStop(0.7, 'rgba(255, 145, 77, 0.02)');
      g1.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Bright core
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.18);
      g2.addColorStop(0, 'rgba(255, 210, 170, 0.14)');
      g2.addColorStop(1, 'rgba(255, 178, 122, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Secondary glow — opposite drift
      const cx2 = w * 0.3 + Math.cos(time.current * 0.005) * w * 0.06;
      const cy2 = h * 0.65 + Math.sin(time.current * 0.004) * h * 0.06;
      const g3 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, w * 0.35);
      g3.addColorStop(0, 'rgba(220, 38, 38, 0.08)');
      g3.addColorStop(0.5, 'rgba(255, 145, 77, 0.03)');
      g3.addColorStop(1, 'rgba(255, 145, 77, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      // Dust particles
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Distance to main glow center — particles brighten inside it
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = w * 0.55;
        const proximity = Math.max(0, 1 - dist / maxDist);

        const flicker = 0.7 + Math.sin(time.current * p.speed * 3 + p.phase) * 0.3;
        const alpha = (0.06 + proximity * 0.55) * flicker;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 178, 122, ${alpha})`;
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
