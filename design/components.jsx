/* components.jsx — shared pixel UI components */
const { useState, useEffect, useRef } = React;

/* ---------- Button ---------- */
function PixelButton({ children, onClick, variant = 'primary', size = 'md', full, type, style = {}, disabled }) {
  const palettes = {
    primary: { bg: 'var(--primary)', bd: 'var(--primary-d)', fg: '#fff' },
    blue:    { bg: 'var(--accent)',  bd: 'var(--accent-d)', fg: '#fff' },
    yellow:  { bg: 'var(--yellow)',  bd: '#e6b94a', fg: 'var(--ink)' },
    cream:   { bg: 'var(--cream)',   bd: 'var(--ink)', fg: 'var(--ink)' },
    ghost:   { bg: 'transparent',    bd: 'var(--line)', fg: 'var(--ink)' },
  };
  const p = palettes[variant] || palettes.primary;
  const sizes = {
    sm: { pad: '7px 12px', fs: 9 },
    md: { pad: '12px 18px', fs: 11 },
    lg: { pad: '16px 26px', fs: 13 },
  }[size];
  return (
    <button
      type={type || 'button'}
      onClick={disabled ? undefined : onClick}
      className="pixel-text pixel-btn no-select"
      disabled={disabled}
      style={{
        fontSize: sizes.fs, padding: sizes.pad, color: p.fg,
        background: p.bg, border: '3px solid ' + p.bd,
        boxShadow: disabled ? 'none' : '4px 4px 0 0 ' + p.bd,
        borderRadius: 2, width: full ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform .05s, box-shadow .05s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Tag / badge ---------- */
function Tag({ kind }) {
  const map = {
    bestseller: { t: '★ TOP', bg: 'var(--yellow)', fg: '#7a5a10' },
    new:        { t: 'NEW',   bg: 'var(--mint)',   fg: '#2f6b40' },
  };
  const c = map[kind];
  if (!c) return null;
  return (
    <span className="pixel-text" style={{
      fontSize: 8, background: c.bg, color: c.fg,
      padding: '4px 6px', border: '2px solid rgba(0,0,0,.12)', borderRadius: 2,
    }}>{c.t}</span>
  );
}

/* ---------- Price ---------- */
function Price({ value, size = 16 }) {
  return (
    <span className="pixel-text" style={{ fontSize: size, color: 'var(--primary-d)' }}>
      ${value.toFixed(2)}
    </span>
  );
}

/* ---------- Quantity stepper ---------- */
function QtyStepper({ value, onChange, min = 1 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button className="pixel-text qty-btn" onClick={() => onChange(Math.max(min, value - 1))}
        style={qtyBtnStyle('left')}>–</button>
      <div className="pixel-text" style={{
        minWidth: 44, textAlign: 'center', fontSize: 13, padding: '9px 4px',
        borderTop: '3px solid var(--ink)', borderBottom: '3px solid var(--ink)',
        background: 'var(--cream)', color: 'var(--ink)',
      }}>{value}</div>
      <button className="pixel-text qty-btn" onClick={() => onChange(value + 1)}
        style={qtyBtnStyle('right')}>+</button>
    </div>
  );
}
function qtyBtnStyle(side) {
  return {
    fontSize: 14, width: 38, height: 40, lineHeight: '1',
    background: 'var(--bg-2)', color: 'var(--ink)',
    border: '3px solid var(--ink)',
    borderRadius: side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
  };
}

/* ---------- Field ---------- */
function Field({ label, type = 'text', value, onChange, placeholder, icon, hint, error }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span className="pixel-text" style={{ fontSize: 9, display: 'block', marginBottom: 8, color: 'var(--ink-soft)' }}>
        {label}
      </span>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>{icon}</span>}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: '100%', fontFamily: 'var(--body)', fontSize: 16, fontWeight: 600,
            padding: icon ? '13px 14px 13px 38px' : '13px 14px',
            color: 'var(--ink)', background: 'var(--cream)',
            border: '3px solid ' + (error ? '#e8788c' : focus ? 'var(--primary-d)' : 'var(--line)'),
            borderRadius: 2, outline: 'none',
            boxShadow: focus ? '3px 3px 0 0 var(--primary-d)' : '3px 3px 0 0 var(--line)',
            transition: 'border-color .1s, box-shadow .1s',
          }}
        />
      </div>
      {error && <span style={{ fontSize: 12, color: '#d05a6e', fontWeight: 700, marginTop: 6, display: 'block' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6, display: 'block' }}>{hint}</span>}
    </label>
  );
}

/* ---------- decorative drifting clouds bg ---------- */
function CloudsBg({ tone = 'sky' }) {
  const bg = tone === 'sky'
    ? 'linear-gradient(180deg, var(--accent) 0%, #c9ecff 45%, var(--bg) 100%)'
    : 'var(--bg)';
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: bg, zIndex: 0 }}>
      <div className="cloud-strip" style={{ top: '12%', animationDuration: '40s' }}>{cloudRow()}</div>
      <div className="cloud-strip" style={{ top: '34%', animationDuration: '64s', opacity: .7 }}>{cloudRow()}</div>
      <div className="cloud-strip" style={{ top: '60%', animationDuration: '52s', opacity: .55 }}>{cloudRow()}</div>
    </div>
  );
}
function cloudRow() {
  const clouds = [];
  for (let i = 0; i < 8; i++) clouds.push(<PixelCloud key={i} />);
  return <div style={{ display: 'flex', gap: 180, paddingLeft: 60 }}>{clouds}{clouds}</div>;
}
function PixelCloud() {
  return (
    <svg width="120" height="56" viewBox="0 0 30 14" shapeRendering="crispEdges" style={{ flex: '0 0 auto' }}>
      {[
        [10,3,8,1],[8,4,12,1],[6,5,18,1],[5,6,21,3],[5,9,22,1],[6,10,20,1]
      ].map(([x,y,w,h],i)=> <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(255,255,255,.9)"/>)}
      <rect x="6" y="5" width="2" height="1" fill="#fff"/>
    </svg>
  );
}

/* ---------- star rating ---------- */
function Stars({ n = 5, value = 5 }) {
  return (
    <span style={{ letterSpacing: 2, color: 'var(--star)', fontSize: 14 }}>
      {'★'.repeat(value)}<span style={{ color: 'var(--line)' }}>{'★'.repeat(n - value)}</span>
    </span>
  );
}

/* ---------- toast ---------- */
function Toast({ msg, show }) {
  return (
    <div style={{
      position: 'fixed', left: '50%', bottom: 28, transform: `translateX(-50%) translateY(${show ? 0 : 30}px)`,
      opacity: show ? 1 : 0, transition: 'all .3s cubic-bezier(.2,.9,.3,1.3)', zIndex: 200,
      pointerEvents: 'none',
    }}>
      <div className="pixel-text frame" style={{ fontSize: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--mint)', borderColor: 'var(--ink)' }}>
        <span style={{ fontSize: 14 }}>🧺</span> {msg}
      </div>
    </div>
  );
}

Object.assign(window, { PixelButton, Tag, Price, QtyStepper, Field, CloudsBg, PixelCloud, Stars, Toast });
