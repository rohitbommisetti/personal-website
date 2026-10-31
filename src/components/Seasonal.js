import React, { useEffect, useRef } from 'react';
import { newYear } from '../lib/seasons';
import styles from './Site.module.css';

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const FESTIVE = ['#e0453a', '#f2c14e', '#3fa34d', '#3b7dd8', '#d16ba5'];

const hexToRgba = (hex, alpha) => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// Each scene keeps its own state; update() advances it, draw() paints one frame.
const christmas = () => {
  let flakes = [];
  return {
    resize(w, h) {
      if (flakes.length) return;
      flakes = Array.from({ length: 70 }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1, 2.6),
        speed: rand(12, 30),
        phase: rand(0, Math.PI * 2),
      }));
    },
    update(dt, w, h) {
      flakes.forEach((f) => {
        f.y += f.speed * dt;
        if (f.y > h + 4) {
          f.y = -4;
          f.x = rand(0, w);
        }
      });
    },
    draw(ctx, { w, h, t, muted, dark }) {
      const snow = dark ? '#e9edf0' : '#a9b6c2';

      // String of lights hanging across the top.
      const sag = 18;
      const wireY = (x) => 6 + sag * (1 - Math.pow((x / w) * 2 - 1, 2));
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) (x ? ctx.lineTo : ctx.moveTo).call(ctx, x, wireY(x));
      ctx.stroke();
      const colors = ['#e0453a', '#3fa34d', '#f2c14e', '#3b7dd8'];
      for (let i = 0, x = 18; x < w; i++, x += 36) {
        const glow = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.6 + i * 1.7));
        const y = wireY(x) + 6;
        ctx.save();
        ctx.shadowColor = colors[i % 4];
        ctx.shadowBlur = 10 * glow;
        ctx.fillStyle = hexToRgba(colors[i % 4], 0.35 + 0.65 * glow);
        ctx.beginPath();
        ctx.ellipse(x, y, 3.2, 4.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Trees on the right, sitting in snow.
      [
        [0.86, 62],
        [0.93, 44],
      ].forEach(([fx, size]) => {
        const x = w * fx;
        ctx.fillStyle = dark ? '#3f7a4c' : '#4f8a5a';
        for (let k = 0; k < 3; k++) {
          const top = h - 8 - size + k * size * 0.28;
          const half = size * (0.28 + k * 0.1);
          ctx.beginPath();
          ctx.moveTo(x, top);
          ctx.lineTo(x - half, top + size * 0.42);
          ctx.lineTo(x + half, top + size * 0.42);
          ctx.fill();
        }
        ctx.fillStyle = '#f2c14e';
        ctx.beginPath();
        ctx.arc(x, h - 8 - size, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = hexToRgba(snow, 0.55);
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 20) ctx.lineTo(x, h - 6 - 3 * Math.sin(x / 60));
      ctx.lineTo(w, h);
      ctx.fill();

      ctx.fillStyle = snow;
      flakes.forEach((f) => {
        ctx.beginPath();
        ctx.arc(f.x + Math.sin(t + f.phase) * 6, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  };
};

const fireworks = () => {
  const rockets = [];
  const sparks = [];
  let until = 0;
  const launch = (w, h) => {
    rockets.push({ x: rand(w * 0.1, w * 0.9), y: h, vy: rand(-170, -130), top: rand(20, h * 0.45), color: pick(FESTIVE) });
  };
  return {
    trails: true,
    resize() {},
    update(dt, w, h) {
      until -= dt;
      if (until <= 0) {
        launch(w, h);
        until = rand(0.5, 1.2);
      }
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        if (r.y <= r.top) {
          rockets.splice(i, 1);
          const count = Math.round(rand(40, 60));
          for (let k = 0; k < count; k++) {
            const angle = (k / count) * Math.PI * 2 + rand(-0.1, 0.1);
            const speed = rand(45, 110);
            sparks.push({ x: r.x, y: r.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: rand(1.3, 2.1), age: 0, color: r.color });
          }
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + 60 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.age >= s.life) sparks.splice(i, 1);
      }
    },
    draw(ctx, { w, h, muted }) {
      ctx.save();
      ctx.font = '700 72px system-ui, Avenir, Helvetica, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Redrawn every frame under a fading layer, so a low alpha settles at a faint tint.
      ctx.fillStyle = hexToRgba(muted.startsWith('#') ? muted : '#888888', 0.035);
      ctx.fillText(String(newYear(new Date())), w / 2, h / 2 + 6);
      ctx.restore();
      rockets.forEach((r) => {
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x - 1.5, r.y, 3, 8);
      });
      sparks.forEach((s) => {
        ctx.fillStyle = hexToRgba(s.color, Math.max(0, 1 - s.age / s.life));
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  };
};

const SCENES = { christmas, newyear: fireworks };

const Seasonal = ({ season }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const makeScene = SCENES[season];
    const supported = window.matchMedia && window.ResizeObserver && window.IntersectionObserver;
    if (!canvas || !makeScene || !supported) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const scene = makeScene();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const env = { w: 0, h: 0, t: 0 };
    let raf = 0;
    let visible = true;
    let last = 0;

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      env.ink = styles.getPropertyValue('--ink').trim() || '#2b3328';
      env.muted = styles.getPropertyValue('--muted').trim() || '#5f6a59';
      env.bg = styles.getPropertyValue('--bg').trim() || '#faf8f0';
      env.dark = document.documentElement.dataset.theme === 'dark';
    };

    const paint = (dt) => {
      scene.update(dt, env.w, env.h);
      if (scene.trails) {
        ctx.fillStyle = hexToRgba(env.bg, 0.2);
        ctx.fillRect(0, 0, env.w, env.h);
      } else {
        ctx.clearRect(0, 0, env.w, env.h);
      }
      scene.draw(ctx, env);
    };

    // With reduced motion, simulate a couple of seconds and leave a still frame.
    const still = () => {
      ctx.clearRect(0, 0, env.w, env.h);
      for (let i = 0; i < 150; i++) {
        env.t += 1 / 60;
        paint(1 / 60);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      env.w = canvas.clientWidth;
      env.h = canvas.clientHeight;
      canvas.width = Math.round(env.w * dpr);
      canvas.height = Math.round(env.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.resize(env.w, env.h);
      if (reduceMotion) still();
    };

    const loop = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      env.t += dt;
      paint(dt);
      if (visible) raf = requestAnimationFrame(loop);
    };

    readColors();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Repaint with new colors when the theme changes.
    const themeObserver = new MutationObserver(() => {
      readColors();
      if (reduceMotion) still();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Only animate while the footer is on screen.
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduceMotion) {
        last = 0;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    });
    viewObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [season]);

  return (
    <div className={styles.seasonal} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Seasonal;
