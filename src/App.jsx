import { useState } from 'react'
import { EmptyState } from './components/EmptyState'
import { Hero } from './components/Hero'
import { MatchConfigurator } from './components/MatchConfigurator'
import { PerkCatalog } from './components/PerkCatalog'
import { PerkModal } from './components/PerkModal'
import { Results } from './components/Results'
import { SavedLoadouts } from './components/SavedLoadouts'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import survivorPerks from './data/survivor-perks.json'
import { useLoadoutRandomizer } from './hooks/useLoadoutRandomizer'
import {
  buildSnapshot,
  snapshotKey,
  useSavedLoadouts,
} from './hooks/useSavedLoadouts'

const perksById = new Map(survivorPerks.map((perk) => [perk.id, perk]))

export function App() {
  const [selectedPerk, setSelectedPerk] = useState(null)
  const library = useSavedLoadouts()
  const randomizer = useLoadoutRandomizer(survivorPerks, library.recordDraw)
  const currentSnapshot = buildSnapshot(
    randomizer.builds,
    randomizer.playerNames,
  )
  const currentKey = snapshotKey(currentSnapshot)
  const favorite = library.favorites.some((entry) => entry.key === currentKey)

  return (
    <main>
      <SiteHeader perkCount={perksById.size} />
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
          favorite={favorite}
          locks={randomizer.locks}
          onPerkSelect={setSelectedPerk}
          onRandomizeAll={randomizer.randomizeAll}
          onRandomizePlayer={randomizer.randomizePlayer}
          onTogglePerkLock={randomizer.togglePerkLock}
          onToggleFavorite={() => library.toggleFavorite(currentSnapshot)}
          playerCount={randomizer.playerCount}
          playerNames={randomizer.playerNames}
        />
      ) : (
        <EmptyState />
      )}

      <SavedLoadouts
        library={library}
        config={{
          playerCount: randomizer.playerCount,
          playerNames: randomizer.playerNames.slice(0, randomizer.playerCount),
          allowRepeat: randomizer.allowRepeat,
          selections: randomizer.selections.slice(0, randomizer.playerCount),
        }}
        onApplyPreset={randomizer.applyPreset}
        onOpenPerk={setSelectedPerk}
        perksById={perksById}
      />
      <SiteFooter />
      <PerkModal onClose={() => setSelectedPerk(null)} perk={selectedPerk} />
    </main>
  )
}
