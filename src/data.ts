import { useEffect, useState } from 'react'
import { ROMAN, TIERS, type Tier } from './config'

export type Solo = { tier: Tier; rank: string; lp: number; wins: number; losses: number; hotStreak: boolean }
export type RecentGame = {
  id: string
  endedAt: number
  durationSec: number
  champion: string
  win: boolean
  kills: number
  deaths: number
  assists: number
}
export type Player = {
  gameName: string
  tagLine: string
  level: number
  profileIconId: number
  solo: Solo | null
  recent: RecentGame[]
}
export type RankData = {
  fetchedAt: string
  checkedAt?: string
  ddragonVersion: string
  players: { ayman: Player; amongusly: Player }
}

export function useRankData() {
  const [data, setData] = useState<RankData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    const base = import.meta.env.BASE_URL
    Promise.all([
      fetch(`${base}data/rank.json`, { cache: 'no-store' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<RankData>
      }),
      fetch(`${base}data/checked.json`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ])
      .then(([rank, checked]) => alive && setData({ ...rank, checkedAt: checked?.checkedAt ?? rank.fetchedAt }))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [])

  return { data, error }
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

/* ---------- rank math ---------- */

export const tierIndex = (t: Tier) => TIERS.indexOf(t)
export const isDiamondPlus = (t: Tier) => tierIndex(t) >= tierIndex('DIAMOND')

/** A continuous ladder score: one unit per division, LP as the fraction. */
export function ladderScore(tier: Tier, div: number, lp: number) {
  const apex = tierIndex(tier) >= tierIndex('MASTER')
  return tierIndex(tier) * 4 + (apex ? 0 : 4 - div) + Math.min(lp, 100) / 100
}

/** LP to Diamond IV 0 LP under the current ladder (no promos). */
export function lpToDiamond(solo: Solo) {
  const t = tierIndex(solo.tier)
  const d = tierIndex('DIAMOND')
  if (t >= d) return 0
  const divsBelow = (d - t - 1) * 4 + (ROMAN[solo.rank] ?? 4)
  return divsBelow * 100 - solo.lp
}

export const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase()
export const rankLabel = (s: Pick<Solo, 'tier' | 'rank'>) =>
  tierIndex(s.tier) >= tierIndex('MASTER') ? titleCase(s.tier) : `${titleCase(s.tier)} ${s.rank}`

/* ---------- time ---------- */

/** Calendar difference in Eastern-ish time (fixed UTC-5; good enough for a joke). */
export function calendarDiff(from: number, to: number) {
  const shift = 5 * 3600_000
  const a = new Date(from - shift)
  const b = new Date(to - shift)
  let years = b.getUTCFullYear() - a.getUTCFullYear()
  let months = b.getUTCMonth() - a.getUTCMonth()
  let days = b.getUTCDate() - a.getUTCDate()
  let hours = b.getUTCHours() - a.getUTCHours()
  let minutes = b.getUTCMinutes() - a.getUTCMinutes()
  let seconds = b.getUTCSeconds() - a.getUTCSeconds()
  if (seconds < 0) (seconds += 60), minutes--
  if (minutes < 0) (minutes += 60), hours--
  if (hours < 0) (hours += 24), days--
  if (days < 0) {
    // borrow the length of the month before `to`
    days += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate()
    months--
  }
  if (months < 0) (months += 12), years--
  return { years, months, days, hours, minutes, seconds }
}

export function timeAgo(ms: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ms) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`
  const h = Math.round(m / 60)
  if (h < 36) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.round(h / 24)
  return `${d} day${d === 1 ? '' : 's'} ago`
}

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const ddragon = (v: string, path: string) => `https://ddragon.leagueoflegends.com/cdn/${v}/img/${path}`
