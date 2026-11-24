import { useEffect, useRef, useState } from 'react'
import { AMONGUSLY_OPGG, TIER_COLOR } from '../config'
import { ddragon, isDiamondPlus, rankLabel, type RankData } from '../data'
import { Gem } from './Gem'

function Confetti({ fire }: { fire: boolean }) {
  const [pieces] = useState(() =>
    Array.from({ length: 46 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.9,
      dur: 2.4 + Math.random() * 1.8,
      size: 7 + Math.random() * 9,
      drift: (Math.random() - 0.5) * 160,
      spin: (Math.random() - 0.5) * 900,
      hue: ['#8fc4ff', '#c9e6ff', '#ffffff', '#b8a2ff', '#7ef0ff'][i % 5],
    })),
  )
  if (!fire) return null
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.hue,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--drift' as string]: `${p.drift}px`,
            ['--spin' as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}

export function Amongusly({ data }: { data: RankData | null }) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const p = data?.players.amongusly
  const s = p?.solo
  const made = s ? isDiamondPlus(s.tier) : true
  const a = data?.players.ayman.solo
  const aymanGames = a ? a.wins + a.losses : null
  const color = s ? TIER_COLOR[s.tier] : TIER_COLOR.DIAMOND

  const cushion = !s
    ? ''
    : !made
      ? ''
      : s.lp === 0
        ? 'Zero LP. Not one point of cushion. Breathe on him wrong and he’s Emerald.'
        : s.lp < 30
          ? `${s.lp} LP of cushion. Thin, but it’s there.`
          : `${s.lp} LP of cushion. Comfortable, even.`

  return (
    <section className="exhibit special" id="amongusly" ref={ref}>
      <Confetti fire={seen && made && !window.matchMedia('(prefers-reduced-motion: reduce)').matches} />
      <div className="special-ribbon">Special Exhibit</div>

      {made ? (
        <>
          <h2 className="special-title">
            Congratulations,
            <br />
            <span className="special-name">Amongusly.</span>
          </h2>
          <p className="special-lede">
            He said <q>Im a failure if im not dia by end of year.</q> He is not a failure. He made it before the deadline.
          </p>
        </>
      ) : (
        <>
          <h2 className="special-title">
            Congratulations, Amongusly
            <br />
            <span className="special-name special-pending">(under review)</span>
          </h2>
          <p className="special-lede">
            He touched Diamond. The ladder took it back. Welcome to the Feymanxop Memorial, Amongusly. There’s a lot of room
            in here.
          </p>
        </>
      )}

      <a className="special-card" href={AMONGUSLY_OPGG} target="_blank" rel="noreferrer" style={{ ['--tier' as string]: color }}>
        <Gem color={color} size={96} shimmer />
        <span className="special-card-text">
          <span className="special-card-who">
            {data && p ? (
              <>
                <img src={ddragon(data.ddragonVersion, `profileicon/${p.profileIconId}.png`)} alt="" width={22} height={22} />
                {p.gameName}#{p.tagLine}
              </>
            ) : (
              'Amongusly#111'
            )}
          </span>
          <span className="special-card-rank" style={{ color }}>
            {s ? rankLabel(s) : 'Diamond IV'}
            <span className="mono"> · {s ? s.lp : 0} LP</span>
          </span>
          <span className="special-card-live">live from Riot</span>
        </span>
      </a>

      {cushion && <p className="special-cushion">{cushion}</p>}

      <div className="special-compare">
        <div>
          <span className="special-compare-label">Amongusly promised</span>
          <span className="special-compare-quote">“Diamond by end of year”</span>
          <span className="special-compare-value">{made ? 'Delivered.' : 'Delivered, briefly.'}</span>
        </div>
        <div>
          <span className="special-compare-label">Ayman promised</span>
          <span className="special-compare-quote">“no more ranked”</span>
          <span className="special-compare-value">{aymanGames ? `${aymanGames.toLocaleString('en-US')} ranked games this season.` : 'Still queuing.'}</span>
        </div>
      </div>
      <p className="special-sign">Ayman: this is what it looks like. Take notes.</p>
    </section>
  )
}
