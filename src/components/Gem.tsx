import { useId } from 'react'

/** Mix a #rrggbb colour toward white (l > 0) or black (l < 0). */
function shade(hex: string, l: number) {
  const n = parseInt(hex.slice(1), 16)
  const target = l > 0 ? 255 : 0
  const amt = l > 0 ? l * 0.6 : -l * 0.7
  const ch = (v: number) => Math.round(v + (target - v) * amt)
  const r = ch((n >> 16) & 255)
  const g = ch((n >> 8) & 255)
  const b = ch(n & 255)
  return `rgb(${r},${g},${b})`
}

type Props = {
  color: string
  size?: number
  shimmer?: boolean
  className?: string
  title?: string
}

/**
 * A brilliant-cut gem in side profile. Each facet is a separate polygon with
 * its own shade so it reads as cut stone at any size.
 */
export function Gem({ color, size = 120, shimmer = false, className, title }: Props) {
  const id = useId().replace(/:/g, '')
  // table, crown and pavilion points on a 200x180 box
  const T = [
    [62, 22],
    [100, 22],
    [138, 22],
  ]
  const G = [
    [8, 64],
    [44, 64],
    [80, 64],
    [120, 64],
    [156, 64],
    [192, 64],
  ]
  const P: [number, number] = [100, 172]
  const pt = (p: number[]) => p.join(',')

  // [points, lightness offset]
  const facets: [string, number][] = [
    // crown
    [`${pt(T[0])} ${pt(G[0])} ${pt(G[1])}`, 0.15],
    [`${pt(T[0])} ${pt(G[1])} ${pt(G[2])}`, 0.45],
    [`${pt(T[0])} ${pt(T[1])} ${pt(G[2])}`, 0.7],
    [`${pt(T[1])} ${pt(G[2])} ${pt(G[3])}`, 0.9],
    [`${pt(T[1])} ${pt(T[2])} ${pt(G[3])}`, 0.6],
    [`${pt(T[2])} ${pt(G[3])} ${pt(G[4])}`, 0.35],
    [`${pt(T[2])} ${pt(G[4])} ${pt(G[5])}`, 0.05],
    // pavilion
    [`${pt(G[0])} ${pt(G[1])} ${pt(P)}`, -0.35],
    [`${pt(G[1])} ${pt(G[2])} ${pt(P)}`, -0.05],
    [`${pt(G[2])} ${pt(G[3])} ${pt(P)}`, 0.3],
    [`${pt(G[3])} ${pt(G[4])} ${pt(P)}`, -0.1],
    [`${pt(G[4])} ${pt(G[5])} ${pt(P)}`, -0.45],
  ]

  return (
    <svg
      className={className}
      width={size}
      height={size * 0.9}
      viewBox="0 0 200 180"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
          {shimmer && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 -1"
              to="1 1"
              dur="3.6s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <polygon points={`${pt(T[0])} ${pt(T[2])} ${pt(G[5])} ${pt(P)} ${pt(G[0])}`} />
        </clipPath>
      </defs>
      <g>
        {facets.map(([points, l], i) => (
          <polygon
            key={i}
            points={points}
            fill={shade(color, l)}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        ))}
        {shimmer && (
          <rect x="0" y="0" width="200" height="180" fill={`url(#${id}-sheen)`} clipPath={`url(#${id}-clip)`} />
        )}
      </g>
    </svg>
  )
}
