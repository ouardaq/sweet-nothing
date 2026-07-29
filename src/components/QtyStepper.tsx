'use client';

const btnStyle = (side: 'left' | 'right') => ({
  fontSize: 14,
  width: 38,
  height: 40,
  lineHeight: 1,
  background: 'var(--bg-2)',
  color: 'var(--ink)',
  border: '3px solid var(--ink)',
  borderRadius: side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
});

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

export function QtyStepper({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className="pixel-text qty-btn"
        style={btnStyle('left')}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        –
      </button>

      <div
        className="pixel-text"
        aria-live="polite"
        style={{
          minWidth: 44,
          textAlign: 'center',
          fontSize: 13,
          padding: '9px 4px',
          borderTop: '3px solid var(--ink)',
          borderBottom: '3px solid var(--ink)',
          background: 'var(--cream)',
        }}
      >
        {value}
      </div>

      <button
        type="button"
        className="pixel-text qty-btn"
        style={btnStyle('right')}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
