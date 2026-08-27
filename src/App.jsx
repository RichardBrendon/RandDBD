import { useMemo, useState } from 'react'
import { EmptyState } from './components/EmptyState'
import { Hero } from './components/Hero'
import { MatchConfigurator } from './components/MatchConfigurator'
import { PerkModal } from './components/PerkModal'
import { Results } from './components/Results'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import survivorPerks from './data/survivor-perks.json'
import { useLoadoutRandomizer } from './hooks/useLoadoutRandomizer'

export function App() {
  const [selectedPerk, setSelectedPerk] = useState(null)
  const randomizer = useLoadoutRandomizer(survivorPerks)
  const perkCount = useMemo(
    () => new Set(survivorPerks.map((perk) => perk.id)).size,
    [],
  )

  return (
    <main>
      <SiteHeader perkCount={perkCount} />
      <Hero />

      <MatchConfigurator
        allowRepeat={randomizer.allowRepeat}
        onPlayerCountChange={randomizer.changePlayerCount}
        onPlayerNameChange={randomizer.updatePlayerName}
        onRandomize={randomizer.randomizeAll}
        onToggleRepeat={randomizer.togglePerkRepetition}
        playerCount={randomizer.playerCount}
        playerNames={randomizer.playerNames}
      />

      {randomizer.builds.length > 0 ? (
        <Results
          builds={randomizer.builds}
          onPerkSelect={setSelectedPerk}
          onRandomizeAll={randomizer.randomizeAll}
          onRandomizePlayer={randomizer.randomizePlayer}
          playerCount={randomizer.playerCount}
          playerNames={randomizer.playerNames}
        />
      ) : (
        <EmptyState />
      )}

      <SiteFooter />
      <PerkModal onClose={() => setSelectedPerk(null)} perk={selectedPerk} />
    </main>
  )
}
