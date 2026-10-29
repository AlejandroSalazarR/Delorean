// Cada chibi: mitad izquierda (8 cols x 16 filas) espejada a 16x16 + `extra` para detalles
// asimétricos [x, y, letra] (cicatrices, pendientes, katanas). '.' = transparente.
// Convención: k contorno, ojos verticales de 2px en la columna 4.

const universe = (bg, pattern, dot, glyph, glyphColor) => ({ bg, pattern, dot, glyph, glyphColor })

export const CHIBIS = [
  {
    name: 'Pikachu',
    palette: { k: '#1d1d1d', y: '#FFD93B', r: '#E53935', o: '#7a4a1f', w: '#ffffff' },
    half: [
      '.kk.....', '.kk.....', '.kyk....', '..kyk...', '..kykkkk', '.kyyyyyy', '.kyyyyyy', '.kyykyyy',
      '.kyykyyy', '.kyrryyo', '.kyrrykk', '..kkyyyy', '..kyyyyy', '..kyyyyy', '..kyyyk.', '...kkkk.',
    ],
    extra: [[4, 7, 'k'], [4, 8, 'k'], [10, 4, 'y'], [14, 12, 'k'], [15, 11, 'k'], [15, 12, 'y'], [14, 13, 'y'], [14, 14, 'k'], [13, 13, 'k']],
    universe: universe(
      'radial-gradient(circle at 50% 110%, #ffb800 0%, #7a4a00 55%, #1b1200 100%)',
      'repeating-linear-gradient(115deg, rgba(255,255,255,.14) 0 6px, transparent 6px 28px)',
      'rgba(255,184,0,.35)', '⚡', '#FFE45C',
    ),
  },
  {
    name: 'Luffy',
    palette: { k: '#1d1d1d', h: '#1b1b2f', y: '#F4C20D', r: '#D32F2F', s: '#F5C9A0', b: '#2F5AA8', w: '#fff' },
    half: [
      '....kkkk', '...kyyyy', '..krrrrr', '..kyyyyy', 'kyyyyyyy', 'kkkkkkkk', '.khhhsss', '.kssksss',
      '.kssksss', '.kssssss', '.kssskkk', '..kkssss', '.krrssss', '.kbbbbbb', '.kssk...', '.kkkk...',
    ],
    extra: [[4, 9, 'r'], [8, 10, 'w'], [7, 10, 'w']],
    universe: universe(
      'linear-gradient(180deg, #7fd4ff 0%, #1a73c9 55%, #08305f 100%)',
      'repeating-radial-gradient(circle at 50% 100%, rgba(255,255,255,.18) 0 6px, transparent 6px 22px)',
      'rgba(255,255,255,.3)', '⚓', '#ffffff',
    ),
  },
  {
    name: 'Gengar',
    palette: { k: '#1d1d1d', p: '#7B4BB5', d: '#55308a', r: '#ff2a2a', w: '#ffffff' },
    half: [
      '.k..k..k', '.kk.kk.k', '.kppppkp', '.kpppppp', '.kpkkppp', '.kprrrpp', '.kprwrpp', '.kpppppp',
      '.kkkkkkk', '.kwwwwww', '.kkkkkkk', '..kppppp', '.kpppppp', '.kppppdd', '.kppk...', '.kkkk...',
    ],
    extra: [[4, 5, 'r'], [4, 6, 'w'], [11, 6, 'w']],
    universe: universe(
      'radial-gradient(circle at 50% 40%, #6b2fa0 0%, #2a0a47 55%, #0c0016 100%)',
      'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,.06) 0 10px, transparent 10px 30px)',
      'rgba(200,120,255,.35)', '☽', '#d9a8ff',
    ),
  },
  {
    name: 'Goku',
    palette: { k: '#1d1d1d', h: '#14141c', s: '#F5C9A0', o: '#FF7A00', b: '#2d5fd0' },
    half: [
      '..k..k.k', '..kk.kkk', '.khhkhhh', '.khhhhhh', '.khhhhhh', '.khhhsss', '.kssssss', '.kssksss',
      '.kssksss', '.kssssss', '.ksssskk', '..kkssss', '.kooobbb', '.koooooo', '.kbbbbbb', '.kook...',
    ],
    extra: [[4, 15, 'k'], [5, 15, 'k']],
    universe: universe(
      'radial-gradient(circle at 50% 55%, #fff6a8 0%, #ffb800 28%, #ff6b00 58%, #5a1800 100%)',
      'repeating-conic-gradient(from 0deg at 50% 55%, rgba(255,255,255,.22) 0 6deg, transparent 6deg 18deg)',
      'rgba(255,255,255,.3)', '✦', '#fff6a8',
    ),
  },
  {
    name: 'Vegeta',
    palette: { k: '#1d1d1d', h: '#14141c', s: '#F5C9A0', b: '#2d5fd0', w: '#f2f2f2', y: '#e8c000' },
    half: [
      '......kk', '.....khh', '....khhh', '...khhhh', '..khhhhh', '..khhhhs', '..khhhss', '..kkksss',
      '..ksksss', '..ksksss', '..ksssss', '...kkkkk', '.kbwwwww', '.kbwwwww', '.kbbbbbb', '.kwwk...',
    ],
    extra: [],
    universe: universe(
      'radial-gradient(circle at 50% 60%, #8fc0ff 0%, #2a3fc0 45%, #070a2a 100%)',
      'repeating-conic-gradient(from 0deg at 50% 60%, rgba(255,255,255,.18) 0 5deg, transparent 5deg 15deg)',
      'rgba(150,200,255,.35)', '✸', '#bfdcff',
    ),
  },
  {
    name: 'Naruto',
    palette: { k: '#1d1d1d', y: '#FFD53D', s: '#F5C9A0', b: '#2d5fd0', g: '#c9d1d9', o: '#FF7A00' },
    half: [
      '..k.k.k.', '..kykyky', '.kyyyyyy', '.kbbbbbb', '.kbbgggg', '.kbbbbbb', '.kysssss', '.kssksss',
      '.kssksss', '.kskssss', '.kssskkk', '..kkssss', '.koooooo', '.koooooo', '.kbbbbbb', '.kssk...',
    ],
    extra: [],
    universe: universe(
      'linear-gradient(180deg, #ffa13d 0%, #e5560a 55%, #6b1d00 100%)',
      'repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,.14) 0 8px, transparent 8px 22px)',
      'rgba(255,230,160,.35)', '◎', '#fff0c2',
    ),
  },
  {
    name: 'Tanjiro',
    palette: { k: '#1d1d1d', h: '#5a1a22', s: '#F5C9A0', r: '#d32f2f', g: '#1f8a4c', e: '#e8c000' },
    half: [
      '....kkkk', '...khhhh', '..khhhhh', '..khhhhh', '..khhhss', '..khhsss', '..ksssss', '..ksksss',
      '..ksksss', '..ksssss', '.eksssss', '..kssskk', '.kgkgkgk', '.kkgkgkg', '.kgkgkgk', '.kkkk...',
    ],
    extra: [[4, 5, 'r'], [4, 6, 'r']],
    universe: universe(
      'linear-gradient(180deg, #0b2a3a 0%, #14607f 60%, #ff6b3d 135%)',
      'repeating-radial-gradient(circle at 50% 100%, rgba(255,255,255,.16) 0 6px, transparent 6px 18px)',
      'rgba(120,220,255,.3)', '≈', '#9be4ff',
    ),
  },
  {
    name: 'Zoro',
    palette: { k: '#1d1d1d', g: '#3fae4a', s: '#F5C9A0', e: '#e8c000', w: '#f2f2f2', d: '#2a6f33', b: '#3a3a45', a: '#cfd8dc', n: '#5b3a1e' },
    half: [
      '....kkkk', '...kgggg', '..kggggg', '..kggggg', '..kgggss', '..ksssss', '..kkksss', '..ksksss',
      '..ksksss', '..ksssss', '..kssskk', '...kkkkk', '..kwwwww', '..kddddd', '..kbbbbb', '..kbbk..',
    ],
    // pendientes a la izquierda + tres katanas en la cadera
    extra: [
      [1, 7, 'e'], [1, 8, 'e'], [1, 9, 'e'],
      [0, 12, 'a'], [1, 13, 'a'], [0, 13, 'n'], [1, 14, 'n'], [0, 15, 'n'],
      [14, 12, 'e'], [14, 13, 'a'], [15, 13, 'n'], [14, 14, 'n'], [15, 15, 'n'],
    ],
    universe: universe(
      'linear-gradient(180deg, #0f2a14 0%, #2f7a3a 60%, #0a1a0d 100%)',
      'repeating-linear-gradient(-60deg, rgba(255,255,255,.13) 0 3px, transparent 3px 42px)',
      'rgba(160,255,170,.3)', '✕', '#b8ffbf',
    ),
  },
]
