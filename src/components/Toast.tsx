'use client';

export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-7 left-1/2 z-[200]"
      style={{
        transform: `translateX(-50%) translateY(${message ? 0 : 30}px)`,
        opacity: message ? 1 : 0,
        transition: 'all .3s cubic-bezier(.2,.9,.3,1.3)',
      }}
    >
      <div
        className="pixel-text frame flex items-center gap-2.5 text-[10px]"
        style={{
          padding: '12px 18px',
          background: 'var(--mint)',
          borderColor: 'var(--ink)',
        }}
      >
        <span aria-hidden="true" className="text-[14px]">
          🧺
        </span>
        {message}
      </div>
    </div>
  );
}
