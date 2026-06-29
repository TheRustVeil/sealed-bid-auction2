export function AuroraBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div className="ab ab-1" />
      <div className="ab ab-2" />
      <div className="ab ab-3" />
      <div className="ab ab-4" />
    </div>
  );
}
