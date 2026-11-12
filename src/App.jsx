import { useMemo, useState } from 'react'
import { EmptyState } from './components/EmptyState'
import { Hero } from './components/Hero'
import { MatchConfigurator } from './components/MatchConfigurator'
import { PerkCatalog } from './components/PerkCatalog'
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

      <PerkCatalog
        perks={survivorPerks}
        playerCount={randomizer.playerCount}
        playerNames={randomizer.playerNames}
        selections={randomizer.selections}
        onUpdateSelection={randomizer.updateSelection}
        onPerkSelect={setSelectedPerk}
      />
      {randomizer.drawError && (
        <p className="draw-error" role="alert">
          {randomizer.drawError}
        </p>
      )}

      {randomizer.builds.length > 0 ? (
        <Results
          builds={randomizer.builds}
          locks={randomizer.locks}
          onPerkSelect={setSelectedPerk}
          onRandomizeAll={randomizer.randomizeAll}
          onRandomizePlayer={randomizer.randomizePlayer}
          onTogglePerkLock={randomizer.togglePerkLock}
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
