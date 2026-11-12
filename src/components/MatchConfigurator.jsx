import { Info, Shuffle, Users } from 'lucide-react'

const PLAYER_OPTIONS = [1, 2, 3, 4]

export function MatchConfigurator({
  allowRepeat,
  challengeControls,
  onPlayerCountChange,
  onPlayerNameChange,
  onRandomize,
  onEditAvailablePerks,
  onToggleRepeat,
  playerCount,
  playerNames,
}) {
  return (
    <section className="control">
      <div className="control-title">
        <div>
          <span>CONFIGURE A PARTIDA</span>
          <h2>Quantos sobreviventes?</h2>
        </div>
        <Users />
      </div>

      <div className="number-row">
        {PLAYER_OPTIONS.map((option) => (
          <button
            aria-label={`${option} jogador${option > 1 ? 'es' : ''}`}
            className={playerCount === option ? 'active' : ''}
            key={option}
            onClick={() => onPlayerCountChange(option)}
          >
            <b>{option}</b>
            <small>{option === 1 ? 'JOGADOR' : 'JOGADORES'}</small>
          </button>
        ))}
      </div>

      <div className="name-section">
        <div className="field-label">
          <b>Nome dos jogadores</b>
          <small>Identifique cada loadout</small>
        </div>

        <div className="name-grid">
          {Array.from({ length: playerCount }, (_, playerIndex) => (
            <label key={playerIndex}>
              <span>JOGADOR {playerIndex + 1}</span>
              <input
                autoComplete="off"
                maxLength={24}
                onChange={(event) =>
                  onPlayerNameChange(playerIndex, event.target.value)
                }
                placeholder={`Nome do jogador ${playerIndex + 1}`}
                value={playerNames[playerIndex]}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="toggle-row">
        <div>
          <b>Permitir perks repetidas</b>
          <small>Entre jogadores diferentes</small>
        </div>

        <button
          aria-checked={allowRepeat}
          aria-label="Permitir perks repetidas entre jogadores"
          className={`switch ${allowRepeat ? 'on' : ''}`}
          onClick={onToggleRepeat}
          role="switch"
        >
          <span />
        </button>
      </div>

      <button className="catalog-shortcut" onClick={onEditAvailablePerks}>
        Editar perks disponíveis
      </button>
      {challengeControls}
      <button className="random" onClick={onRandomize}>
        <Shuffle size={20} /> RANDOMIZAR LOADOUTS
      </button>

      <div className="hint">
        <Info size={14} />
        {allowRepeat
          ? 'Cada jogador terá 4 perks únicas; elas podem aparecer em outro loadout.'
          : 'As perks serão únicas em todo o esquadrão.'}
      </div>
    </section>
  )
}
