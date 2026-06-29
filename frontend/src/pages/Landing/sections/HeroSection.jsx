import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Raven3D = lazy(() => import('../../../components/ui/Raven3D'));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const ArrowRight = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const BIDS = [
  { addr: '0x1a2b…9f0e' },
  { addr: '0x3c4d…1a2b' },
  { addr: '0x5e6f…3c4d' },
  { addr: '0x7g8h…5e6f' },
];

const SETTLED = [
  { addr: '0x1a2b…9f0e', amount: '150 USDC' },
  { addr: '0x3c4d…1a2b', amount: '200 USDC' },
  { addr: '0x5e6f…3c4d', amount: '175 USDC' },
  { addr: '0x7g8h…5e6f', amount: '125 USDC' },
];

/* Cycles through: collecting → settling → complete → reset */
function AuctionTerminal() {
  const [phase, setPhase] = useState(0); // 0=collecting, 1=settling, 2=complete

  useEffect(() => {
    const delays = [2800, 1200, 2500];
    const timer = setTimeout(() => setPhase((p) => (p + 1) % 3), delays[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-panel/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/60">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="ml-3 text-white/25 text-xs font-mono">confidential-drop — settlement</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-white/40 text-[10px] font-mono">live</span>
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-4 font-mono text-xs space-y-2 min-h-[220px]">
        <div className="text-white/30">
          {'> '}<span className="text-white/60">Contract:</span>{' '}
          <span className="text-white/80">0x3C4D…DISPERSE</span>
        </div>
        <div className="text-white/30">
          {'> '}<span className="text-white/60">Token:</span>{' '}
          <span className="text-white/80">0x705F…USDC</span>
        </div>
        <div className="mt-3 text-white/15">─────────────────────────────</div>

        {phase === 0 && (
          <div className="space-y-2">
            <div className="text-white/60 flex items-center gap-2">
              <span className="animate-pulse text-accent">◉</span> Collecting encrypted bids…
            </div>
            {BIDS.map((b, i) => (
              <div key={b.addr} className="flex items-center justify-between gap-4 opacity-0"
                style={{ animation: `fadeIn 0.4s ease ${i * 0.15}s forwards` }}>
                <span className="text-white/70">{b.addr}</span>
                <span className="text-white/30 bg-white/5 rounded px-2 py-0.5 border border-white/8">
                  [ENCRYPTED]
                </span>
              </div>
            ))}
          </div>
        )}

        {phase === 1 && (
          <div className="space-y-3">
            <div className="text-white/70 flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 border-2 border-accent border-t-transparent rounded-full"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
              TFHE co-processor decrypting…
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full"
                style={{ animation: 'progressBar 1.1s ease-in forwards' }}
              />
            </div>
            <div className="text-white/25 text-[10px]">Verifying FHE proof on-chain…</div>
          </div>
        )}

        {phase === 2 && (
          <div className="space-y-2">
            <div className="text-white flex items-center gap-2 font-semibold">
              <CheckIcon /> Settlement complete
            </div>
            {SETTLED.map((b, i) => (
              <div key={b.addr} className="flex items-center justify-between gap-4 opacity-0"
                style={{ animation: `fadeIn 0.35s ease ${i * 0.12}s forwards` }}>
                <span className="text-white/70">{b.addr}</span>
                <span className="text-white/50">→ <span className="text-white font-semibold">{b.amount}</span></span>
                <CheckIcon />
              </div>
            ))}
            <div className="mt-2 text-white/20 text-[10px]">Proof pinned: 0xfe12…8a3b</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 pt-32 pb-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full relative">
        {/* 3D low-poly raven — hero centerpiece */}
        <div className="hidden md:block absolute right-[-6%] top-[44%] -translate-y-1/2 w-[58%] h-[150%] z-0">
          <Suspense fallback={null}>
            <Raven3D />
          </Suspense>
        </div>

        {/* Foreground content */}
        <div className="relative z-10">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-white/40">
            [ Sealed-Bid Auction Protocol ]
          </span>
          <span className="h-px flex-1 max-w-[120px] bg-white/15" />
          <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Built on Zama fhEVM
          </span>
        </motion.div>

        {/* Giant uppercase tagline — Raven signature */}
        <h1 className="font-black uppercase tracking-[-0.03em] leading-[0.92] text-[clamp(2.8rem,9vw,8rem)] mb-10">
          <motion.span {...fadeUp(0.08)} className="block text-white">Private Bids.</motion.span>
          <motion.span {...fadeUp(0.16)} className="block text-outline">Fair Prices.</motion.span>
          <motion.span {...fadeUp(0.24)} className="block text-white">Zero Knowledge.</motion.span>
        </h1>

        {/* Subtext — Raven cadence */}
        <motion.p {...fadeUp(0.34)} className="text-[clamp(1rem,1.6vw,1.35rem)] text-white/45 max-w-2xl mb-12 leading-relaxed">
          Confidential token distribution. Institutional-grade privacy, sealed end-to-end with
          Zama TFHE — every winner pays their exact private bid, and no one ever sees what others paid.
        </motion.p>

        {/* CTAs — arrow links */}
        <motion.div {...fadeUp(0.42)} className="flex flex-wrap items-center gap-4 mb-20">
          <button
            onClick={() => navigate('/operator')}
            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-black bg-white px-8 py-4 rounded-full transition-all hover:bg-white/90 hover:-translate-y-0.5"
          >
            Launch Auction
            <span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span>
          </button>
          <button
            onClick={() => navigate('/recipient')}
            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/70 hover:text-white px-2 py-4 transition-colors"
          >
            Check My Allocation
            <span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span>
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div {...fadeUp(0.5)} className="flex items-center gap-3 text-white/35 text-xs font-mono uppercase tracking-[0.25em] mt-16">
          <span className="inline-block animate-bounce">↓</span> Scroll to learn more…
        </motion.div>
        </div>{/* /foreground content */}
      </div>
    </section>
  );
}
