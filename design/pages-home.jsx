/* pages-home.jsx — landing page */

function HomePage({ go, onAdd }) {
  const best = PRODUCTS.filter((p) => p.tag === 'bestseller');
  const fresh = PRODUCTS.filter((p) => p.tag === 'new');
  const cats = [
    { id: 'mochi', name: 'Mochi', sprite: 'mochi', swap: { w: '#ffd9e6', p: '#ff6f6f' }, wash: '#fdeaf1', n: PRODUCTS.filter(p=>p.cat==='mochi').length },
    { id: 'pancake', name: 'Pancakes', sprite: 'dorayaki', swap: null, wash: '#f7ecdc', n: PRODUCTS.filter(p=>p.cat==='pancake').length },
    { id: 'pastry', name: 'Pastries', sprite: 'macaron', swap: null, wash: '#efeafd', n: PRODUCTS.filter(p=>p.cat==='pastry').length },
  ];

  return (
    <div>
      {/* hero */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '4px solid var(--ink)' }}>
        <CloudsBg tone="sky" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1180, margin: '0 auto', padding: '60px 24px 70px', display: 'flex', flexWrap: 'wrap', gap: 30, alignItems: 'center' }}>
          <div style={{ flex: '1 1 360px' }}>
            <span className="pixel-text" style={{ display: 'inline-block', fontSize: 9, background: 'var(--yellow)', color: '#7a5a10', padding: '6px 10px', border: '3px solid #e6b94a', borderRadius: 2, marginBottom: 18 }}>
              🌸 fresh batch every morning
            </span>
            <h1 className="pixel-text" style={{ fontSize: 38, lineHeight: 1.45, margin: '0 0 18px', color: 'var(--ink)', textShadow: '3px 3px 0 #fff' }}>
              Tiny treats,<br /><span style={{ color: 'var(--primary-d)' }}>big</span> happiness.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink)', maxWidth: 440, margin: '0 0 26px', fontWeight: 600 }}>
              Hand-made mochi, dorayaki &amp; taiyaki baked fresh in our little pixel kitchen. Pick a basket of softness.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <PixelButton size="lg" onClick={() => go('shop')}>Shop treats →</PixelButton>
              <PixelButton size="lg" variant="cream" onClick={() => go('register')}>Join &amp; save</PixelButton>
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 30, flexWrap: 'wrap' }}>
              <HeroStat n="12+" l="daily treats" />
              <HeroStat n="100%" l="hand-made" />
              <HeroStat n="4.9★" l="rated cute" />
            </div>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', minHeight: 300 }}>
            <div className="frame float" style={{ background: 'var(--cream)', padding: 26, borderRadius: 4 }}>
              <PixelSprite name="taiyaki" size={210} />
            </div>
            <span className="float" style={{ position: 'absolute', top: 0, right: 6, animationDelay: '.6s' }}><PixelSprite name="strawberry" size={56} /></span>
            <span className="float" style={{ position: 'absolute', bottom: 6, left: 0, animationDelay: '1.2s' }}><PixelSprite name="dango" size={62} /></span>
          </div>
        </div>
      </section>

      {/* categories */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '54px 24px 10px' }}>
        <SectionTitle eyebrow="browse by" title="Pick a craving" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 26 }}>
          {cats.map((c) => (
            <div key={c.id} className="treat-card frame" onClick={() => go('shop', { cat: c.id })} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, background: c.wash }}>
              <div className="bob" style={{ flex: '0 0 auto' }}><PixelSprite name={c.sprite} swap={c.swap} size={76} /></div>
              <div>
                <div className="pixel-text" style={{ fontSize: 13 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8 }}>{c.n} treats →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* bestsellers */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '44px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <SectionTitle eyebrow="everyone loves" title="Bestselling treats" />
          <a onClick={() => go('shop')} className="pixel-text" style={{ fontSize: 10, color: 'var(--primary-d)', cursor: 'pointer' }}>see all →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 26 }}>
          {best.map((p) => <ProductCard key={p.id} p={p} onOpen={(id) => go('product', { id })} onAdd={onAdd} />)}
        </div>
      </section>

      {/* promo banner */}
      <section style={{ maxWidth: 1180, margin: '56px auto 0', padding: '0 24px' }}>
        <div className="frame" style={{ background: 'var(--mint)', padding: '30px 32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
          <div className="float" style={{ flex: '0 0 auto' }}><PixelSprite name="donut" size={96} /></div>
          <div style={{ flex: '1 1 300px' }}>
            <div className="pixel-text" style={{ fontSize: 16, marginBottom: 12, color: '#2f6b40' }}>Treat Club ♡</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink)', margin: '0 0 16px', fontWeight: 600 }}>
              Earn a pixel-stamp on every order. Collect 8 and your next treat is on the house!
            </p>
            <PixelButton variant="cream" onClick={() => go('register')}>Start collecting</PixelButton>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 200 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pixel-text" style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: i < 3 ? 'var(--primary)' : 'var(--cream)', color: i < 3 ? '#fff' : 'var(--line)', border: '3px solid var(--ink)', borderRadius: 2 }}>
                {i < 3 ? '★' : '·'}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* fresh / new */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '44px 24px 0' }}>
        <SectionTitle eyebrow="just baked" title="Fresh from the oven" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 26 }}>
          {fresh.map((p) => <ProductCard key={p.id} p={p} onOpen={(id) => go('product', { id })} onAdd={onAdd} />)}
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

function HeroStat({ n, l }) {
  return (
    <div>
      <div className="pixel-text" style={{ fontSize: 18, color: 'var(--primary-d)' }}>{n}</div>
      <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 6, fontWeight: 600 }}>{l}</div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div>
      {eyebrow && <div className="pixel-text" style={{ fontSize: 9, color: 'var(--primary-d)', marginBottom: 12, letterSpacing: 1 }}>{eyebrow}</div>}
      <h2 className="pixel-text" style={{ fontSize: 22, margin: 0, color: 'var(--ink)' }}>{title}</h2>
    </div>
  );
}

Object.assign(window, { HomePage, HeroStat, SectionTitle });
