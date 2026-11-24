import { ASCENSION, COULD_HAVE, VOYAGER_KMS, type CouldHave as Item } from '../config'
import { fmt, useNow } from '../data'
import { ExhibitHeader } from './Ascension'

function Figure({ item, elapsed }: { item: Item; elapsed: number }) {
  if (item.icon === '🛰️') {
    return (
      <div className="ch-figure">
        <span className="ch-count mono">{fmt((elapsed / 1000) * VOYAGER_KMS)}</span>
        <span className="ch-unit">km</span>
      </div>
    )
  }
  if (!item.every) return null
  const raw = elapsed / item.every
  if (item.percent) {
    return (
      <div className="ch-figure">
        <span className="ch-count mono">{(raw * 100).toFixed(item.decimal ?? 1)}%</span>
        <span className="ch-unit">{item.unit}</span>
        <Progress value={raw} />
      </div>
    )
  }
  if (item.decimal) {
    return (
      <div className="ch-figure">
        <span className="ch-count mono">{raw.toFixed(item.decimal)}</span>
        <span className="ch-unit">{item.unit}</span>
      </div>
    )
  }
  const whole = Math.floor(raw)
  return (
    <div className="ch-figure">
      <span className="ch-count mono">×{whole}</span>
      <span className="ch-unit">{item.unit}</span>
      <Progress value={raw - whole} label={`${Math.round((raw - whole) * 100)}% into the next one`} />
    </div>
  )
}

function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="ch-progress">
      <div className="ch-track">
        <div className="ch-fill" style={{ width: `${Math.min(100, value * 100)}%` }} />
      </div>
      {label && <span className="ch-progress-label">{label}</span>}
    </div>
  )
}

export function CouldHave() {
  const now = useNow(1000)
  const elapsed = now - ASCENSION
  const last = COULD_HAVE.length - 1

  return (
    <section className="exhibit" id="instead">
      <ExhibitHeader
        letter="D"
        title="In the Time Since"
        sub="A partial list of things a person could have done while Ayman was “Diamond.” Counters are live."
      />
      <ol className="ch-list">
        {COULD_HAVE.map((item, i) => (
          <li key={item.title} className={`ch ${i === last ? 'ch-finale' : ''}`} style={{ ['--i' as string]: i }}>
            <span className="ch-icon" aria-hidden="true">
              {item.icon}
            </span>
            <div className="ch-body">
              <h3 className="ch-title">{item.title}</h3>
              <Figure item={item} elapsed={elapsed} />
              <p className="ch-quip">{item.quip}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
