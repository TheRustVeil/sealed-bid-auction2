import { useEffect, useRef } from 'react';

const SIG_COLORS = [
  [139, 92, 246],  // violet   ×3
  [139, 92, 246],
  [139, 92, 246],
  [34, 211, 238],  // cyan     ×2
  [34, 211, 238],
  [16, 185, 129],  // emerald
  [220, 220, 255], // white-blue (rare burst)
];

function lerp(a, b, t) { return a + (b - a) * t; }

export function CircuitCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0;
    let nodes = [], edges = [], adj = [], signals = [], raf;

    function build() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;

      const COLS = Math.max(5, Math.floor(W / 105));
      const ROWS = Math.max(4, Math.floor(H / 88));

      nodes = []; edges = []; adj = []; signals = [];

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const id = nodes.length;
          nodes.push({ id, x: (c / COLS) * (W - 64) + 32, y: (r / ROWS) * (H - 64) + 32, pulse: 0 });
          adj.push([]);
        }
      }

      const idx = (r, c) => r * (COLS + 1) + c;

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (Math.random() < 0.78) {
            const [a, b] = [idx(r, c), idx(r, c + 1)];
            edges.push([a, b]); adj[a].push(b); adj[b].push(a);
          }
        }
      }
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          if (Math.random() < 0.73) {
            const [a, b] = [idx(r, c), idx(r + 1, c)];
            edges.push([a, b]); adj[a].push(b); adj[b].push(a);
          }
        }
      }

      for (let i = 0; i < 16; i++) spawn();
    }

    function spawn(fromId) {
      const from = fromId ?? Math.floor(Math.random() * nodes.length);
      const conns = adj[from];
      if (!conns || conns.length === 0) return;
      const to    = conns[Math.floor(Math.random() * conns.length)];
      const color = SIG_COLORS[Math.floor(Math.random() * SIG_COLORS.length)];
      signals.push({ from, to, progress: 0, speed: 0.006 + Math.random() * 0.009, color, trail: [] });
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);

      // Static circuit traces
      ctx.lineWidth = 0.8;
      for (const [a, b] of edges) {
        const na = nodes[a], nb = nodes[b];
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = 'rgba(99,102,241,0.11)';
        ctx.stroke();
      }

      // Junction nodes
      for (const n of nodes) {
        if (n.pulse > 0.005) n.pulse *= 0.87;
        const alpha = 0.10 + n.pulse * 0.80;
        const r     = 2.5 + n.pulse * 5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${alpha})`;
        ctx.fill();
        if (n.pulse > 0.12) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 6 + n.pulse * 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139,92,246,${n.pulse * 0.30})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      const done = [];
      for (let i = 0; i < signals.length; i++) {
        const s = signals[i];
        s.progress = Math.min(1, s.progress + s.speed);

        const na = nodes[s.from], nb = nodes[s.to];
        const x  = lerp(na.x, nb.x, s.progress);
        const y  = lerp(na.y, nb.y, s.progress);

        s.trail.push({ x, y });
        if (s.trail.length > 11) s.trail.shift();

        const [r, g, b] = s.color;

        // Lit-up trace segment behind the signal
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.20)`;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Trail glow
        for (let j = 1; j < s.trail.length; j++) {
          const a = (j / s.trail.length) * 0.6;
          const w = (j / s.trail.length) * 2.8;
          ctx.beginPath();
          ctx.moveTo(s.trail[j - 1].x, s.trail[j - 1].y);
          ctx.lineTo(s.trail[j].x,     s.trail[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth   = w;
          ctx.stroke();
        }

        // Signal head with bloom
        ctx.save();
        ctx.shadowColor = `rgba(${r},${g},${b},1)`;
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        ctx.fill();
        ctx.restore();

        if (s.progress >= 1) {
          nodes[s.to].pulse = 1;
          spawn(s.to);
          if (Math.random() < 0.32) spawn(s.to); // occasional branch
          done.push(i);
        }
      }

      for (let i = done.length - 1; i >= 0; i--) signals.splice(done[i], 1);

      if (signals.length < 12) spawn();
      if (signals.length > 50) signals.splice(0, 12);

      raf = requestAnimationFrame(frame);
    }

    build();
    window.addEventListener('resize', build);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  );
}
