export function SiteHeader({ perkCount }) {
  return (
    <header>
      <div className="brand">
        <div className="mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div>
          <b>RandDBD</b>
          <small>RANDOMIZADOR DE PERKS</small>
        </div>
      </div>

      <div className="status">
        <i /> {perkCount} perks disponíveis
      </div>
    </header>
  )
}
