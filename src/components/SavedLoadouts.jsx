import { useState } from 'react'

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function BuildList({
  entries,
  favorites,
  onToggleFavorite,
  onOpenPerk,
  perksById,
}) {
  if (entries.length === 0) return <p>Nenhuma build nesta lista.</p>

  return (
    <ul className="saved-list">
      {entries.map(({ key, date, players }) => {
        const favorite = favorites.some((entry) => entry.key === key)
        return (
          <li key={key}>
            <details>
              <summary>
                {players.map(({ name }) => name).join(', ')}
                <small>{dateFormat.format(new Date(date))}</small>
              </summary>
              {players.map(({ name, perks }, player) => (
                <div className="saved-player" key={player}>
                  <strong>{name}</strong>
                  <ul>
                    {perks.map(({ id, name }) => {
                      const perk = perksById.get(id)
                      return (
                        <li key={id}>
                          {perk ? (
                            <button
                              className="saved-perk"
                              onClick={() => onOpenPerk(perk)}
                            >
                              {perk.name}
                            </button>
                          ) : (
                            name
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
              <button
                className="saved-button"
                onClick={() => onToggleFavorite(players)}
              >
                {favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              </button>
            </details>
          </li>
        )
      })}
    </ul>
  )
}

export function SavedLoadouts({
  library,
  config,
  onApplyPreset,
  onOpenPerk,
  perksById,
}) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const presetName = name.trim()
  const existing = library.presets.some(
    (preset) => preset.key === presetName.toLocaleLowerCase('pt-BR'),
  )
  const buildListProps = {
    favorites: library.favorites,
    onToggleFavorite: library.toggleFavorite,
    onOpenPerk,
    perksById,
  }

  function submitPreset(event) {
    event.preventDefault()
    if (!presetName) return
    library.savePreset(presetName, config)
    setName('')
    setMessage(existing ? 'Preset atualizado.' : 'Preset salvo.')
  }

  return (
    <details className="control saved-loadouts">
      <summary>Histórico, favoritos e presets</summary>
      {library.storageError && (
        <p role="alert">
          O armazenamento local está indisponível. As alterações duram apenas
          nesta sessão.
        </p>
      )}
      <details className="saved-section">
        <summary>Histórico ({library.history.length})</summary>
        <BuildList entries={library.history} {...buildListProps} />
      </details>
      <details className="saved-section">
        <summary>Favoritos ({library.favorites.length})</summary>
        <BuildList entries={library.favorites} {...buildListProps} />
      </details>
      <details className="saved-section">
        <summary>Presets de grupo ({library.presets.length})</summary>
        <p>
          Salve a configuração atual. Aplicar um preset substitui a configuração
          e limpa o resultado atual.
        </p>
        <form className="preset-form" onSubmit={submitPreset}>
          <label>
            Nome do preset
            <input
              maxLength={48}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <button className="saved-button" disabled={!presetName}>
            {existing ? 'Atualizar preset' : 'Salvar preset'}
          </button>
        </form>
        <p role="status">{message}</p>
        <ul className="saved-list preset-list">
          {library.presets.map((preset) => (
            <li key={preset.key}>
              <strong>{preset.name}</strong>
              <div>
                <button
                  className="saved-button"
                  aria-label={`Aplicar ${preset.name}`}
                  onClick={() => {
                    onApplyPreset(preset.config)
                    setMessage(`Preset ${preset.name} aplicado.`)
                  }}
                >
                  Aplicar
                </button>
                <button
                  className="saved-button"
                  aria-label={`Excluir ${preset.name}`}
                  onClick={() => {
                    library.deletePreset(preset.key)
                    setMessage(`Preset ${preset.name} excluído.`)
                  }}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </details>
    </details>
  )
}
