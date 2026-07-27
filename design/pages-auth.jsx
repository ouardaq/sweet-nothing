/* pages-auth.jsx — Login & Register screens */

function AuthShell({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
      <CloudsBg tone="sky" />
      {/* floating treats */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <span className="float" style={{ position: 'absolute', left: '8%', top: '18%', animationDelay: '.2s' }}><PixelSprite name="strawberry" size={64} /></span>
        <span className="float" style={{ position: 'absolute', right: '10%', top: '22%', animationDelay: '1.1s' }}><PixelSprite name="dango" size={56} /></span>
        <span className="float" style={{ position: 'absolute', left: '14%', bottom: '12%', animationDelay: '.7s' }}><PixelSprite name="taiyaki" size={70} /></span>
        <span className="float" style={{ position: 'absolute', right: '12%', bottom: '14%', animationDelay: '1.6s' }}><PixelSprite name="donut" size={66} /></span>
      </div>
      <div className="pop" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
}

function LoginPage({ go, onAuth }) {
  const [email, setEmail] = useState('hello@sweettreat.co');
  const [pw, setPw] = useState('mochi123');
  const [err, setErr] = useState({});

  function submit(e) {
    e && e.preventDefault();
    const er = {};
    if (!email.includes('@')) er.email = 'Enter a valid email';
    if (pw.length < 4) er.pw = 'Password too short';
    setErr(er);
    if (Object.keys(er).length === 0) {
      onAuth({ name: email.split('@')[0].replace(/[^a-z]/gi, '') || 'friend', email });
    }
  }

  return (
    <AuthShell>
      <div className="frame" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--primary)', padding: '26px 28px 22px', borderBottom: '4px solid var(--ink)', textAlign: 'center', color: '#fff' }}>
          <div className="float" style={{ display: 'inline-block', marginBottom: 6 }}>
            <PixelSprite name="dorayaki" size={64} />
          </div>
          <div className="pixel-text" style={{ fontSize: 18 }}>Welcome back!</div>
          <div style={{ fontSize: 14, marginTop: 8, opacity: .92 }}>Your treats are still warm 🍮</div>
        </div>
        <form onSubmit={submit} style={{ padding: '26px 28px 30px' }}>
          <Field label="EMAIL" type="email" value={email} onChange={(v) => setEmail(v)} icon="✉️" error={err.email} placeholder="you@email.com" />
          <Field label="PASSWORD" type="password" value={pw} onChange={(v) => setPw(v)} icon="🔒" error={err.pw} placeholder="••••••••" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 22px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: 'var(--primary-d)' }} /> Remember me
            </label>
            <a style={{ fontSize: 13, color: 'var(--primary-d)', fontWeight: 700, cursor: 'pointer' }}>Forgot?</a>
          </div>
          <PixelButton size="lg" full type="submit" onClick={submit}>Log in →</PixelButton>
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--ink-soft)' }}>
            New here?{' '}
            <a onClick={() => go('register')} style={{ color: 'var(--primary-d)', fontWeight: 800, cursor: 'pointer' }}>Make an account</a>
          </div>
        </form>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <a onClick={() => go('home')} className="pixel-text" style={{ fontSize: 9, color: 'var(--ink)', cursor: 'pointer', opacity: .7 }}>← browse as guest</a>
      </div>
    </AuthShell>
  );
}

function RegisterPage({ go, onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState({});

  const strength = pw.length === 0 ? 0 : pw.length < 5 ? 1 : pw.length < 9 ? 2 : 3;
  const strLabel = ['', 'soft', 'chewy', 'sturdy'][strength];
  const strColor = ['var(--line)', '#e8a0a0', 'var(--yellow)', 'var(--good)'][strength];

  function submit(e) {
    e && e.preventDefault();
    const er = {};
    if (name.trim().length < 2) er.name = 'Tell us your name';
    if (!email.includes('@')) er.email = 'Enter a valid email';
    if (pw.length < 5) er.pw = 'At least 5 characters';
    if (!agree) er.agree = 'Please accept to continue';
    setErr(er);
    if (Object.keys(er).length === 0) onAuth({ name: name.trim().split(' ')[0], email });
  }

  return (
    <AuthShell>
      <div className="frame" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--accent)', padding: '24px 28px 20px', borderBottom: '4px solid var(--ink)', textAlign: 'center', color: '#fff' }}>
          <div className="float" style={{ display: 'inline-block', marginBottom: 4 }}>
            <PixelSprite name="cupcake" size={62} />
          </div>
          <div className="pixel-text" style={{ fontSize: 17 }}>Join the bakery</div>
          <div style={{ fontSize: 14, marginTop: 8, opacity: .95 }}>Get a free treat on your first order!</div>
        </div>
        <form onSubmit={submit} style={{ padding: '24px 28px 28px' }}>
          <Field label="NAME" value={name} onChange={(v) => setName(v)} icon="🐰" error={err.name} placeholder="Your name" />
          <Field label="EMAIL" type="email" value={email} onChange={(v) => setEmail(v)} icon="✉️" error={err.email} placeholder="you@email.com" />
          <Field label="PASSWORD" type="password" value={pw} onChange={(v) => setPw(v)} icon="🔒" error={err.pw} placeholder="make it chewy" />
          {pw.length > 0 && (
            <div style={{ margin: '-6px 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ flex: 1, height: 8, border: '2px solid var(--ink)', background: i <= strength ? strColor : 'var(--bg-2)' }} />
                ))}
              </div>
              <span className="pixel-text" style={{ fontSize: 8, color: 'var(--ink-soft)' }}>{strLabel}</span>
            </div>
          )}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer', marginBottom: err.agree ? 4 : 20 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--primary-d)' }} />
            <span>I agree to receive freshly-baked news &amp; the occasional pixel-perfect coupon.</span>
          </label>
          {err.agree && <div style={{ fontSize: 12, color: '#d05a6e', fontWeight: 700, marginBottom: 14 }}>{err.agree}</div>}
          <PixelButton size="lg" full variant="blue" type="submit" onClick={submit}>Create account ♡</PixelButton>
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--ink-soft)' }}>
            Already have one?{' '}
            <a onClick={() => go('login')} style={{ color: 'var(--accent-d)', fontWeight: 800, cursor: 'pointer' }}>Log in</a>
          </div>
        </form>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <a onClick={() => go('home')} className="pixel-text" style={{ fontSize: 9, color: 'var(--ink)', cursor: 'pointer', opacity: .7 }}>← browse as guest</a>
      </div>
    </AuthShell>
  );
}

Object.assign(window, { AuthShell, LoginPage, RegisterPage });
