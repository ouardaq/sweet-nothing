const SHAPES: [number, number, number, number][] = [
  [10, 3, 8, 1],
  [8, 4, 12, 1],
  [6, 5, 18, 1],
  [5, 6, 21, 3],
  [5, 9, 22, 1],
  [6, 10, 20, 1],
];

export function PixelCloud() {
  return (
    <svg
      width="120"
      height="56"
      viewBox="0 0 30 14"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      style={{ flex: '0 0 auto' }}
    >
      {SHAPES.map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          fill="rgba(255,255,255,.9)"
        />
      ))}
      <rect x="6" y="5" width="2" height="1" fill="#fff" />
    </svg>
  );
}
