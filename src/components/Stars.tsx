export function Stars({ value = 5, n = 5 }: { value?: number; n?: number }) {
  return (
    <span
      role="img"
      aria-label={`${value} out of ${n} stars`}
      style={{ letterSpacing: 2, color: 'var(--star)', fontSize: 14 }}
    >
      <span aria-hidden="true">
        {'★'.repeat(value)}
        <span style={{ color: 'var(--line)' }}>
          {'★'.repeat(Math.max(0, n - value))}
        </span>
      </span>
    </span>
  );
}
