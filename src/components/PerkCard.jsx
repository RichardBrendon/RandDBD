import { Lock, Unlock } from 'lucide-react'

export function PerkCard({ locked, onSelect, onToggleLock, perk }) {
  const LockIcon = locked ? Lock : Unlock

  return (
    <div className="perk-slot">
      <button className="perk-details" onClick={() => onSelect(perk)}>
        <div className="diamond">
          <img
            alt=""
            onError={(event) => {
              event.currentTarget.style.opacity = '.15'
            }}
            src={perk.image}
          />
        </div>
        <b>{perk.name}</b>
        <small>{perk.owner}</small>
      </button>
      {onToggleLock && (
        <button
          aria-label={`Travar ${perk.name}`}
          aria-pressed={locked}
          className="perk-lock"
          onClick={onToggleLock}
          title={locked ? 'Destravar perk' : 'Travar perk'}
        >
          <LockIcon aria-hidden="true" size={14} />
        </button>
      )}
    </div>
  )
}
