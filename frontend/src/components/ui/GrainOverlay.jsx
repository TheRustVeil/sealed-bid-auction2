/**
 * Subtle film-grain + vignette overlay.
 * Gives the page the soft, premium "quiet luxury" texture of alethia.earth.
 * Pure CSS/SVG — no animation cost beyond a tiny opacity shimmer.
 */
export function GrainOverlay() {
  return (
    <>
      {/* Vignette — darkens the edges so the aurora reads as light from the center */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse 120% 80% at 50% 30%, transparent 35%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      {/* Film grain */}
      <div
        className="fixed inset-0 pointer-events-none grain-layer"
        style={{ zIndex: 3 }}
      />
    </>
  );
}
