import { CHAT, TIER_COLOR } from '../config'
import { fmt, type Player } from '../data'
import { Gem } from './Gem'

const AUTHORS = {
  ayman: { name: 'Super Senior Blanco', color: '#c58af9', avatar: 'avatar-sky' },
  kiron: { name: 'Kiron', color: '#b48cff', avatar: 'avatar-kiron', tag: 'meep' },
} as const

function PromoCard() {
  return (
    <div className="promo-card">
      <div className="promo-embed-label">op.gg · screenshot</div>
      <div className="promo-body">
        <Gem color={TIER_COLOR.PLATINUM} size={68} />
        <div>
          <div className="promo-queue">Ranked Solo</div>
          <div className="promo-tier">Platinum 1</div>
          <div className="promo-lp">
            <b>100 LP</b> / 138W 102L
          </div>
          <div className="promo-wr">Win Ratio 58%</div>
          <div className="promo-series-label">Series In Progress</div>
          <div className="promo-series">
            <span className="w">W</span>
            <span className="w">W</span>
            <span className="l">L</span>
            <span className="l">L</span>
            <span className="pending" title="The decider" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Ascension({ ayman }: { ayman: Player | null }) {
  const games = ayman?.solo ? ayman.solo.wins + ayman.solo.losses : null

  return (
    <section className="exhibit" id="ascension">
      <ExhibitHeader letter="A" title="The Ascension" sub="Recovered from Discord. February 22, 2021." />

      <div className="discord" role="log" aria-label="Discord messages from February 22, 2021">
        <div className="discord-day">
          <span>February 22, 2021</span>
        </div>
        {CHAT.map((block, i) => {
          const a = AUTHORS[block.author]
          const final = i === CHAT.length - 1
          return (
            <div className={`msg ${final ? 'msg-final' : ''}`} key={i}>
              <div className={`avatar ${a.avatar}`} aria-hidden="true" />
              <div className="msg-main">
                <div className="msg-head">
                  <span className="msg-name" style={{ color: a.color }}>
                    {a.name}
                  </span>
                  {'tag' in a && <span className="msg-tag">🍃 {a.tag}</span>}
                  <span className="msg-time">{block.time}</span>
                </div>
                {block.promoCard && <PromoCard />}
                {block.lines.map((line, j) => (
                  <p className="msg-line" key={j}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="plaque">
        <p className="plaque-quote">“no more ranked”</p>
        <p className="plaque-attr">Feymanxop, 2:28 PM, upon reaching Diamond IV</p>
        <div className="plaque-rule" />
        <p className="plaque-fact">
          Ranked games he has played <em>this season alone</em>:{' '}
          <strong className="mono">{games === null ? '…' : fmt(games)}</strong>
        </p>
      </div>
    </section>
  )
}

export function ExhibitHeader({ letter, title, sub }: { letter: string; title: string; sub: string }) {
  return (
    <div className="exhibit-head">
      <span className="exhibit-letter">Exhibit {letter}</span>
      <h2 className="exhibit-title">{title}</h2>
      <p className="exhibit-sub">{sub}</p>
    </div>
  )
}
