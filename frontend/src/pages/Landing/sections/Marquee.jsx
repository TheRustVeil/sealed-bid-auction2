/**
 * Infinite horizontal marquee band — Raven-style "powering the industry".
 * Two identical groups sit side by side; the track translates -50% and loops
 * seamlessly. Alternating solid / outlined words give the big display feel.
 */
const WORDS = [
  'CONFIDENTIAL BY DESIGN',
  'POWERED BY ZAMA FHEVM',
  'SEALED-BID SETTLEMENT',
  'ZERO KNOWLEDGE',
];

function Group() {
  return (
    <div className="inline-flex items-center">
      {WORDS.map((w, i) => (
        <span key={w} className="inline-flex items-center">
          <span
            className={`px-8 text-[clamp(2.2rem,6vw,5rem)] font-black uppercase tracking-tight leading-none ${
              i % 2 === 1 ? 'text-outline' : 'text-white'
            }`}
          >
            {w}
          </span>
          <span className="text-white/25 text-[clamp(2.2rem,6vw,5rem)] font-black leading-none">·</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section className="relative z-10 py-14 overflow-hidden border-y border-white/[0.06]">
      <div className="marquee-track">
        <Group />
        <Group />
      </div>
    </section>
  );
}
