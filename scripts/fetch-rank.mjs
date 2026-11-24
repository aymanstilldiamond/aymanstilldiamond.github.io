// Pulls live ranked data from the Riot API and writes public/data/rank.json.
//
// Runs in GitHub Actions on a schedule (the key lives in the RIOT_API_KEY repo
// secret and never reaches the browser). Run it locally with:
//
//   RIOT_API_KEY=RGAPI-... npm run fetch-rank
//
// If anything fails, the previous rank.json is left untouched so the site keeps
// showing the last good snapshot instead of breaking.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/data/rank.json')

const PLAYERS = {
  ayman: { gameName: 'Feymanxop', tagLine: 'NA2' },
  amongusly: { gameName: 'Amongusly', tagLine: '111' },
}

const REGION = 'https://americas.api.riotgames.com'
const PLATFORM = 'https://na1.api.riotgames.com'
const SOLO_QUEUE = 420
const RECENT_MATCHES = 5

const KEY = process.env.RIOT_API_KEY
if (!KEY) {
  console.warn('RIOT_API_KEY is not set; keeping the existing rank.json.')
  process.exit(0)
}

async function riot(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'X-Riot-Token': KEY } })
    if (res.status === 429) {
      const wait = Number(res.headers.get('retry-after') ?? 2)
      await new Promise((r) => setTimeout(r, wait * 1000))
      continue
    }
    if (!res.ok) throw new Error(`${res.status} ${url.replace(/\?.*/, '')}`)
    return res.json()
  }
  throw new Error(`rate limited: ${url}`)
}

async function player({ gameName, tagLine }, withMatches) {
  const account = await riot(
    `${REGION}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
  )
  const { puuid } = account
  const [summoner, entries] = await Promise.all([
    riot(`${PLATFORM}/lol/summoner/v4/summoners/by-puuid/${puuid}`),
    riot(`${PLATFORM}/lol/league/v4/entries/by-puuid/${puuid}`),
  ])
  const soloEntry = entries.find((e) => e.queueType === 'RANKED_SOLO_5x5')

  let recent = []
  if (withMatches) {
    const ids = await riot(
      `${REGION}/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${SOLO_QUEUE}&count=${RECENT_MATCHES}`,
    )
    for (const id of ids) {
      const match = await riot(`${REGION}/lol/match/v5/matches/${id}`)
      const me = match.info.participants.find((p) => p.puuid === puuid)
      if (!me) continue
      recent.push({
        id,
        endedAt: match.info.gameEndTimestamp ?? match.info.gameStartTimestamp + match.info.gameDuration * 1000,
        durationSec: match.info.gameDuration,
        champion: me.championName,
        win: me.win,
        kills: me.kills,
        deaths: me.deaths,
        assists: me.assists,
      })
    }
  }

  return {
    gameName: account.gameName,
    tagLine: account.tagLine,
    level: summoner.summonerLevel,
    profileIconId: summoner.profileIconId,
    solo: soloEntry
      ? {
          tier: soloEntry.tier,
          rank: soloEntry.rank,
          lp: soloEntry.leaguePoints,
          wins: soloEntry.wins,
          losses: soloEntry.losses,
          hotStreak: soloEntry.hotStreak,
        }
      : null,
    recent,
  }
}

async function main() {
  const versions = await fetch('https://ddragon.leagueoflegends.com/api/versions.json').then((r) => r.json())
  const [ayman, amongusly] = await Promise.all([
    player(PLAYERS.ayman, true),
    player(PLAYERS.amongusly, false),
  ])

  const next = { ddragonVersion: versions[0], players: { ayman, amongusly } }

  // Only bump fetchedAt-independent content when something actually changed,
  // so the scheduled job doesn't commit a new file every 30 minutes.
  let previous = null
  try {
    previous = JSON.parse(await readFile(OUT, 'utf8'))
  } catch {}
  const same =
    previous && JSON.stringify({ ...previous, fetchedAt: undefined }) === JSON.stringify({ ...next, fetchedAt: undefined })

  const now = new Date().toISOString()
  const out = { fetchedAt: same ? previous.fetchedAt : now, ...next }
  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n')
  // checked.json is gitignored: it changes every run and only ships in the build.
  await writeFile(resolve(dirname(OUT), 'checked.json'), JSON.stringify({ checkedAt: now }) + '\n')
  const s = ayman.solo
  console.log(
    same ? 'No change.' : 'Updated.',
    `Ayman: ${s ? `${s.tier} ${s.rank} ${s.lp} LP` : 'unranked'}`,
    `| Amongusly: ${amongusly.solo ? `${amongusly.solo.tier} ${amongusly.solo.rank} ${amongusly.solo.lp} LP` : 'unranked'}`,
  )
}

main().catch((err) => {
  console.warn(`Riot fetch failed (${err.message}); keeping the existing rank.json.`)
  process.exit(0)
})
