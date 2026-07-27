/* layout.jsx — logo, nav, footer, product card */

function Logo({ size = 'md', onClick }) {
  const fs = { sm: 14, md: 20, lg: 30 }[size];
  return (
    <div onClick={onClick} className="no-select" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: onClick ? 'pointer' : 'default' }}>
      <span className="float" style={{ display: 'inline-block' }}>
        <PixelSprite name="mochi" swap={{ w: '#ffd9e6', p: '#ff6f6f' }} size={fs * 1.9} />
      </span>
      <span className="pixel-text" style={{ fontSize: fs, lineHeight: 1.1, color: 'var(--ink)' }}>
        Sweet<br /><span style={{ color: 'var(--primary-d)' }}>Treat</span>
      </span>
    </div>
  );
}

function NavBar({ route, go, cartCount, user, onLogout }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--cream)', borderBottom: '4px solid var(--ink)',
      boxShadow: '0 6px 0 0 var(--shadow)',
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Logo size="sm" onClick={() => go('home')} />
        <nav style={{ display: 'flex', gap: 6, marginLeft: 18 }}>
          <a className={'nav-link' + (route.view === 'home' ? ' active' : '')} onClick={() => go('home')}>Home</a>
          <a className={'nav-link' + (route.view === 'shop' ? ' active' : '')} onClick={() => go('shop')}>Shop</a>
        </nav>
        <div style={{ flex: 1 }} />
        <button className="pixel-text" onClick={() => go('cart')} style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 8, fontSize: 10,
          padding: '10px 14px', background: 'var(--yellow)', color: 'var(--ink)',
          border: '3px solid #e6b94a', borderRadius: 2, boxShadow: '3px 3px 0 0 #e6b94a',
        }}>
          <span style={{ fontSize: 15 }}>🧺</span> Basket
          {cartCount > 0 && (
            <span className="pixel-text" style={{
              position: 'absolute', top: -10, right: -10, fontSize: 8, minWidth: 20, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--primary)', color: '#fff', border: '2px solid var(--primary-d)',
              borderRadius: 2, padding: '0 3px',
            }}>{cartCount}</span>
          )}
        </button>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pixel-text" style={{ fontSize: 9, color: 'var(--ink-soft)' }}>hi, {user.name}!</span>
            <button className="nav-link" onClick={onLogout} style={{ cursor: 'pointer' }}>Log out</button>
          </div>
        ) : (
          <button className="nav-link" onClick={() => go('login')} style={{ cursor: 'pointer' }}>Log in</button>
        )}
      </div>
    </header>
  );
}

function Footer({ go }) {
  return (
    <footer style={{ marginTop: 60 }}>
      <div className="checker" />
      <div style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
          <div style={{ maxWidth: 280 }}>
            <div className="pixel-text" style={{ fontSize: 18, marginBottom: 12 }}>
              Sweet<span style={{ color: 'var(--primary)' }}>Treat</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: .8, margin: 0 }}>
              A tiny pixel bakery making fresh mochi, dorayaki &amp; taiyaki every morning. Baked with love, served warm.
            </p>
          </div>
          <FooterCol title="Shop" items={['All treats', 'Mochi', 'Pancakes', 'Pastries']} onItem={() => go('shop')} />
          <FooterCol title="Hours" items={['Mon–Fri · 7–6', 'Sat · 8–7', 'Sun · 9–4', 'Pickup & delivery']} />
          <FooterCol title="Visit" items={['12 Blossom Lane', 'Pixel Town', '☎ 555-MOCHI', '@sweettreat']} />
        </div>
        <div style={{ maxWidth: 1180, margin: '28px auto 0', paddingTop: 18, borderTop: '2px dashed rgba(255,255,255,.25)', fontSize: 12, opacity: .6 }}>
          © 2026 Sweet Treat Bakery · Made with 🍓 &amp; pixels
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, items, onItem }) {
  return (
    <div>
      <div className="pixel-text" style={{ fontSize: 10, marginBottom: 14, color: 'var(--primary)' }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <li key={i} onClick={onItem} style={{ fontSize: 14, opacity: .85, cursor: onItem ? 'pointer' : 'default' }}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

/* product card for grids */
function ProductCard({ p, onOpen, onAdd }) {
  return (
    <div className="treat-card frame" onClick={() => onOpen(p.id)} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', background: cardWash(p), padding: '22px 0', display: 'flex', justifyContent: 'center', borderBottom: '3px solid var(--ink)' }}>
        {p.tag && <div style={{ position: 'absolute', top: 10, left: 10 }}><Tag kind={p.tag} /></div>}
        <span className="bob"><PixelSprite name={p.sprite} swap={p.swap} size={96} /></span>
      </div>
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div>
          <div className="pixel-text" style={{ fontSize: 11, lineHeight: 1.4 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>{p.flavor}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Price value={p.price} size={15} />
          <PixelButton size="sm" onClick={(e) => { e.stopPropagation(); onAdd(p.id); }}>+ Add</PixelButton>
        </div>
      </div>
    </div>
  );
}

/* soft tinted wash behind a sprite, derived from its flavor */
function cardWash(p) {
  const f = (p.flavor || '').toLowerCase();
  if (f.includes('matcha')) return '#eef6dc';
  if (f.includes('soda')) return '#e3f3fd';
  if (f.includes('lavender')) return '#efeafd';
  if (f.includes('red bean') || p.sprite === 'dorayaki') return '#f7ecdc';
  if (f.includes('custard') || p.sprite === 'taiyaki') return '#fdf3da';
  if (f.includes('trio')) return '#fdeaf1';
  return '#fdeaf1';
}

Object.assign(window, { Logo, NavBar, Footer, ProductCard, cardWash });
