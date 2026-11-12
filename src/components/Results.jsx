import { Copy, Link, RefreshCw, Star } from 'lucide-react'
import { useState } from 'react'
import { createBuildLink } from '../utils/shareBuild'
import { PerkCard } from './PerkCard'

function getPlayerName(playerNames, playerIndex) {
  return playerNames[playerIndex].trim() || `JOGADOR ${playerIndex + 1}`
}

export function Results({
  builds,
  favorite,
  locks = {},
  onPerkSelect,
  onRandomizeAll,
  onRandomizePlayer,
  onTogglePerkLock,
  onToggleFavorite,
  playerCount,
  playerNames,
}) {
  const [copyResult, setCopyResult] = useState(null)
  const shareText = builds
    .map(
      (build, player) =>
        `${getPlayerName(playerNames, player)}\n${build.map((perk) => `• ${perk.name}`).join('\n')}`,
    )
    .join('\n\n')
  const shareLink = createBuildLink(builds, playerNames)
  const activeCopyResult =
    copyResult?.value === shareText || copyResult?.value === shareLink
      ? copyResult
      : null
  const allLocked = builds.every((build, player) =>
    build.every((_, slot) => locks[player]?.[slot]),
  )

  async function copy(value, message) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyResult({ value, message })
    } catch {
      setCopyResult({ value, manual: true })
    }
  }

  return (
    <section className="results">
      <div className="results-head">
        <div>
          <span>RESULTADO</span>
          <h2>
            {!onRandomizeAll
              ? 'Build compartilhada'
              : playerCount === 1
                ? 'Seu loadout'
                : 'Loadouts do esquadrão'}
          </h2>
        </div>

        <div className="result-actions">
          {onToggleFavorite && (
            <button aria-pressed={favorite} onClick={onToggleFavorite}>
              <Star size={16} fill={favorite ? 'currentColor' : 'none'} />{' '}
              Favoritar
            </button>
          )}
          <button onClick={() => copy(shareText, 'Build copiada.')}>
            <Copy size={16} /> Copiar build
          </button>
          <button onClick={() => copy(shareLink, 'Link copiado.')}>
            <Link size={16} /> Copiar link
          </button>
          {onRandomizeAll && (
            <button disabled={allLocked} onClick={onRandomizeAll}>
              <RefreshCw size={16} /> Rolar novamente
            </button>
          )}
        </div>
      </div>
      <p className="copy-status" role="status">
        {activeCopyResult?.message}
      </p>
      {activeCopyResult?.manual && (
        <label className="manual-copy">
          Selecione o conteúdo para copiar.
          <textarea
            onFocus={(event) => event.currentTarget.select()}
            readOnly
            value={activeCopyResult.value}
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

                {playerCount > 1 && onRandomizePlayer && (
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
                    onToggleLock={
                      onTogglePerkLock &&
                      (() => onTogglePerkLock(playerIndex, slot))
                    }
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
