import { useState } from 'react'

const EFFECTS = [
  ['Cura', /\bheal(?:s|ed|ing)?\b/i],
  ['Geradores', /\bgenerators?\b/i],
  ['Auras', /\bauras?\b/i],
  ['Exaustão', /\bexhaust(?:ed|ion)\b/i],
  ['Totens', /\btotems?\b/i],
  ['Ganchos', /\b(?:hooks?|hooked|unhooks?|unhooked|unhooking)\b/i],
  ['Perseguição', /\bchas(?:e|es|ed|ing)\b/i],
  ['Baús e itens', /\b(?:chests?|items?)\b/i],
]

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function PerkCatalog({
  perks,
  playerCount,
  playerNames,
  selections,
  onUpdateSelection,
  onPerkSelect,
}) {
  const [query, setQuery] = useState('')
  const [owner, setOwner] = useState('')
  const [effect, setEffect] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(0)
  const player = Math.min(selectedPlayer, playerCount - 1)
  const ids = selections[player] ? new Set(selections[player]) : null
  const owners = [...new Set(perks.map((perk) => perk.owner))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
  const search = normalize(query.trim())
  const effectPattern = EFFECTS.find(([name]) => name === effect)?.[1]
  const visible = perks.filter(
    (perk) =>
      normalize(`${perk.name} ${perk.owner}`).includes(search) &&
      (!owner || perk.owner === owner) &&
      (!effectPattern || effectPattern.test(perk.description)),
  )
  const selectedCount = ids
    ? perks.filter((perk) => ids.has(perk.id)).length
    : perks.length
  const visibleIds = visible.map((perk) => perk.id)

  return (
    <details className="control perk-catalog">
      <summary>Catálogo e perks disponíveis</summary>
      <div className="catalog-filters">
        <label>
          Jogador
          <select
            value={player}
            onChange={(event) => setSelectedPlayer(Number(event.target.value))}
          >
            {playerNames.slice(0, playerCount).map((name, index) => (
              <option key={index} value={index}>
                {name.trim() || `Jogador ${index + 1}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Buscar pelo nome da perk ou do sobrevivente
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Sobrevivente de origem
          <select
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          >
            <option value="">Todos</option>
            {owners.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Efeito mencionado na descrição
          <select
            value={effect}
            onChange={(event) => setEffect(event.target.value)}
          >
            <option value="">Todos</option>
            {EFFECTS.map(([name]) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="catalog-count">
        {selectedCount} de {perks.length} disponíveis para este jogador ·{' '}
        {visible.length} resultados
      </p>
      <div className="catalog-actions">
        <button onClick={() => onUpdateSelection(player, null, true)}>
          Usar todas
        </button>
        <button onClick={() => onUpdateSelection(player, null, false)}>
          Limpar seleção
        </button>
        <button
          disabled={!visible.length}
          onClick={() => onUpdateSelection(player, visibleIds, true)}
        >
          Marcar resultados
        </button>
        <button
          disabled={!visible.length}
          onClick={() => onUpdateSelection(player, visibleIds, false)}
        >
          Desmarcar resultados
        </button>
      </div>
      {visible.length === 0 ? (
        <p>Nenhuma perk corresponde aos filtros.</p>
      ) : (
        <ul className="catalog-list">
          {visible.map((perk) => (
            <li key={perk.id}>
              <input
                aria-label={`Disponível: ${perk.name}`}
                type="checkbox"
                checked={ids?.has(perk.id) ?? true}
                onChange={(event) =>
                  onUpdateSelection(player, [perk.id], event.target.checked)
                }
              />
              <button onClick={() => onPerkSelect(perk)}>
                <img
                  src={perk.image}
                  alt=""
                  width="32"
                  height="32"
                  loading="lazy"
                />
                <span>
                  {perk.name}
                  <small>{perk.owner}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </details>
  )
}
