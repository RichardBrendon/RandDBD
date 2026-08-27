export function PerkCard({ onSelect, perk }) {
  return (
    <button onClick={() => onSelect(perk)}>
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
  )
}
