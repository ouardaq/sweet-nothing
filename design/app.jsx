/* app.jsx — routing, cart state, theme tweaks, root render */

const THEMES = {
  strawberry: {
    label: 'Strawberry Milk',
    swatch: ['#ff9ec4', '#8fd0f5', '#fff7e6'],
    vars: {
      '--bg': '#fff7e6', '--bg-2': '#fdeedd', '--cream': '#fffdf5',
      '--ink': '#6b4a3a', '--ink-soft': '#a98a78',
      '--primary': '#ff9ec4', '--primary-d': '#e86fa2',
      '--accent': '#8fd0f5', '--accent-d': '#4ea7e0',
      '--yellow': '#ffe17a', '--mint': '#b9e8c8',
      '--line': '#ecd6bf', '--shadow': '#e3bf9c', '--good': '#7ec98f', '--star': '#ffcf3f',
    },
  },
  matcha: {
    label: 'Matcha Latte',
    swatch: ['#8bd08f', '#ffc9a8', '#f3f6e4'],
    vars: {
      '--bg': '#f4f7e6', '--bg-2': '#eaf0d6', '--cream': '#fcfdf3',
      '--ink': '#4f5a3a', '--ink-soft': '#8a9470',
      '--primary': '#8bd08f', '--primary-d': '#52a866',
      '--accent': '#ffc9a8', '--accent-d': '#e9925f',
      '--yellow': '#ffe17a', '--mint': '#cdeac0',
      '--line': '#d6dcb8', '--shadow': '#c2cd9c', '--good': '#52a866', '--star': '#f0b542',
    },
  },
  blueberry: {
    label: 'Blueberry Cloud',
    swatch: ['#9db4ff', '#c8b6ff', '#eef1ff'],
    vars: {
      '--bg': '#eef1ff', '--bg-2': '#e3e7fc', '--cream': '#fbfcff',
      '--ink': '#4a4870', '--ink-soft': '#8b89ab',
      '--primary': '#9db4ff', '--primary-d': '#6a7fe0',
      '--accent': '#c8b6ff', '--accent-d': '#9b80ee',
      '--yellow': '#ffe17a', '--mint': '#bfeae0',
      '--line': '#d3d8f5', '--shadow': '#c1c7ee', '--good': '#6fc9a0', '--star': '#ffcf3f',
    },
  },
  cocoa: {
    label: 'Cocoa Cream',
    swatch: ['#e7a37a', '#f6cf86', '#fbf0df'],
    vars: {
      '--bg': '#fbf0df', '--bg-2': '#f4e4cb', '--cream': '#fffaf0',
      '--ink': '#5d4030', '--ink-soft': '#a17e64',
      '--primary': '#e7a37a', '--primary-d': '#c47749',
      '--accent': '#f6cf86', '--accent-d': '#dba83f',
      '--yellow': '#ffe17a', '--mint': '#cfe7be',
      '--line': '#ead3b4', '--shadow': '#d8b58a', '--good': '#7ec98f', '--star': '#e8a73f',
    },
  },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "strawberry",
  "dots": true,
  "extraFloaty": true
}/*EDITMODE-END*/;

const CART_KEY = 'sweettreat_cart_v1';
const USER_KEY = 'sweettreat_user_v1';

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState({ view: 'home', productId: null, cat: null });
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch (e) { return null; }
  });
  const [toast, setToast] = useState({ show: false, msg: '' });
  const toastTimer = useRef(null);

  // persist
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(USER_KEY, JSON.stringify(user)); }, [user]);

  // apply theme vars
  useEffect(() => {
    const th = THEMES[t.theme] || THEMES.strawberry;
    const root = document.documentElement;
    Object.entries(th.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    document.body.style.backgroundImage = t.dots ? 'radial-gradient(var(--line) 1px, transparent 1px)' : 'none';
    root.style.setProperty('--floaty', t.extraFloaty ? 'running' : 'paused');
  }, [t.theme, t.dots, t.extraFloaty]);

  // scroll to top on view change
  useEffect(() => { window.scrollTo(0, 0); }, [route.view, route.productId]);

  function go(view, params = {}) {
    setRoute({ view, productId: params.id || null, cat: params.cat || null });
  }
  function popToast(msg) {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((s) => ({ ...s, show: false })), 1900);
  }
  function addToCart(id, qty = 1) {
    setCart((c) => {
      const found = c.find((x) => x.id === id);
      if (found) return c.map((x) => x.id === id ? { ...x, qty: x.qty + qty } : x);
      return [...c, { id, qty }];
    });
    const prod = PRODUCTS.find((p) => p.id === id);
    popToast(`Added ${prod ? prod.name : 'treat'} to basket!`);
  }
  function setQty(id, qty) { setCart((c) => c.map((x) => x.id === id ? { ...x, qty } : x)); }
  function removeItem(id) { setCart((c) => c.filter((x) => x.id !== id)); }
  function clearCart() { setCart([]); }

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const isAuth = route.view === 'login' || route.view === 'register';

  let page;
  if (route.view === 'login') page = <LoginPage go={go} onAuth={(u) => { setUser(u); go('home'); }} />;
  else if (route.view === 'register') page = <RegisterPage go={go} onAuth={(u) => { setUser(u); go('home'); }} />;
  else if (route.view === 'shop') page = <ShopPage go={go} onAdd={addToCart} initialCat={route.cat} />;
  else if (route.view === 'product') page = <ProductPage go={go} onAdd={addToCart} productId={route.productId} />;
  else if (route.view === 'cart') page = <CartPage go={go} cart={cart} setQty={setQty} removeItem={removeItem} clearCart={clearCart} user={user} />;
  else page = <HomePage go={go} onAdd={addToCart} />;

  return (
    <div style={{ minHeight: '100vh' }}>
      {!isAuth && <NavBar route={route} go={go} cartCount={cartCount} user={user} onLogout={() => setUser(null)} />}
      {page}
      <Toast msg={toast.msg} show={toast.show} />

      <TweaksPanel>
        <TweakSection label="Bakery theme" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(THEMES).map(([id, th]) => (
            <button key={id} onClick={() => setTweak('theme', id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', cursor: 'pointer',
              background: t.theme === id ? '#fff' : 'transparent', borderRadius: 8,
              border: '2px solid ' + (t.theme === id ? '#111' : 'transparent'), textAlign: 'left',
            }}>
              <span style={{ display: 'flex', gap: 3 }}>
                {th.swatch.map((c, i) => <span key={i} style={{ width: 16, height: 16, background: c, borderRadius: 3, border: '1px solid rgba(0,0,0,.15)' }} />)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{th.label}</span>
            </button>
          ))}
        </div>
        <TweakSection label="Cuteness" />
        <TweakToggle label="Pixel-dot background" value={t.dots} onChange={(v) => setTweak('dots', v)} />
        <TweakToggle label="Floating treats" value={t.extraFloaty} onChange={(v) => setTweak('extraFloaty', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
