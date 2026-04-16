import { useEffect, useRef, useCallback } from 'react';

const PARTICLE_COUNT = 120;
const GLOW_RADIUS = 280;

const HeroGlow = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -500, y: -500 });
  const targetMouse = useRef({ x: -500, y: -500 });
  const particles = useRef([]);
  const rafId = useRef(null);

  const initParticles = useCallback((w, h) => {
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.current.length === 0) initParticles(w, h);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.current.x = e.clientX - rect.left;
      targetMouse.current.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      targetMouse.current.x = -500;
      targetMouse.current.y = -500;
    };

    const draw = () => {
      // Smooth mouse follow
      mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.08;
      mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const onScreen = mx > -400 && my > -400;

      // Main glow
      if (onScreen) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, GLOW_RADIUS);
        grad.addColorStop(0, 'rgba(255, 145, 77, 0.18)');
        grad.addColorStop(0.3, 'rgba(255, 178, 122, 0.10)');
        grad.addColorStop(0.7, 'rgba(255, 145, 77, 0.04)');
        grad.addColorStop(1, 'rgba(255, 145, 77, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Inner bright core
        const core = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        core.addColorStop(0, 'rgba(255, 210, 170, 0.22)');
        core.addColorStop(1, 'rgba(255, 178, 122, 0)');
        ctx.fillStyle = core;
        ctx.fillRect(0, 0, w, h);
      }

      // Particles
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Brighten near cursor
        let alpha = p.baseAlpha * 0.15;
        if (onScreen) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < GLOW_RADIUS) {
            const proximity = 1 - dist / GLOW_RADIUS;
            alpha = p.baseAlpha * (0.15 + proximity * 0.85);

            // Gentle push away from cursor
            const pushStrength = proximity * 0.15;
            p.vx += (dx / dist) * pushStrength;
            p.vy += (dy / dist) * pushStrength;
          }
        }

        // Dampen velocity
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Flicker
        const flicker = 0.85 + Math.sin(Date.now() * 0.003 + p.x) * 0.15;
        const finalAlpha = alpha * flicker;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 178, 122, ${finalAlpha})`;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    rafId.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 -z-10"
      aria-hidden="true"
    />
  );
};

export default HeroGlow;
