/* sprites.jsx — pixel-art treat sprites + product catalog
   Each sprite is an array of equal-length strings; each char maps to a
   palette color. '.' = transparent. Rendered as crisp 1x1 SVG rects. */

// shared palette for sprite chars
export const SPRITE_COLORS: Record<string, string> = {
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
export const SPRITES: Record<string, string[]> = {
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

export type SpriteSwap = Record<string, string>;
