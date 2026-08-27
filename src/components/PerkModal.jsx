import { Info, X } from 'lucide-react'

export function PerkModal({ onClose, perk }) {
  if (!perk) return null

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button
          aria-label="Fechar detalhes da perk"
          className="close"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="modal-top">
          <div className="diamond big">
            <img alt={perk.name} src={perk.image} />
          </div>

          <div>
            <span>PERK DE SOBREVIVENTE</span>
            <h2>{perk.name}</h2>
            <small>{perk.owner}</small>
          </div>
        </div>

        <div className="rule" />
        <h3>EFEITO</h3>
        <p>{perk.description}</p>

        <div className="note">
          <Info /> Valores e efeitos podem variar conforme atualizações do jogo.
        </div>
      </div>
    </div>
  )
}
