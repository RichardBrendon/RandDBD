import { EMPTY_CHALLENGE } from '../utils/challenges'

const PRESETS = [
  ['Cura em equipe', { healing: 'each' }],
  ['Sem exaustão', { exhaustion: 'squad' }],
]

export function ChallengeMode({ challenge, onChange, playerNames }) {
  const activeCount =
    Number(Boolean(challenge.healing)) + Number(Boolean(challenge.exhaustion))
  const playerOptions = playerNames.map((name, index) => (
    <option key={index} value={String(index)}>
      {name.trim() || `Jogador ${index + 1}`}
    </option>
  ))

  return (
    <details className="challenge-mode">
      <summary>Modo desafio{activeCount > 0 && ` (${activeCount})`}</summary>
      <p>
        Os filtros usam os efeitos mencionados nas descrições e valem a partir
        do próximo sorteio.
      </p>
      <div className="catalog-actions">
        {PRESETS.map(([label, rules]) => (
          <button
            key={label}
            onClick={() => onChange({ ...challenge, ...rules })}
          >
            {label}
          </button>
        ))}
        {activeCount > 0 && (
          <button onClick={() => onChange(EMPTY_CHALLENGE)}>
            Limpar regras
          </button>
        )}
      </div>
      <div className="catalog-filters">
        <label>
          Pelo menos uma perk de cura
          <select
            value={challenge.healing}
            onChange={(event) =>
              onChange({ ...challenge, healing: event.target.value })
            }
          >
            <option value="">Sem regra</option>
            <option value="squad">No esquadrão</option>
            <option value="each">Para cada jogador</option>
            {playerOptions}
          </select>
        </label>
        <label>
          Sem perks de exaustão
          <select
            value={challenge.exhaustion}
            onChange={(event) =>
              onChange({ ...challenge, exhaustion: event.target.value })
            }
          >
            <option value="">Sem regra</option>
            <option value="squad">No esquadrão</option>
            {playerOptions}
          </select>
        </label>
      </div>
    </details>
  )
}
