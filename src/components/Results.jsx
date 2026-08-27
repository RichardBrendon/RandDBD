import { RefreshCw } from 'lucide-react'
import { PerkCard } from './PerkCard'

function getPlayerName(playerNames, playerIndex) {
  return playerNames[playerIndex].trim() || `JOGADOR ${playerIndex + 1}`
}

export function Results({
  builds,
  onPerkSelect,
  onRandomizeAll,
  onRandomizePlayer,
  playerCount,
  playerNames,
}) {
  return (
    <section className="results">
      <div className="results-head">
        <div>
          <span>RESULTADO</span>
          <h2>{playerCount === 1 ? 'Seu loadout' : 'Loadouts do esquadrão'}</h2>
        </div>

        <button onClick={onRandomizeAll}>
          <RefreshCw size={16} /> Rolar novamente
        </button>
      </div>

      <div className="players">
        {builds.map((build, playerIndex) => {
          const playerName = getPlayerName(playerNames, playerIndex)

          return (
            <article className="player" key={playerIndex}>
              <div className="player-head">
                <span>0{playerIndex + 1}</span>

                <div className="player-name">
                  <b>{playerName}</b>
                  <small>SOBREVIVENTE</small>
                </div>

                {playerCount > 1 && (
                  <button
                    aria-label={`Rolar novamente as perks de ${playerName}`}
                    className="player-reroll"
                    onClick={() => onRandomizePlayer(playerIndex)}
                    title="Rolar somente este jogador"
                  >
                    <RefreshCw size={14} /> ROLAR ESTE
                  </button>
                )}
              </div>

              <div className="perks">
                {build.map((perk) => (
                  <PerkCard key={perk.id} onSelect={onPerkSelect} perk={perk} />
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
