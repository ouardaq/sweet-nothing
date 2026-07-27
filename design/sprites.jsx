/* sprites.jsx — pixel-art treat sprites + product catalog
   Each sprite is an array of equal-length strings; each char maps to a
   palette color. '.' = transparent. Rendered as crisp 1x1 SVG rects. */

// shared palette for sprite chars
const SPRITE_COLORS = {
  k: '#3a2a22', // outline / dark
  o: '#8a5a3c', // chocolate
  O: '#5e3b24', // dark chocolate
  b: '#f3c279', // golden bread
  B: '#dd9b4a', // bread shade
  c: '#f6e6c8', // cream
  w: '#fffdf5', // white
  p: '#ff9ec4', // pink
  P: '#e86fa2', // deep pink
  e: '#ffbcd0', // cheek blush
  r: '#ff6f6f', // red / strawberry
  R: '#d94f4f', // dark red
  g: '#94d8a2', // green
  G: '#5db272', // dark green
  m: '#bfe06e', // matcha
  s: '#8fd0f5', // sky blue
  S: '#4ea7e0', // deep blue
  y: '#ffe07a', // yellow
  l: '#c8b6ff', // lavender
  L: '#a48cf0', // deep lavender
  h: '#7a4a8c', // stick/handle brown-purple
  t: '#a9744f', // stick
};

// ----- sprite grids (14 wide) -----
const SPRITES = {
  // round mochi / daifuku with a cute face
  mochi: [
    '..............',
    '....wwwwww....',
    '..wwwwwwwwww..',
    '.wwwwwwwwwwww.',
    'wwwwwwwwwwwwww',
    'wwwwwwwwwwwwww',
    'wwkwwwwwwwkwww',
    'wekwwwwwwwkeww',
    'wwwwwwwwwwwwww',
    'wwwwwppwwwwwww',
    '.wwwwwwwwwwww.',
    '.wwwwwwwwwwww.',
    '..wwwwwwwwww..',
    '....wwwwww....',
  ],
  // dorayaki — two pancakes with red bean filling (side)
  dorayaki: [
    '..............',
    '...bbbbbbbb...',
    '..bBBBBBBBBb..',
    '.bBbbbbbbbbBb.',
    'bBbbkbbbbkbbBb',
    'bBbbbbbbbbbbBb',
    'kkkkkkkkkkkkkk',
    'kOOOOOOOOOOOOk',
    'kkkkkkkkkkkkkk',
    'bBbbbbbbbbbbBb',
    '.bBbbbbbbbbBb.',
    '..bBBBBBBBBb..',
    '...bbbbbbbb...',
    '..............',
  ],
  // taiyaki — fish-shaped cake
  taiyaki: [
    '..............',
    '....bbbb......',
    '..bbBBBBbb..b.',
    '.bbbbbbbbBb.bb',
    'bbwkbbbbbBBbbb',
    'bbwkbbbbbBBbbb',
    'bbbbbbbbbBBbbb',
    'bbbbbbbbbBBbbb',
    'bbbbbbbbBBb.bb',
    '.bbbbbbbb...b.',
    '..bbBBBb......',
    '...bbbb.......',
    '..............',
    '..............',
  ],
  // dango — three balls on a skewer (pink / white / matcha)
  dango: [
    '......tt......',
    '......tt......',
    '....pppppp....',
    '...pppppppp...',
    '...pkppppkp...',
    '...pppeeppp...',
    '....pppppp....',
    '....wwwwww....',
    '...wwwwwwww...',
    '...wkwwwwkw...',
    '....wwwwww....',
    '....gggggg....',
    '...gggggggg...',
    '...gkggggkg...',
    '....gggggg....',
    '......tt......',
  ],
  // donut — pink-glazed ring with sprinkles
  donut: [
    '..............',
    '....PPPPPP....',
    '..PPpppppppP..',
    '.PpsppyppspP..',
    '.PpppPPpppppP.',
    'Ppp PP PP pppP',
    'Ppp P    P pyP',
    'Ppy P    P ppP',
    'Ppp PP PP pppP',
    '.PppspppyppP..',
    '.PpppyppspP...',
    '..PPpppppP....',
    '....PPPP......',
    '..............',
  ],
  // macaron — two shells + cream filling (side), little feet
  macaron: [
    '..............',
    '...pppppppp...',
    '..pPpppppppP..',
    '.pPpkpppppkPp.',
    '.pPppppppppPp.',
    '.pPpppppppppp.',
    'ppPPpPePPpPPpp',
    'cccccccccccccc',
    'cccccccccccccc',
    'ppPPpPPPpPPPpp',
    '.pPpppppppPpp.',
    '.pPpkpppppkPp.',
    '..pPpppppppP..',
    '...pppppppp...',
  ],
  // cupcake — frosting swirl + striped cup
  cupcake: [
    '.....pp.......',
    '....pPPp......',
    '...pPppPp.....',
    '..pPpyypPp....',
    '.pPppppppPp...',
    'pPpkppppkpPp..',
    'pPppppppppPp..',
    '.PPPPPPPPPP...',
    '.cyccyccyc....',
    '.ycyccyccy....',
    '.cyccyccyc....',
    '..yccyccy.....',
    '..ccyccyc.....',
    '...yyyyy......',
  ],
  // strawberry — decorative
  strawberry: [
    '......g.......',
    '....g g g.....',
    '...ggGgGgg....',
    '..rrrrrrrrr...',
    '.rrwrrrwrrrr..',
    '.rrrrrrrrrrr..',
    '.rwrrrwrrrwr..',
    '..rrrrrrrrr...',
    '..rwrrrwrrr...',
    '...rrrrrrr....',
    '...rwrrrwr....',
    '....rrrrr.....',
    '.....rrr......',
    '......r.......',
  ],
};

// PixelSprite — render a grid as crisp SVG
function PixelSprite({ name, size = 120, swap = null, style = {}, className = '' }) {
  const grid = SPRITES[name];
  if (!grid) return null;
  const cols = grid[0].length;
  const rows = grid.length;
  const colors = swap ? { ...SPRITE_COLORS, ...swap } : SPRITE_COLORS;
  const rects = [];
  for (let y = 0; y < rows; y++) {
    const line = grid[y];
    for (let x = 0; x < cols; x++) {
      const ch = line[x];
      if (ch === '.' || ch === ' ' || !colors[ch]) continue;
      rects.push(
        <rect key={x + '-' + y} x={x} y={y} width="1.02" height="1.02" fill={colors[ch]} />
      );
    }
  }
  return (
    <svg
      className={className}
      width={size}
      height={size * (rows / cols)}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {rects}
    </svg>
  );
}

// ----- product catalog -----
// swap maps recolor sprite bodies for flavor variety
const PRODUCTS = [
  {
    id: 'ichigo-daifuku', name: 'Ichigo Daifuku', sprite: 'mochi',
    swap: { w: '#ffd9e6', p: '#ff6f6f' }, price: 4.5, tag: 'bestseller',
    cat: 'mochi', flavor: 'Strawberry',
    blurb: 'Pillowy mochi hugging a whole sweet strawberry and red bean paste.',
  },
  {
    id: 'matcha-mochi', name: 'Matcha Mochi', sprite: 'mochi',
    swap: { w: '#dff0b8', p: '#5db272' }, price: 4.0, tag: 'new',
    cat: 'mochi', flavor: 'Matcha',
    blurb: 'Stone-ground matcha folded into chewy mochi. Earthy, not too sweet.',
  },
  {
    id: 'ramune-mochi', name: 'Ramune Mochi', sprite: 'mochi',
    swap: { w: '#d6efff', p: '#4ea7e0' }, price: 4.0, tag: null,
    cat: 'mochi', flavor: 'Soda',
    blurb: 'Fizzy-blue ramune flavor in a cloud of soft rice cake.',
  },
  {
    id: 'classic-dorayaki', name: 'Classic Dorayaki', sprite: 'dorayaki',
    swap: null, price: 3.5, tag: 'bestseller',
    cat: 'pancake', flavor: 'Red Bean',
    blurb: 'Honey pancakes pressed around a generous scoop of azuki bean.',
  },
  {
    id: 'taiyaki', name: 'Custard Taiyaki', sprite: 'taiyaki',
    swap: null, price: 3.0, tag: null,
    cat: 'pancake', flavor: 'Custard',
    blurb: 'Crispy fish-shaped waffle filled with warm vanilla custard.',
  },
  {
    id: 'hanami-dango', name: 'Hanami Dango', sprite: 'dango',
    swap: null, price: 3.75, tag: 'new',
    cat: 'mochi', flavor: 'Trio',
    blurb: 'Three chewy rice dumplings on a skewer — pink, white & matcha.',
  },
  {
    id: 'pink-donut', name: 'Sakura Donut', sprite: 'donut',
    swap: null, price: 3.25, tag: null,
    cat: 'pastry', flavor: 'Sakura',
    blurb: 'Fluffy ring donut under a blossom-pink glaze with rainbow sprinkles.',
  },
  {
    id: 'macaron', name: 'Peach Macaron', sprite: 'macaron',
    swap: null, price: 2.75, tag: null,
    cat: 'pastry', flavor: 'Peach',
    blurb: 'Crisp-then-chewy almond shells with silky peach ganache.',
  },
  {
    id: 'matcha-macaron', name: 'Matcha Macaron', sprite: 'macaron',
    swap: { p: '#bfe06e', P: '#5db272', e: '#dff0b8' }, price: 2.75, tag: null,
    cat: 'pastry', flavor: 'Matcha',
    blurb: 'Delicate matcha shells with white-chocolate matcha filling.',
  },
  {
    id: 'berry-cupcake', name: 'Berry Cupcake', sprite: 'cupcake',
    swap: null, price: 4.25, tag: 'bestseller',
    cat: 'pastry', flavor: 'Strawberry',
    blurb: 'Vanilla sponge crowned with a swirl of strawberry buttercream.',
  },
  {
    id: 'blue-cupcake', name: 'Ramune Cupcake', sprite: 'cupcake',
    swap: { p: '#8fd0f5', P: '#4ea7e0' }, price: 4.25, tag: null,
    cat: 'pastry', flavor: 'Soda',
    blurb: 'Cotton-soft cake topped with sky-blue ramune frosting.',
  },
  {
    id: 'lavender-mochi', name: 'Lavender Mochi', sprite: 'mochi',
    swap: { w: '#e7defb', p: '#a48cf0' }, price: 4.0, tag: null,
    cat: 'mochi', flavor: 'Lavender',
    blurb: 'Floral lavender-honey mochi. Calm in a bite-sized cloud.',
  },
];

Object.assign(window, { PixelSprite, SPRITES, SPRITE_COLORS, PRODUCTS });
