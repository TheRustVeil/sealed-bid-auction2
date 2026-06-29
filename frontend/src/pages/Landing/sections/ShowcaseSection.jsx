import { useState } from 'react';
import { useInView } from '../../../hooks/useInView';

const TABS = ['Operator', 'Recipient', 'Settlement'];

/* ─── Mini operator dashboard mockup ─── */
function OperatorMockup() {
  const rows = [
    { label: 'Seed Round 2024', count: 450, status: 'settled' },
    { label: 'Team Allocation',  count: 23,  status: 'pending' },
    { label: 'Community Drop',   count: 1204, status: 'settled' },
  ];

  return (
    <div className="font-sans text-xs space-y-3">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { v: '3', l: 'Total' },
          { v: '2', l: 'Settled' },
          { v: '1,677', l: 'Recipients' },
        ].map(({ v, l }) => (
          <div key={l} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center">
            <div className="text-lg font-black text-white">{v}</div>
            <div className="text-white/30 text-[10px] uppercase tracking-wider">{l}</div>
          </div>
        ))}
      </div>

      {/* Distribution rows */}
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/12 flex items-center justify-center text-white/80 font-bold text-[11px]">
              {r.label[0]}
            </div>
            <div>
              <div className="text-white font-medium text-[11px]">{r.label}</div>
              <div className="text-white/30 text-[10px]">{r.count} recipients</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'settled' ? 'bg-white/70' : 'bg-white/30'}`} />
            <span className={`text-[10px] font-medium ${r.status === 'settled' ? 'text-white/70' : 'text-white/40'}`}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Mini recipient mockup ─── */
function RecipientMockup() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Distribution ID</div>
        <div className="text-white/80 font-mono text-[11px]">0x3c4d8f2a…9e1b</div>
      </div>

      {/* Decrypt button */}
      <button
        onClick={() => setRevealed(true)}
        className="w-full py-2.5 rounded-xl text-[11px] font-semibold text-black bg-white hover:bg-white/90 transition-all hover:-translate-y-px"
      >
        Decrypt My Allocation
      </button>

      {/* Result */}
      <div
        className="rounded-xl border px-4 py-3 transition-all duration-500"
        style={{
          borderColor: revealed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)',
          background: revealed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
        }}
      >
        {!revealed ? (
          <div className="text-white/20 text-[11px] font-mono">Awaiting decryption…</div>
        ) : (
          <div className="space-y-1.5">
            <div className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">✓ Decrypted</div>
            <div className="text-white text-xl font-black">200 USDC</div>
            <div className="text-white/30 text-[10px]">Only you can see this amount</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Settlement proof mockup ─── */
function SettlementMockup() {
  const rows = [
    { label: 'Tx Hash',      value: '0xfe12…8a3b', mono: true },
    { label: 'Block',        value: '6,241,804',   mono: false },
    { label: 'Recipients',   value: '450',          mono: false },
    { label: 'Total Tokens', value: '91,250 USDC', mono: false },
    { label: 'FHE Proof',    value: '0xab34…11c0', mono: true },
    { label: 'Status',       value: 'Verified ✓',  mono: false, strong: true },
  ];

  return (
    <div className="space-y-2">
      <div className="text-white/70 text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
        Settlement Confirmed
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.05] bg-white/[0.015]">
          <span className="text-white/35 text-[10px]">{r.label}</span>
          <span className={`text-[10px] ${r.mono ? 'font-mono text-white/60' : r.strong ? 'text-white font-semibold' : 'text-white/70'}`}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

const MOCKUPS = {
  Operator: <OperatorMockup />,
  Recipient: <RecipientMockup />,
  Settlement: <SettlementMockup />,
};

const TAB_DESC = {
  Operator: 'Manage auctions, track distributions, and monitor settlement status from a single dashboard.',
  Recipient: "Enter your distribution ID to decrypt your private allocation — only your wallet can read it.",
  Settlement: 'Every settlement publishes a verifiable on-chain proof. Anyone can verify fairness without seeing bids.',
};

const TAB_BULLETS = {
  Operator: [
    'Upload CSV of recipients & bid amounts',
    'Deploy in one click — no backend needed',
    'Monitor settlement status in real-time',
  ],
  Recipient: [
    'No account, no signup — just your wallet',
    'Your allocation is decrypted client-side',
    'Verify the proof yourself on-chain',
  ],
  Settlement: [
    'FHE co-processor decrypts on-chain',
    'Tamper-proof settlement hash pinned',
    'Any wallet can audit fairness',
  ],
};

export function ShowcaseSection() {
  const [active, setActive] = useState('Operator');
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative z-10 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-14 max-w-3xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40 mb-5">[ 04 ] Product</p>
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black uppercase tracking-[-0.02em] leading-[0.95] text-white mb-5">See it in action</h2>
          <p className="text-white/40 text-[15px] max-w-md">
            Three views — operator, recipient, and settlement — all powered by a single smart contract.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* Left: description + tabs */}
          <div>
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-white/[0.06] bg-white/[0.02] w-fit mb-8">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={active === t ? {
                    background: 'rgba(255,255,255,0.10)',
                    color: 'white',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.14)',
                  } : {
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="text-white/50 text-[15px] leading-relaxed mb-8">{TAB_DESC[active]}</p>

            <ul className="space-y-3">
              {TAB_BULLETS[active].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/55">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-white/[0.06] border border-white/12 flex items-center justify-center text-white/80 flex-shrink-0 text-[10px]">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mockup window */}
          <div className="relative">
            <div
              className="absolute inset-0 -m-6 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
            />
            <div className="relative rounded-2xl border border-white/[0.08] bg-panel/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="ml-3 text-white/25 text-xs font-mono">
                  confidential-drop / {active.toLowerCase()}
                </span>
              </div>
              <div className="p-5">
                {MOCKUPS[active]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
