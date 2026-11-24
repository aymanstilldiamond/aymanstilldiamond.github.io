import { Amongusly } from './components/Amongusly'
import { Ascension } from './components/Ascension'
import { CouldHave } from './components/CouldHave'
import { Hero } from './components/Hero'
import { Plateau } from './components/Plateau'
import { Reality } from './components/Reality'
import { Sparkles } from './components/Sparkles'
import { useRankData } from './data'

export default function App() {
  const { data, error } = useRankData()
  const ayman = data?.players.ayman ?? null

  return (
    <>
      <Sparkles />
      <div className="frost" aria-hidden="true" />
      <main className="site">
        <Hero />
        <Ascension ayman={ayman} />
        <Reality data={data} error={error} />
        <Plateau current={ayman?.solo ?? null} />
        <CouldHave />
        <Amongusly data={data} />
        <footer className="footer">
          <p className="footer-love">Made in jest. Ayman, we love you. Now go get Diamond (again).</p>
          <p className="footer-legal">
            aymanstilldiamond isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or
            anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated
            properties are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </footer>
      </main>
    </>
  )
}
