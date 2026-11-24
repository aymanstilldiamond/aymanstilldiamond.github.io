import { AYMAN_OPGG, PEAK_2026, TIER_COLOR } from '../config'
import { ddragon, fmt, isDiamondPlus, lpToDiamond, rankLabel, timeAgo, useNow, type RankData } from '../data'
import { ExhibitHeader } from './Ascension'
import { Gem } from './Gem'

export function Reality({ data, error }: { data: RankData | null; error: boolean }) {
  const now = useNow(30_000)

  return (
    <section className="exhibit" id="reality">
      <ExhibitHeader letter="B" title="Present Day" sub="Live from the Riot Games API. Facts don’t care about feelings." />
      {!data ? (
        <div className="reality-card reality-loading">{error ? 'Riot’s servers are protecting him. Try again later.' : 'Consulting the ladder…'}</div>
      ) : (
        <RealityCard data={data} now={now} />
      )}
    </section>
  )
}

function RealityCard({ data, now }: { data: RankData; now: number }) {
  const p = data.players.ayman
  const s = p.solo
  const v = data.ddragonVersion

  if (!s) {
    return (
      <div className="reality-card">
        <p className="reality-verdict">Unranked. He finally meant it.</p>
      </div>
    )
  }

  const diamond = isDiamondPlus(s.tier)
  const games = s.wins + s.losses
  const wr = (s.wins / games) * 100
  const toGo = lpToDiamond(s)
  const avgSec = p.recent.length ? p.recent.reduce((a, g) => a + g.durationSec, 0) / p.recent.length : 30 * 60
  const hours = (games * avgSec) / 3600
  const last = p.recent[0]
  const color = TIER_COLOR[s.tier]

  return (
    <div className="reality-card" style={{ ['--tier' as string]: color }}>
      <div className={`stamp ${diamond ? 'stamp-good' : ''}`} aria-hidden="true">
        {diamond ? 'Actually Diamond?!' : 'Not Diamond'}
      </div>

      <div className="reality-top">
        <a className="summoner" href={AYMAN_OPGG} target="_blank" rel="noreferrer">
          <img
            className="summoner-icon"
            src={ddragon(v, `profileicon/${p.profileIconId}.png`)}
            alt=""
            width={56}
            height={56}
          />
          <span>
            <span className="summoner-name">
              {p.gameName}
              <span className="summoner-tag">#{p.tagLine}</span>
            </span>
            <span className="summoner-level">Level {p.level} · NA</span>
          </span>
        </a>
      </div>

      <div className="rank-row">
        <Gem color={color} size={132} shimmer className="rank-gem" />
        <div className="rank-text">
          <span className="rank-label">Current solo queue rank</span>
          <span className="rank-name" style={{ color }}>
            {rankLabel(s)}
          </span>
          <span className="rank-lp mono">{s.lp} LP</span>
        </div>
      </div>

      {!diamond && (
        <div className="lp-meter">
          <div className="lp-meter-head">
            <span>
              <strong className="mono">{toGo}</strong> LP from the rank he says he has
            </span>
            <span className="muted">Diamond IV</span>
          </div>
          <div className="lp-track" aria-hidden="true">
            <div className="lp-fill" style={{ width: `${Math.max(2, Math.min(100, 100 - (toGo / 400) * 100))}%` }} />
            {[25, 50, 75].map((x) => (
              <span key={x} className="lp-tick" style={{ left: `${x}%` }} />
            ))}
            <Gem color={TIER_COLOR.DIAMOND} size={26} className="lp-goal" />
          </div>
          <div className="lp-meter-foot muted">One tier of runway shown. He has been in this general area since 2020.</div>
        </div>
      )}

      <dl className="stats">
        <div className="stat">
          <dt>Season record</dt>
          <dd>
            <span className="mono">
              {s.wins}W {s.losses}L
            </span>
            <small>{wr.toFixed(1)}% win rate</small>
          </dd>
        </div>
        <div className="stat">
          <dt>Ranked games this season</dt>
          <dd>
            <span className="mono">{fmt(games)}</span>
            <small>for a man who retired in 2021</small>
          </dd>
        </div>
        <div className="stat">
          <dt>Hours in ranked this season</dt>
          <dd>
            <span className="mono">~{fmt(hours)}</span>
            <small>≈ {fmt(hours / 24, 1)} days, no sleep</small>
          </dd>
        </div>
        <div className="stat">
          <dt>Last ranked game</dt>
          <dd>
            <span>{last ? timeAgo(last.endedAt, now) : '—'}</span>
            <small>“no more ranked”</small>
          </dd>
        </div>
        <div className="stat stat-wide">
          <dt>Peak this season</dt>
          <dd>
            <span style={{ color: TIER_COLOR.DIAMOND }}>
              {rankLabel({ tier: PEAK_2026.tier, rank: ['', 'I', 'II', 'III', 'IV'][PEAK_2026.div] })} · {PEAK_2026.lp} LP
            </span>
            <small>He touched it. It did not stay. (per op.gg)</small>
          </dd>
        </div>
      </dl>

      {p.recent.length > 0 && (
        <div className="recent">
          <h3 className="recent-title">Recent evidence</h3>
          <ul className="recent-list">
            {p.recent.map((g) => (
              <li key={g.id} className={`game ${g.win ? 'game-w' : 'game-l'}`}>
                <img src={ddragon(v, `champion/${g.champion}.png`)} alt={g.champion} width={44} height={44} loading="lazy" />
                <span className="game-result">{g.win ? 'Win' : 'Loss'}</span>
                <span className="game-kda mono">
                  {g.kills}/{g.deaths}/{g.assists}
                </span>
                <span className="game-when">{timeAgo(g.endedAt, now)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="checked muted">
        Riot API · refreshed every ~30 minutes · last checked {timeAgo(Date.parse(data.checkedAt ?? data.fetchedAt), now)}
      </p>
    </div>
  )
}
