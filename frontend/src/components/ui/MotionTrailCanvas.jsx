import { useEffect, useRef } from 'react';

const HEX = '0123456789ABCDEF';
const ALL_PAIRS = Array.from({ length: 256 }, (_, i) => HEX[i >> 4] + HEX[i & 15]);
const SPECIAL   = ['FH', 'EV', 'ZK', 'TF', 'HE', '0x', 'EN', 'CR', 'PT'];

function rndChar() {
  return Math.random() < 0.05
    ? SPECIAL[Math.floor(Math.random() * SPECIAL.length)]
    : ALL_PAIRS[Math.floor(Math.random() * 256)];
}

const VIOLET = [124, 58, 237];
const CYAN   = [6, 182, 212];

const COL_W = 26;   // px between columns
const FS    = 13;   // font size

export function MotionTrailCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let cols = [];
    let W = 0, H = 0;

    function buildCols() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const n = Math.floor(W / COL_W);
      cols = Array.from({ length: n }, (_, i) => {
        const trailLen = 8 + Math.floor(Math.random() * 14);
        return {
          x:        i * COL_W + COL_W / 2,
          headY:    -Math.random() * H * 1.8,
          speed:    FS * (0.28 + Math.random() * 0.85),
          trailLen,
          chars:    Array.from({ length: trailLen }, rndChar),
          color:    Math.random() < 0.62 ? VIOLET : CYAN,
          bright:   0.35 + Math.random() * 0.55,
          ticker:   0,
          tickRate: 3 + Math.floor(Math.random() * 5),
          phase:    'fall',
          cooldown: 0,
        };
      });
    }

    buildCols();
    window.addEventListener('resize', buildCols);

    let raf;

    function frame() {
      // Fade previous frame to create the trail effect
      ctx.fillStyle = 'rgba(5, 5, 17, 0.18)';
      ctx.fillRect(0, 0, W, H);

      ctx.font      = `${FS}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';

      for (const col of cols) {
        if (col.phase === 'cool') {
          if (--col.cooldown <= 0) {
            col.phase    = 'fall';
            col.headY    = -FS * (col.trailLen + 3);
            col.chars    = Array.from({ length: col.trailLen }, rndChar);
            col.speed    = FS * (0.28 + Math.random() * 0.85);
            col.color    = Math.random() < 0.62 ? VIOLET : CYAN;
            col.bright   = 0.35 + Math.random() * 0.55;
            col.trailLen = 8 + Math.floor(Math.random() * 14);
          }
          continue;
        }

        col.headY += col.speed;

        // Randomly mutate trail characters (feels like data decrypting)
        if (++col.ticker >= col.tickRate) {
          col.ticker = 0;
          col.chars[1 + Math.floor(Math.random() * (col.trailLen - 1))] = rndChar();
        }

        const [r, g, b] = col.color;

        // Draw from tail → head so head paints over
        for (let j = col.trailLen - 1; j >= 0; j--) {
          const cy = col.headY - j * FS;
          if (cy < -FS || cy > H + FS) continue;

          if (j === 0) {
            // Head: bright white with neon glow
            ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
            ctx.shadowBlur  = 14;
            ctx.fillStyle   = 'rgba(255,255,255,0.90)';
          } else {
            ctx.shadowBlur  = 0;
            const alpha = (1 - j / col.trailLen) * col.bright;
            ctx.fillStyle   = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          }

          ctx.fillText(col.chars[j], col.x, cy);
        }

        // Off screen → enter cooldown
        if (col.headY - col.trailLen * FS > H) {
          col.phase    = 'cool';
          col.cooldown = 15 + Math.floor(Math.random() * 55);
        }
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', buildCols);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.45,
      }}
    />
  );
}
