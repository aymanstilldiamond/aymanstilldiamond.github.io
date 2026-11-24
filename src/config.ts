/**
 * The moment. Feb 22, 2021, 2:28 PM Eastern (EST, UTC-5): Ayman wins his Plat 1
 * promo series, hits Diamond 4, types "lets goo / no more ranked", and becomes
 * Diamond forever (in his heart).
 */
export const ASCENSION = Date.UTC(2021, 1, 22, 19, 28, 0)

export const AYMAN_OPGG = 'https://op.gg/lol/summoners/na/Feymanxop-NA2'
export const AMONGUSLY_OPGG = 'https://op.gg/lol/summoners/na/Amongusly-111'

export const TIERS = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
] as const
export type Tier = (typeof TIERS)[number]

export const TIER_COLOR: Record<Tier, string> = {
  IRON: '#7b726e',
  BRONZE: '#b0745a',
  SILVER: '#a9b6c2',
  GOLD: '#e2b257',
  PLATINUM: '#3fc1ae',
  EMERALD: '#2fd884',
  DIAMOND: '#8fc4ff',
  MASTER: '#be7bff',
  GRANDMASTER: '#ff6464',
  CHALLENGER: '#f7d97c',
}

/** End-of-season solo queue tiers, from op.gg (Nov 2026). The live season comes from Riot. */
export type SeasonEnd = { season: string; tier: Tier; div: number; lp: number; note?: string }
export const SEASON_HISTORY: SeasonEnd[] = [
  { season: '2020', tier: 'PLATINUM', div: 4, lp: 65 },
  { season: '2021', tier: 'PLATINUM', div: 1, lp: 75, note: 'Hit D4 in Feb. Ended in Plat.' },
  { season: '2022', tier: 'PLATINUM', div: 3, lp: 35 },
  { season: '2023 S1', tier: 'GOLD', div: 1, lp: 29, note: 'Gold.' },
  { season: '2023 S2', tier: 'PLATINUM', div: 3, lp: 36 },
  { season: '2024 S1', tier: 'EMERALD', div: 3, lp: 24 },
  { season: '2024 S2', tier: 'EMERALD', div: 4, lp: 9 },
  { season: '2024 S3', tier: 'PLATINUM', div: 4, lp: 3 },
  { season: '2025', tier: 'PLATINUM', div: 4, lp: 0 },
]

/** Peak this season per op.gg. Riot's API doesn't expose peaks. */
export const PEAK_2026 = { tier: 'DIAMOND' as Tier, div: 3, lp: 10 }

export const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4 }

/* ------------------------------------------------------------------ */
/* Exhibit A: the Discord log, Feb 22 2021                              */
/* ------------------------------------------------------------------ */

export type ChatBlock = {
  author: 'ayman' | 'kiron'
  time: string
  lines: string[]
  promoCard?: boolean
}

export const CHAT: ChatBlock[] = [
  { author: 'ayman', time: '2/22/21, 1:18 PM', lines: ['1 more game boys', 'and this journey ends'] },
  { author: 'ayman', time: '2/22/21, 1:57 PM', lines: ['bruhhhh'], promoCard: true },
  { author: 'kiron', time: '2/22/21, 2:04 PM', lines: ['YOU GOT THIS AYMAN', 'WOOOO', 'D4', 'YAYYYYY', 'WINNER'] },
  { author: 'ayman', time: '2/22/21, 2:28 PM', lines: ['lets goo', 'no more ranked'] },
]

/* ------------------------------------------------------------------ */
/* Exhibit D: what you could have done instead                          */
/* ------------------------------------------------------------------ */

const DAY = 86_400_000
const YEAR = 365.25 * DAY

export type CouldHave = {
  icon: string
  title: string
  /** How long one of these takes. Omit for the qualitative finale. */
  every?: number
  /** Present the count as a live decimal rather than whole completions. */
  decimal?: number
  /** Show progress through a single one as a percentage. */
  percent?: boolean
  unit?: string
  quip: string
}

export const COULD_HAVE: CouldHave[] = [
  {
    icon: '🌍',
    title: 'Ridden the Earth around the Sun',
    every: YEAR,
    decimal: 6,
    unit: 'laps',
    quip: 'The planet keeps climbing. Ayman has climbed zero divisions.',
  },
  {
    icon: '🏃',
    title: 'Trained for and run a marathon',
    every: 16 * 7 * DAY,
    unit: 'marathons',
    quip: 'Sixteen-week plans, back to back. Legs of steel. Rank of Emerald.',
  },
  {
    icon: '🥾',
    title: 'Walked the Appalachian Trail, Georgia to Maine',
    every: 182 * DAY,
    unit: 'thru-hikes',
    quip: '2,197 miles each time. Ayman has moved 0 miles toward Diamond.',
  },
  {
    icon: '🗾',
    title: 'Learned Japanese to professional fluency',
    every: 88 * 7 * DAY,
    unit: 'languages',
    quip: 'US diplomats do it in 88 weeks. Ayman could be fluent in Japanese, Korean, and Arabic by now.',
  },
  {
    icon: '🐘',
    title: 'Carried an elephant pregnancy to term',
    every: 22 * 30.44 * DAY,
    unit: 'baby elephants',
    quip: 'The longest pregnancy in the animal kingdom. Still shorter than this.',
  },
  {
    icon: '🎓',
    title: 'Earned a bachelor’s degree',
    every: 4 * YEAR,
    unit: 'degrees',
    quip: 'Walked the stage, threw the cap, started a master’s. Ayman threw promos.',
  },
  {
    icon: '🩺',
    title: 'Finished medical school',
    every: 4 * YEAR,
    unit: 'MDs',
    quip: 'Could have been Dr. Ayman. Instead: Dr. Emerald.',
  },
  {
    icon: '🚗',
    title: 'Paid off a 60-month car loan',
    every: 5 * YEAR,
    unit: 'cars',
    quip: 'Title in hand. The car is fully his. The Diamond border is not.',
  },
  {
    icon: '👶',
    title: 'Raised a newborn all the way to kindergarten',
    every: 5 * YEAR,
    unit: 'kids',
    quip: 'They can read now. They can tie their shoes. They could probably hit Diamond.',
  },
  {
    icon: '🦗',
    title: 'Waited out a brood of 17-year cicadas',
    every: 17 * YEAR,
    decimal: 1,
    percent: true,
    unit: 'of the way out',
    quip: 'They spend 17 years underground. Ayman is on track to surface first. Probably.',
  },
  {
    icon: '🛰️',
    title: 'Kept pace with Voyager 1',
    quip: 'kilometres travelled since he hit D4, heading out of the solar system. About as far as Ayman is from Diamond.',
  },
  {
    icon: '💍',
    title: 'Met someone, fallen in love, gotten married, and had a kid',
    quip: 'A kid who is now old enough to ask why Daddy keeps saying he’s Diamond when the client says Emerald.',
  },
]

/** km/s, heliocentric, near enough. */
export const VOYAGER_KMS = 16.99
