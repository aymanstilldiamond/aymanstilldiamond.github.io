import { useEffect, useRef } from 'react'
import { PEAK_2026, ROMAN, SEASON_HISTORY, TIER_COLOR, TIERS, type Tier } from '../config'
import { ladderScore, rankLabel, type Solo } from '../data'
import { ExhibitHeader } from './Ascension'

const W = 760
const H = 380
const PAD = { l: 92, r: 28, t: 34, b: 54 }
const Y_MIN = ladderScore('GOLD', 4, 0) // 12
const Y_MAX = ladderScore('DIAMOND', 2, 0) // 26

const x = (i: number, n: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r)
const y = (score: number) => PAD.t + (1 - (score - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b)

type Pt = { season: string; tier: Tier; div: number; lp: number; live?: boolean; note?: string }

export function Plateau({ current }: { current: Solo | null }) {
  // On narrow screens the chart scrolls sideways; start at the live end.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [current])
  const pts: Pt[] = [...SEASON_HISTORY]
  if (current) pts.push({ season: '2026', tier: current.tier, div: ROMAN[current.rank] ?? 4, lp: current.lp, live: true })
  const n = pts.length
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i, n).toFixed(1)},${y(ladderScore(p.tier, p.div, p.lp)).toFixed(1)}`).join(' ')
  const area = `${line} L${x(n - 1, n)},${H - PAD.b} L${x(0, n)},${H - PAD.b} Z`
  const diamondY = y(ladderScore('DIAMOND', 4, 0))
  const bands: Tier[] = ['GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND']
  const i2021 = pts.findIndex((p) => p.season === '2021')

  return (
    <section className="exhibit" id="plateau">
      <ExhibitHeader letter="C" title="The Plateau" sub="Where each season ended. The line he says he lives above." />

      <div className="chart-card">
        <div className="chart-scroll" ref={scroller}>
          <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Season-end ranks from 2020 to now; none reach Diamond.">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8fc4ff" stopOpacity="0.28" />
                <stop offset="1" stopColor="#8fc4ff" stopOpacity="0" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* tier bands */}
            {bands.map((t) => {
              const lo = Math.max(Y_MIN, TIERS.indexOf(t) * 4)
              const hi = Math.min(Y_MAX, TIERS.indexOf(t) * 4 + 4)
              if (hi <= lo) return null
              return (
                <g key={t}>
                  <rect x={PAD.l} y={y(hi)} width={W - PAD.l - PAD.r} height={y(lo) - y(hi)} fill={TIER_COLOR[t]} opacity={t === 'DIAMOND' ? 0.1 : 0.045} />
                  <text x={PAD.l - 12} y={(y(lo) + y(hi)) / 2 + 4} textAnchor="end" className="chart-tier" fill={TIER_COLOR[t]}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </text>
                </g>
              )
            })}

            {/* the line */}
            <line x1={PAD.l} x2={W - PAD.r} y1={diamondY} y2={diamondY} className="diamond-line" filter="url(#glow)" />
            <text x={PAD.l + 10} y={diamondY - 9} className="diamond-line-label">
              THE DIAMOND LINE · crossed at season end: 0 times
            </text>

            <path d={area} fill="url(#area)" />
            <path d={line} className="chart-path" />

            {/* Feb 2021 ghost: the afternoon it happened */}
            {i2021 >= 0 && (
              <g className="ghost">
                <line x1={x(i2021, n)} x2={x(i2021, n)} y1={y(ladderScore('DIAMOND', 4, 0))} y2={y(ladderScore('PLATINUM', 1, 75))} />
                <circle cx={x(i2021, n)} cy={diamondY} r="7" />
                <text x={x(i2021, n) + 12} y={diamondY + 20}>
                  Feb 22: D4 (“no more ranked”)
                </text>
              </g>
            )}

            {/* 2026 peak */}
            {current && (
              <g className="ghost ghost-peak">
                <circle cx={x(n - 1, n)} cy={y(ladderScore(PEAK_2026.tier, PEAK_2026.div, PEAK_2026.lp))} r="6" />
                <text x={x(n - 1, n) - 12} y={y(ladderScore(PEAK_2026.tier, PEAK_2026.div, PEAK_2026.lp)) - 10} textAnchor="end">
                  2026 peak: D3, briefly
                </text>
              </g>
            )}

            {pts.map((p, i) => {
              const cx = x(i, n)
              const cy = y(ladderScore(p.tier, p.div, p.lp))
              return (
                <g key={p.season} className={p.live ? 'pt pt-live' : 'pt'}>
                  {p.live && <circle cx={cx} cy={cy} r="12" className="pt-pulse" />}
                  <circle cx={cx} cy={cy} r="5.5" fill={TIER_COLOR[p.tier]} />
                  <title>{`${p.season}: ${rankLabel({ tier: p.tier, rank: ['', 'I', 'II', 'III', 'IV'][p.div] })} ${p.lp} LP`}</title>
                  <text x={cx} y={H - PAD.b + 22} textAnchor="middle" className="chart-x">
                    {p.season}
                  </text>
                  {p.live && (
                    <text x={cx} y={H - PAD.b + 38} textAnchor="middle" className="chart-x chart-live">
                      live
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <p className="chart-note muted">
          Season-end ranks per op.gg. Emerald was wedged in between Platinum and Diamond in mid-2023, so the
          pre-2023 seasons were a little closer than they look. Still: zero.
        </p>
      </div>
    </section>
  )
}
