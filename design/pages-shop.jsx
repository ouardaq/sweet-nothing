/* pages-shop.jsx — Shop grid, Product detail, Cart & checkout */

/* ---------------- SHOP ---------------- */
function ShopPage({ go, onAdd, initialCat }) {
  const [cat, setCat] = useState(initialCat || 'all');
  const [sort, setSort] = useState('featured');
  useEffect(() => { if (initialCat) setCat(initialCat); }, [initialCat]);

  const cats = [
    { id: 'all', label: 'All' },
    { id: 'mochi', label: 'Mochi' },
    { id: 'pancake', label: 'Pancakes' },
    { id: 'pastry', label: 'Pastries' },
  ];

  let list = PRODUCTS.filter((p) => cat === 'all' || p.cat === cat);
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      {/* header band */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '4px solid var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div className="pixel-text" style={{ fontSize: 9, color: 'var(--primary-d)', marginBottom: 12 }}>the whole case</div>
            <h1 className="pixel-text" style={{ fontSize: 26, margin: 0 }}>Treat Shop</h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="float"><PixelSprite name="cupcake" size={56} /></span>
            <span className="float" style={{ animationDelay: '.8s' }}><PixelSprite name="macaron" size={56} /></span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '26px 24px 0' }}>
        {/* filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 26 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {cats.map((c) => (
              <button key={c.id} className={'chip' + (cat === c.id ? ' active' : '')} onClick={() => setCat(c.id)}>{c.label}</button>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pixel-text" style={{ fontSize: 9, color: 'var(--ink-soft)' }}>sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
              fontFamily: 'var(--body)', fontWeight: 700, fontSize: 14, padding: '9px 12px',
              border: '3px solid var(--line)', borderRadius: 2, background: 'var(--cream)', color: 'var(--ink)',
              boxShadow: '3px 3px 0 0 var(--line)', cursor: 'pointer',
            }}>
              <option value="featured">Featured</option>
              <option value="low">Price: low → high</option>
              <option value="high">Price: high → low</option>
              <option value="az">A → Z</option>
            </select>
          </label>
        </div>

        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18, fontWeight: 600 }}>{list.length} delicious things</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {list.map((p) => <ProductCard key={p.id} p={p} onOpen={(id) => go('product', { id })} onAdd={onAdd} />)}
        </div>
      </div>

      <Footer go={go} />
    </div>
  );
}

/* ---------------- PRODUCT DETAIL ---------------- */
function ProductPage({ go, onAdd, productId }) {
  const p = PRODUCTS.find((x) => x.id === productId) || PRODUCTS[0];
  const [qty, setQty] = useState(1);
  useEffect(() => { setQty(1); }, [productId]);
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const tags = ['hand-made today', 'no preservatives', p.flavor.toLowerCase() + ' flavor', 'serves 1'];

  return (
    <div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '22px 24px 0' }}>
        <a onClick={() => go('shop')} className="pixel-text" style={{ fontSize: 9, color: 'var(--ink-soft)', cursor: 'pointer' }}>← back to shop</a>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 0', display: 'flex', gap: 36, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* image panel */}
        <div className="frame" style={{ flex: '1 1 360px', background: cardWash(p), padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 360 }}>
          {p.tag && <div style={{ position: 'absolute', top: 16, left: 16 }}><Tag kind={p.tag} /></div>}
          <span className="float"><PixelSprite name={p.sprite} swap={p.swap} size={240} /></span>
        </div>

        {/* info */}
        <div style={{ flex: '1 1 320px' }}>
          <div className="pixel-text" style={{ fontSize: 9, color: 'var(--primary-d)', marginBottom: 12 }}>{p.flavor} · {p.cat}</div>
          <h1 className="pixel-text" style={{ fontSize: 26, margin: '0 0 14px', lineHeight: 1.4 }}>{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <Stars value={5} /><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>(128 happy bites)</span>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--ink)', fontWeight: 600, margin: '0 0 22px' }}>{p.blurb}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
            {tags.map((t, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 700, background: 'var(--bg-2)', color: 'var(--ink-soft)', padding: '6px 10px', border: '2px solid var(--line)', borderRadius: 2 }}>{t}</span>
            ))}
          </div>

          <div className="frame-soft" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Price value={p.price} size={26} />
              <QtyStepper value={qty} onChange={setQty} />
            </div>
            <PixelButton size="lg" full onClick={() => onAdd(p.id, qty)}>Add {qty} to basket · ${(p.price * qty).toFixed(2)}</PixelButton>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section style={{ maxWidth: 1100, margin: '50px auto 0', padding: '0 24px' }}>
          <SectionTitle eyebrow="you might also love" title="More like this" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 24 }}>
            {related.map((r) => <ProductCard key={r.id} p={r} onOpen={(id) => go('product', { id })} onAdd={onAdd} />)}
          </div>
        </section>
      )}

      <Footer go={go} />
    </div>
  );
}

/* ---------------- CART & CHECKOUT ---------------- */
function CartPage({ go, cart, setQty, removeItem, clearCart, user }) {
  const [step, setStep] = useState('cart'); // cart | checkout | done
  const [fulfil, setFulfil] = useState('pickup');
  const [form, setForm] = useState({ name: user ? user.name : '', addr: '', when: 'ASAP (today)' });
  const [promo, setPromo] = useState('');
  const [promoOk, setPromoOk] = useState(false);

  const items = cart.map((c) => ({ ...PRODUCTS.find((p) => p.id === c.id), qty: c.qty })).filter((x) => x.id);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const delivery = fulfil === 'delivery' ? (subtotal > 25 ? 0 : 3.5) : 0;
  const discount = promoOk ? subtotal * 0.15 : 0;
  const total = Math.max(0, subtotal - discount + delivery);

  function applyPromo() { setPromoOk(promo.trim().toUpperCase() === 'PIXEL15'); }

  /* ---- empty ---- */
  if (items.length === 0 && step !== 'done') {
    return (
      <div>
        <CartHeader step="cart" />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <div className="float" style={{ display: 'inline-block', opacity: .85 }}><PixelSprite name="taiyaki" size={120} /></div>
          <h2 className="pixel-text" style={{ fontSize: 18, margin: '20px 0 12px' }}>Your basket is empty</h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 26 }}>Let's fix that — the case is full of warm things.</p>
          <PixelButton size="lg" onClick={() => go('shop')}>Browse treats →</PixelButton>
        </div>
        <Footer go={go} />
      </div>
    );
  }

  /* ---- confirmation ---- */
  if (step === 'done') {
    return (
      <div>
        <CartHeader step="done" />
        <div className="pop" style={{ maxWidth: 560, margin: '0 auto', padding: '50px 24px' }}>
          <div className="frame" style={{ padding: 36, textAlign: 'center' }}>
            <div className="float" style={{ display: 'inline-block' }}><PixelSprite name="dorayaki" size={120} /></div>
            <h2 className="pixel-text" style={{ fontSize: 20, margin: '18px 0 12px', color: 'var(--primary-d)' }}>Order placed!</h2>
            <p style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, lineHeight: 1.7, margin: '0 0 8px' }}>
              Thanks {form.name || 'friend'}! Order <b>#PT-{Math.floor(1000 + Math.random() * 9000)}</b> is in the oven.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 24 }}>
              {fulfil === 'pickup' ? 'Ready for pickup at 12 Blossom Lane in ~20 min 🧺' : 'Warm delivery heading your way soon 🚲'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <PixelButton onClick={() => { clearCart(); go('shop'); }}>Order more</PixelButton>
              <PixelButton variant="cream" onClick={() => { clearCart(); go('home'); }}>Back home</PixelButton>
            </div>
          </div>
        </div>
        <Footer go={go} />
      </div>
    );
  }

  return (
    <div>
      <CartHeader step={step} />
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0', display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* left column */}
        <div style={{ flex: '1 1 440px' }}>
          {step === 'cart' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((it) => (
                <div key={it.id} className="frame" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ background: cardWash(it), border: '3px solid var(--ink)', borderRadius: 2, flex: '0 0 auto' }}>
                    <PixelSprite name={it.sprite} swap={it.swap} size={72} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="pixel-text" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => go('product', { id: it.id })}>{it.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '8px 0' }}>{it.flavor} · <Price value={it.price} size={13} /></div>
                    <button onClick={() => removeItem(it.id)} style={{ fontSize: 12, fontWeight: 700, color: '#d05a6e', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>✕ remove</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <QtyStepper value={it.qty} onChange={(v) => setQty(it.id, v)} />
                    <Price value={it.price * it.qty} size={15} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="frame" style={{ padding: 24 }}>
              <h3 className="pixel-text" style={{ fontSize: 13, margin: '0 0 20px' }}>How would you like it?</h3>
              <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
                {[['pickup', '🧺 Pickup', 'free · ~20 min'], ['delivery', '🚲 Delivery', subtotal > 25 ? 'free over $25' : '$3.50']].map(([id, label, sub]) => (
                  <button key={id} onClick={() => setFulfil(id)} style={{
                    flex: 1, textAlign: 'left', padding: 14, cursor: 'pointer', borderRadius: 2,
                    background: fulfil === id ? 'var(--primary)' : 'var(--cream)',
                    color: fulfil === id ? '#fff' : 'var(--ink)',
                    border: '3px solid ' + (fulfil === id ? 'var(--primary-d)' : 'var(--line)'),
                    boxShadow: '3px 3px 0 0 ' + (fulfil === id ? 'var(--primary-d)' : 'var(--line)'),
                  }}>
                    <div className="pixel-text" style={{ fontSize: 10 }}>{label}</div>
                    <div style={{ fontSize: 12, marginTop: 8, opacity: .9 }}>{sub}</div>
                  </button>
                ))}
              </div>
              <Field label="NAME" value={form.name} onChange={(v) => setForm({ ...form, name: v })} icon="🐰" placeholder="Your name" />
              {fulfil === 'delivery' && (
                <Field label="DELIVERY ADDRESS" value={form.addr} onChange={(v) => setForm({ ...form, addr: v })} icon="🏠" placeholder="12 Blossom Lane, Pixel Town" />
              )}
              <label style={{ display: 'block' }}>
                <span className="pixel-text" style={{ fontSize: 9, display: 'block', marginBottom: 8, color: 'var(--ink-soft)' }}>WHEN</span>
                <select value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} style={{
                  width: '100%', fontFamily: 'var(--body)', fontWeight: 700, fontSize: 16, padding: '13px 14px',
                  border: '3px solid var(--line)', borderRadius: 2, background: 'var(--cream)', color: 'var(--ink)',
                  boxShadow: '3px 3px 0 0 var(--line)',
                }}>
                  <option>ASAP (today)</option>
                  <option>This afternoon</option>
                  <option>Tomorrow morning</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {/* summary */}
        <div style={{ flex: '1 1 280px', position: 'sticky', top: 92 }}>
          <div className="frame" style={{ padding: 22 }}>
            <h3 className="pixel-text" style={{ fontSize: 12, margin: '0 0 18px' }}>Order summary</h3>
            <Row k={`Subtotal (${items.reduce((s, i) => s + i.qty, 0)} items)`} v={`$${subtotal.toFixed(2)}`} />
            {promoOk && <Row k="Promo PIXEL15 (–15%)" v={`–$${discount.toFixed(2)}`} good />}
            <Row k={fulfil === 'delivery' ? 'Delivery' : 'Pickup'} v={delivery === 0 ? 'free' : `$${delivery.toFixed(2)}`} />
            <div style={{ borderTop: '3px dashed var(--line)', margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span className="pixel-text" style={{ fontSize: 11 }}>Total</span>
              <Price value={total} size={22} />
            </div>

            {/* promo */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="promo code" style={{
                flex: 1, minWidth: 0, fontFamily: 'var(--body)', fontWeight: 700, fontSize: 14, padding: '10px 12px',
                border: '3px solid var(--line)', borderRadius: 2, background: 'var(--bg-2)', color: 'var(--ink)', outline: 'none',
              }} />
              <PixelButton size="sm" variant="cream" onClick={applyPromo}>Apply</PixelButton>
            </div>
            {promo && !promoOk && <div style={{ fontSize: 12, color: '#d05a6e', fontWeight: 700, marginTop: -10, marginBottom: 14 }}>Hmm, try <b>PIXEL15</b> 🤫</div>}

            {step === 'cart' ? (
              <PixelButton size="lg" full onClick={() => setStep('checkout')}>Checkout →</PixelButton>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <PixelButton size="lg" full onClick={() => setStep('done')}>Place order ♡</PixelButton>
                <PixelButton variant="ghost" full onClick={() => setStep('cart')}>← back to basket</PixelButton>
              </div>
            )}
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', textAlign: 'center', marginTop: 14 }}>🔒 cozy &amp; secure checkout</div>
          </div>
          {step === 'cart' && <div style={{ textAlign: 'center', marginTop: 14 }}><a onClick={() => go('shop')} style={{ fontSize: 14, color: 'var(--primary-d)', fontWeight: 700, cursor: 'pointer' }}>+ keep shopping</a></div>}
        </div>
      </div>
      <Footer go={go} />
    </div>
  );
}

function CartHeader({ step }) {
  const steps = [['cart', '1 Basket'], ['checkout', '2 Details'], ['done', '3 Done']];
  const idx = { cart: 0, checkout: 1, done: 2 }[step];
  return (
    <div style={{ background: 'var(--bg-2)', borderBottom: '4px solid var(--ink)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '26px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <h1 className="pixel-text" style={{ fontSize: 22, margin: 0 }}>Your Basket</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {steps.map(([id, label], i) => (
            <span key={id} className="pixel-text" style={{
              fontSize: 9, padding: '7px 10px', borderRadius: 2,
              background: i <= idx ? 'var(--primary)' : 'var(--cream)',
              color: i <= idx ? '#fff' : 'var(--ink-soft)',
              border: '2px solid ' + (i <= idx ? 'var(--primary-d)' : 'var(--line)'),
            }}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, good }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10, color: good ? 'var(--good)' : 'var(--ink)', fontWeight: 600 }}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
}

Object.assign(window, { ShopPage, ProductPage, CartPage, CartHeader, Row });
