import { useEffect, useRef } from 'react';
import { RESERVE, dayDate, project, realistic } from '../data';

// A glowing "terrain" of ridge lines. Far ridges are rolling hills; the
// nearest ridge is the real 30-day cash forecast of the sample business,
// with the stretch below the safety reserve drawn in red.

const ROWS = 42;
const PTS = 150;
const BG = '#040806';

export function CashTerrain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const values = project(realistic);
    const lo = Math.min(...values, RESERVE);
    const hi = Math.max(...values);
    const norm = values.map((v) => (v - lo) / (hi - lo));
    const reserveN = (RESERVE - lo) / (hi - lo);
    const breachDay = values.findIndex((v) => v < RESERVE);
    const breachLabel = `${dayDate(breachDay).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · below reserve`;
    const cash = (x: number) => {
      const f = x * (norm.length - 1);
      const i = Math.min(norm.length - 2, Math.floor(f));
      const k = f - i;
      const s = k * k * (3 - 2 * k); // smooth step between days
      return norm[i] * (1 - s) + norm[i + 1] * s;
    };

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random() * 0.55, r: Math.random() * 1.2 + 0.3, p: Math.random() * Math.PI * 2,
    }));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, raf = 0, visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        const a = 0.25 + 0.35 * Math.sin(t * 0.8 + s.p);
        ctx.fillStyle = `rgba(190,255,220,${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
      }

      const mobile = W < 760;
      const horizon = H * (mobile ? 0.6 : 0.46);
      const ground = H * (mobile ? 0.96 : 0.94);
      let front: { x: number; y: number }[] = [];

      for (let r = 0; r < ROWS; r++) {
        const d = r / (ROWS - 1); // 0 far, 1 near
        const yBase = horizon + (ground - horizon) * Math.pow(d, 1.5);
        const spread = 0.62 + 0.34 * d;
        const amp = H * (mobile ? 0.1 : 0.2) * (0.35 + 0.65 * d);
        const mix = Math.pow(d, 3);
        const pts: { x: number; y: number }[] = [];
        for (let i = 0; i < PTS; i++) {
          const u = i / (PTS - 1);
          const hills = 0.45
            + 0.22 * Math.sin(u * 6.2 + t * 0.55 + r * 0.42)
            + 0.13 * Math.sin(u * 13.5 - t * 0.8 + r * 0.9)
            + 0.08 * Math.sin(u * 2.1 + r * 0.17 + t * 0.25);
          const edge = 0.55 + 0.45 * Math.pow(Math.abs(u - 0.5) * 2, 2.2); // edges rise, like a valley
          const v = (hills * edge) * (1 - mix) + cash(u) * mix;
          pts.push({ x: W / 2 + (u - 0.5) * W * spread, y: yBase - v * amp });
        }
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < PTS; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[PTS - 1].x, H + 2);
        ctx.lineTo(pts[0].x, H + 2);
        ctx.closePath();
        ctx.fillStyle = BG;
        ctx.fill();

        const g = ctx.createLinearGradient(0, 0, W, 0);
        const a = 0.12 + 0.7 * d;
        g.addColorStop(0, 'rgba(46,229,157,0)');
        g.addColorStop(0.18, `rgba(46,229,157,${a.toFixed(3)})`);
        g.addColorStop(0.82, `rgba(150,240,110,${a.toFixed(3)})`);
        g.addColorStop(1, 'rgba(150,240,110,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.7 + d * 1.1;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < PTS; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        if (r === ROWS - 1) front = pts;
      }

      // The nearest ridge is the forecast: glow it, and draw the shortfall red.
      const amp = H * (mobile ? 0.1 : 0.2);
      const reserveY = ground - reserveN * amp;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(46,229,157,.9)';
      ctx.strokeStyle = 'rgba(120,255,190,.95)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      front.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      ctx.shadowColor = 'rgba(255,80,80,.95)';
      ctx.strokeStyle = '#ff5d5d';
      ctx.lineWidth = 2.8;
      let on = false;
      ctx.beginPath();
      for (const p of front) {
        if (p.y > reserveY) { if (!on) { ctx.moveTo(p.x, p.y); on = true; } else ctx.lineTo(p.x, p.y); }
        else if (on) { ctx.lineTo(p.x, p.y); on = false; }
      }
      ctx.stroke();
      ctx.restore();

      // reserve line
      ctx.save();
      ctx.setLineDash([5, 7]);
      ctx.strokeStyle = 'rgba(255,93,93,.45)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(front[0].x, reserveY); ctx.lineTo(front[PTS - 1].x, reserveY); ctx.stroke();
      ctx.restore();

      // breach marker
      const bIdx = front.findIndex((p) => p.y > reserveY);
      if (bIdx > 0) {
        const p = front[bIdx];
        const pulse = (t * 0.9) % 1;
        ctx.fillStyle = `rgba(255,93,93,${(0.45 * (1 - pulse)).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6 + pulse * 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff5d5d';
        ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '600 12px "Plus Jakarta Sans", system-ui, sans-serif';
        const tw = ctx.measureText(breachLabel).width;
        const lx = Math.min(p.x + 12, W - tw - 24);
        const ly = p.y + 30;
        ctx.fillStyle = 'rgba(20,6,6,.82)';
        ctx.strokeStyle = 'rgba(255,93,93,.55)';
        ctx.beginPath(); ctx.roundRect(lx, ly - 15, tw + 16, 24, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffb4b4';
        ctx.fillText(breachLabel, lx + 8, ly + 1);
      }

      // scanning light travelling along the forecast
      if (!reduce) {
        const k = Math.floor(((t * 0.12) % 1) * (PTS - 1));
        const s = front[k];
        const rg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 26);
        rg.addColorStop(0, 'rgba(220,255,235,.95)');
        rg.addColorStop(1, 'rgba(46,229,157,0)');
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(s.x, s.y, 26, 0, Math.PI * 2); ctx.fill();
      }
    };

    const loop = (now: number) => {
      draw((now - start) / 1000);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const restart = () => {
      cancelAnimationFrame(raf);
      if (reduce) draw(2);
      else if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    resize();
    restart();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(2); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); });
    io.observe(canvas);
    document.addEventListener('visibilitychange', restart);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', restart);
    };
  }, []);

  return <canvas ref={ref} className="lx-terrain" aria-hidden="true" />;
}
