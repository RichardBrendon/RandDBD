import { useEffect, useRef, useState } from 'react'
import { AndroidUpdateNotice } from './components/AndroidUpdateNotice'
import { ChallengeMode } from './components/ChallengeMode'
import { EmptyState } from './components/EmptyState'
import { Hero } from './components/Hero'
import { MatchConfigurator } from './components/MatchConfigurator'
import { PanelNavigation } from './components/PanelNavigation'
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
import { readBuildLink } from './utils/shareBuild'

const perksById = new Map(survivorPerks.map((perk) => [perk.id, perk]))

export function App() {
  const [selectedPerk, setSelectedPerk] = useState(null)
  const [activePanel, setActivePanel] = useState('draw')
  const requestedPanelFocus = useRef(null)
  const shouldRevealResults = useRef(false)
  const resultsRef = useRef(null)
  const [shared, setShared] = useState(() =>
    readBuildLink(window.location.hash, perksById),
  )
  const library = useSavedLoadouts()
  const randomizer = useLoadoutRandomizer(survivorPerks, library.recordDraw)
  const currentSnapshot = buildSnapshot(
    randomizer.builds,
    randomizer.playerNames,
  )
  const currentKey = snapshotKey(currentSnapshot)
  const favorite = library.favorites.some((entry) => entry.key === currentKey)

  useEffect(() => {
    function updateSharedBuild() {
      setShared(readBuildLink(window.location.hash, perksById))
      setSelectedPerk(null)
      setActivePanel('draw')
    }
    window.addEventListener('hashchange', updateSharedBuild)
    return () => window.removeEventListener('hashchange', updateSharedBuild)
  }, [])

  useEffect(() => {
    if (requestedPanelFocus.current === activePanel) {
      requestedPanelFocus.current = null
      document
        .getElementById(`panel-${activePanel}`)
        ?.focus({ preventScroll: true })
    }
  }, [activePanel])

  useEffect(() => {
    if (shouldRevealResults.current) {
      shouldRevealResults.current = false
      resultsRef.current?.scrollIntoView({ block: 'start' })
      resultsRef.current?.focus({ preventScroll: true })
    }
  }, [randomizer.builds])

  function changePanel(panel, focusPanel = false) {
    if (panel === activePanel) return
    requestedPanelFocus.current = focusPanel ? panel : null
    setActivePanel(panel)
    window.scrollTo({ top: 0 })
  }

  function drawFromConfiguration() {
    if (randomizer.randomizeAll()) shouldRevealResults.current = true
  }

  if (shared) {
    return (
      <main>
        <SiteHeader perkCount={perksById.size} />
        <div className="shared-navigation">
          <a href="#">Ir para o sorteio</a>
        </div>
        {shared.error ? (
          <p className="draw-error" role="alert">
            {shared.error}
          </p>
        ) : (
          <Results
            builds={shared.builds}
            onPerkSelect={setSelectedPerk}
            playerCount={shared.builds.length}
            playerNames={shared.playerNames}
          />
        )}
        <SiteFooter />
        <PerkModal onClose={() => setSelectedPerk(null)} perk={selectedPerk} />
      </main>
    )
  }

  return (
    <main className="app-shell">
      <SiteHeader perkCount={perksById.size} />
      <PanelNavigation active={activePanel} onChange={changePanel} />
      {__RANDDBD_ANDROID_VERSION__ && (
        <AndroidUpdateNotice version={__RANDDBD_ANDROID_VERSION__} />
      )}
      <section
        id="panel-draw"
        role="tabpanel"
        aria-labelledby="tab-draw"
        tabIndex={0}
        hidden={activePanel !== 'draw'}
      >
        <Hero />

        <MatchConfigurator
          allowRepeat={randomizer.allowRepeat}
          onPlayerCountChange={randomizer.changePlayerCount}
          onPlayerNameChange={randomizer.updatePlayerName}
          onRandomize={drawFromConfiguration}
          onEditAvailablePerks={() => changePanel('catalog', true)}
          onToggleRepeat={randomizer.togglePerkRepetition}
          playerCount={randomizer.playerCount}
          playerNames={randomizer.playerNames}
          challengeControls={
            <ChallengeMode
              challenge={randomizer.challenge}
              onChange={randomizer.changeChallenge}
              playerNames={randomizer.playerNames.slice(
                0,
                randomizer.playerCount,
              )}
            />
          }
        />

        {randomizer.drawError && (
          <p className="draw-error" role="alert">
            {randomizer.drawError}
          </p>
        )}

        {randomizer.builds.length > 0 ? (
          <div
            className="draw-results"
            ref={resultsRef}
            tabIndex={-1}
            role="region"
            aria-label="Resultado do sorteio"
          >
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
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      <section
        id="panel-catalog"
        role="tabpanel"
        aria-labelledby="tab-catalog"
        tabIndex={0}
        hidden={activePanel !== 'catalog'}
      >
        <PerkCatalog
          perks={survivorPerks}
          playerCount={randomizer.playerCount}
          playerNames={randomizer.playerNames}
          selections={randomizer.selections}
          onUpdateSelection={randomizer.updateSelection}
          onPerkSelect={setSelectedPerk}
        />
      </section>

      <section
        id="panel-saved"
        role="tabpanel"
        aria-labelledby="tab-saved"
        tabIndex={0}
        hidden={activePanel !== 'saved'}
      >
        <SavedLoadouts
          library={library}
          config={{
            playerCount: randomizer.playerCount,
            playerNames: randomizer.playerNames.slice(
              0,
              randomizer.playerCount,
            ),
            allowRepeat: randomizer.allowRepeat,
            challenge: randomizer.challenge,
            selections: randomizer.selections.slice(0, randomizer.playerCount),
          }}
          onApplyPreset={(config) => {
            randomizer.applyPreset(config)
            changePanel('draw', true)
          }}
          onOpenPerk={setSelectedPerk}
          perksById={perksById}
        />
      </section>
      <SiteFooter />
      <PerkModal onClose={() => setSelectedPerk(null)} perk={selectedPerk} />
    </main>
  )
}
