import { useMemo } from 'react'

const SIZE = 16

// Espeja la mitad izquierda (8 cols) a 16x16, aplica `extra` [x, y, letra] y dibuja un <rect> por pixel.
function buildRects(half, palette, extra = []) {
  const grid = Array.from({ length: SIZE }, (_, y) => {
    const left = (half[y] || '').padEnd(8, '.').slice(0, 8)
    return [...(left + [...left].reverse().join(''))]
  })
  extra.forEach(([x, y, c]) => { grid[y][x] = c })

  const rects = []
  grid.forEach((row, y) =>
    row.forEach((c, x) => {
      if (palette[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[c]} />)
    }),
  )
  return rects
}

export default function PixelSprite({ chibi, className = '', label, style }) {
  const rects = useMemo(() => buildRects(chibi.half, chibi.palette, chibi.extra), [chibi])
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} shapeRendering="crispEdges" className={className} style={style} role={label === '' ? undefined : 'img'} aria-label={label === '' ? undefined : label || chibi.name}>
      {rects}
    </svg>
  )
}
