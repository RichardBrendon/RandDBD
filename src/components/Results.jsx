import { Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { PerkCard } from './PerkCard'

function getPlayerName(playerNames, playerIndex) {
  return playerNames[playerIndex].trim() || `JOGADOR ${playerIndex + 1}`
}

export function Results({
  builds,
  locks,
  onPerkSelect,
  onRandomizeAll,
  onRandomizePlayer,
  onTogglePerkLock,
  playerCount,
  playerNames,
}) {
  const [copiedText, setCopiedText] = useState('')
  const [manualCopyText, setManualCopyText] = useState('')
  const shareText = builds
    .map(
      (build, player) =>
        `${getPlayerName(playerNames, player)}\n${build.map((perk) => `• ${perk.name}`).join('\n')}`,
    )
    .join('\n\n')
  const allLocked = builds.every((build, player) =>
    build.every((_, slot) => locks[player]?.[slot]),
  )

  async function copyBuilds() {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopiedText(shareText)
      setManualCopyText('')
    } catch {
      setCopiedText('')
      setManualCopyText(shareText)
    }
  }

  return (
    <section className="results">
      <div className="results-head">
        <div>
          <span>RESULTADO</span>
          <h2>{playerCount === 1 ? 'Seu loadout' : 'Loadouts do esquadrão'}</h2>
        </div>

        <div className="result-actions">
          <button onClick={copyBuilds}>
            <Copy size={16} /> Copiar build
          </button>
          <button disabled={allLocked} onClick={onRandomizeAll}>
            <RefreshCw size={16} /> Rolar novamente
          </button>
        </div>
      </div>
      <p className="copy-status" role="status">
        {copiedText === shareText && 'Build copiada.'}
      </p>
      {manualCopyText === shareText && (
        <label className="manual-copy">
          Selecione o texto para copiar.
          <textarea
            onFocus={(event) => event.currentTarget.select()}
            readOnly
            value={shareText}
          />
        </label>
      )}

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
                    disabled={build.every(
                      (_, slot) => locks[playerIndex]?.[slot],
                    )}
                    onClick={() => onRandomizePlayer(playerIndex)}
                    title="Rolar somente este jogador"
                  >
                    <RefreshCw size={14} /> ROLAR ESTE
                  </button>
                )}
              </div>

              <div className="perks">
                {build.map((perk, slot) => (
                  <PerkCard
                    key={slot}
                    locked={Boolean(locks[playerIndex]?.[slot])}
                    onSelect={onPerkSelect}
                    onToggleLock={() => onTogglePerkLock(playerIndex, slot)}
                    perk={perk}
                  />
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
