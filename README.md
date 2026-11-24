# Ayman is still Diamond*

On **February 22, 2021 at 2:28 PM ET**, Ayman won his Plat 1 promos, hit Diamond 4, and typed
"lets goo / no more ranked." He has been Diamond ever since. \*According to Ayman.

Live at **https://aymanstilldiamond.github.io**. Made in jest.

## How it works

- React + TypeScript + Vite, hosted on GitHub Pages.
- `.github/workflows/deploy.yml` runs every 30 minutes: `scripts/fetch-rank.mjs` pulls Ayman's and
  Amongusly's ranked data from the Riot API, writes `public/data/rank.json`, commits it if it
  changed, then builds and deploys.
- The Riot key lives only in the `RIOT_API_KEY` repo secret. It never reaches the browser.
- If Riot is down or the key is bad, the fetch keeps the last snapshot and the site still deploys.

## Run locally

```bash
npm install
RIOT_API_KEY=RGAPI-... npm run fetch-rank   # optional: refresh the snapshot
npm run dev
```

## Where things live

| What | File |
| --- | --- |
| The moment, season history, "could have" list, Discord log | `src/config.ts` |
| Riot API fetch (players, queue) | `scripts/fetch-rank.mjs` |
| Sections | `src/components/` |
| Theme | `src/index.css` |
| Link preview + icon sources | `scripts/og/` → `public/img/` |

Season-end history comes from op.gg (Riot's API has no rank history); update `SEASON_HISTORY`
in `src/config.ts` when a season ends.

## Maintenance notes

- GitHub pauses scheduled workflows after 60 days without repo activity. The bot commits rank
  changes, so as long as Ayman keeps queuing (he will), it stays alive. If it pauses, re-enable it
  under Actions.
- Rotating the Riot key: `gh secret set RIOT_API_KEY --repo aymanstilldiamond/aymanstilldiamond.github.io`
