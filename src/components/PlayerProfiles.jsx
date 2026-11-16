import { useState } from 'react'
import { PerkCatalog } from './PerkCatalog'

function ProfileEditor({ profile, perks, onSave, onCancel, onPerkSelect }) {
  const [name, setName] = useState(profile.name)
  const [ids, setIds] = useState(profile.perks)

  function updateSelection(_, affected, include) {
    setIds((current) => {
      if (affected === null) return include ? perks.map((perk) => perk.id) : []
      const next = new Set(current)
      for (const id of affected) {
        if (include) next.add(id)
        else next.delete(id)
      }
      return [...next]
    })
  }

  return (
    <div className="profile-editor">
      <label>
        Nome do jogador salvo
        <input
          maxLength={24}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <PerkCatalog
        perks={perks}
        playerCount={1}
        playerNames={[name]}
        selections={[ids]}
        onUpdateSelection={updateSelection}
        onPerkSelect={onPerkSelect}
      />
      <div className="catalog-actions">
        <button disabled={!name.trim()} onClick={() => onSave(name, ids)}>
          Salvar alterações
        </button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

export function PlayerProfiles({
  profileLibrary,
  perks,
  onDelete,
  onPerkSelect,
}) {
  const [editingId, setEditingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const editing = profileLibrary.profiles.find(({ id }) => id === editingId)
  const knownPerks = new Set(perks.map(({ id }) => id))

  return (
    <section className="control saved-loadouts player-profiles">
      <h2>Jogadores salvos</h2>
      {profileLibrary.storageError && (
        <p role="alert">
          O armazenamento está indisponível. Os perfis ficam disponíveis apenas
          nesta sessão.
        </p>
      )}
      {!profileLibrary.profiles.length && (
        <p>Salve seu primeiro jogador no Catálogo.</p>
      )}
      <ul className="saved-list preset-list">
        {profileLibrary.profiles.map(({ id, name, perks: ids }) => (
          <li key={id}>
            <div>
              <strong>{name}</strong>
              <small>
                {ids.filter((perk) => knownPerks.has(perk)).length} perks
              </small>
            </div>
            <div>
              <button
                className="saved-button"
                onClick={() => {
                  setEditingId(id)
                  setConfirmId(null)
                }}
              >
                Editar
              </button>
              {confirmId === id ? (
                <>
                  <button
                    className="saved-button"
                    onClick={() => {
                      onDelete(id)
                      setConfirmId(null)
                    }}
                  >
                    Confirmar exclusão
                  </button>
                  <button
                    className="saved-button"
                    onClick={() => setConfirmId(null)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  className="saved-button"
                  onClick={() => setConfirmId(id)}
                >
                  Excluir
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {editing && (
        <ProfileEditor
          key={editing.id}
          profile={editing}
          perks={perks}
          onPerkSelect={onPerkSelect}
          onCancel={() => setEditingId(null)}
          onSave={(name, ids) => {
            profileLibrary.save(name, ids, editing.id)
            setEditingId(null)
          }}
        />
      )}
    </section>
  )
}
