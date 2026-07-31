'use client';

import { useId, useState } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  type?: string;
  placeholder?: string;
  icon?: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
};

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  hint,
  error,
  autoComplete,
}: Props) {
  const [focus, setFocus] = useState(false);
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="pixel-text mb-2 block text-[9px] text-ink-soft"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[16px]"
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          style={{
            width: '100%',
            fontFamily: 'var(--body)',
            fontSize: 16,
            fontWeight: 600,
            padding: icon ? '13px 14px 13px 38px' : '13px 14px',
            color: 'var(--ink)',
            background: 'var(--cream)',
            border: `3px solid ${error ? '#e8788c' : focus ? 'var(--primary-d)' : 'var(--line)'}`,
            borderRadius: 2,
            outline: 'none',
            boxShadow: `3px 3px 0 0 ${focus ? 'var(--primary-d)' : 'var(--line)'}`,
            transition: 'border-color .1s, box-shadow .1s',
          }}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-[12px] font-bold"
          style={{ color: '#d05a6e' }}
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
