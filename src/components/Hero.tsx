import { ASCENSION, TIER_COLOR } from '../config'
import { calendarDiff, fmt, useNow } from '../data'
import { Gem } from './Gem'

const pad = (n: number) => String(n).padStart(2, '0')

export function Hero() {
  const now = useNow(1000)
  const d = calendarDiff(ASCENSION, now)
  const elapsed = now - ASCENSION
  const units: [string, string][] = [
    [String(d.years), d.years === 1 ? 'year' : 'years'],
    [String(d.months), d.months === 1 ? 'month' : 'months'],
    [String(d.days), d.days === 1 ? 'day' : 'days'],
    [pad(d.hours), 'hours'],
    [pad(d.minutes), 'minutes'],
    [pad(d.seconds), 'seconds'],
  ]

  return (
    <header className="hero">
      <div className="hero-gem-wrap">
        <div className="hero-halo" />
        <div className="hero-rays" />
        <Gem color={TIER_COLOR.DIAMOND} size={210} shimmer className="hero-gem" title="A diamond" />
      </div>

      <p className="eyebrow">The Feymanxop Memorial · Est. February 22, 2021</p>

      <h1 className="hero-title">
        Ayman is <span className="still">still</span>
        <br />
        <span className="diamond-word" data-text="Diamond">
          Diamond
        </span>
        <sup className="asterisk">*</sup>
      </h1>

      <p className="hero-lede">and has been for</p>

      <div className="timer" role="timer" aria-live="off" aria-label={`${d.years} years, ${d.months} months, ${d.days} days`}>
        {units.map(([value, label]) => (
          <div className="timer-cell" key={label}>
            <span className="timer-value">{value}</span>
            <span className="timer-label">{label}</span>
          </div>
        ))}
      </div>

      <p className="timer-totals">
        <span>{fmt(Math.floor(elapsed / 86_400_000))} days</span>
        <span aria-hidden="true">·</span>
        <span>{fmt(Math.floor(elapsed / 3_600_000))} hours</span>
        <span aria-hidden="true">·</span>
        <span className="mono">{fmt(Math.floor(elapsed / 1000))} seconds</span>
      </p>

      <p className="footnote-star">
        <sup>*</sup> Self-reported. Riot Games disagrees.{' '}
        <a href="#reality">See Exhibit B ↓</a>
      </p>
    </header>
  )
}
