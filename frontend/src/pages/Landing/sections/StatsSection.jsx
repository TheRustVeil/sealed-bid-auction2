import { useCountUp } from '../../../hooks/useCountUp';

const STATS = [
  { target: 12847, suffix: '+', label: 'Recipients Settled', sub: 'across all auctions', decimals: 0 },
  { target: 4.2,   prefix: '$', suffix: 'M', label: 'Total Volume', sub: 'USDC distributed', decimals: 1 },
  { target: 127,   suffix: '',  label: 'Auctions Completed', sub: 'and counting', decimals: 0 },
  { target: 0,     suffix: '',  label: 'Bids Ever Exposed', sub: 'zero knowledge guarantee', decimals: 0 },
];

function Counter({ target, prefix = '', suffix = '', label, sub, decimals }) {
  const [ref, value] = useCountUp(target, { decimals });

  const display = target === 0
    ? 'Zero'
    : `${prefix}${decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()}${suffix}`;

  return (
    <div ref={ref} className="text-center px-6">
      <div className="text-5xl sm:text-6xl font-black mb-2 tabular-nums text-white">
        {display}
      </div>
      <div className="text-white font-semibold text-sm mb-1">{label}</div>
      <div className="text-white/30 text-xs">{sub}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative z-10 py-20 px-6">
      {/* Full-width gradient band */}
      <div
        className="max-w-6xl mx-auto rounded-3xl py-14 px-6 relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* bg orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
        />

        <div className="mb-12 relative z-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40 mb-4">[ 03 ] By the numbers</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black uppercase tracking-[-0.02em] leading-[0.95] text-white">Protocol at a glance</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {STATS.map((s) => (
            <Counter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
