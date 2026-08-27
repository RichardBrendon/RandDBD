import { Skull } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero">
      <div className="eyebrow">
        <Skull size={14} /> ENTRE NA NÉVOA
      </div>

      <h1>
        Sua próxima build.
        <br />
        <em>Deixe o acaso decidir.</em>
      </h1>

      <p>
        Monte loadouts imprevisíveis para o seu esquadrão. Quatro perks por
        sobrevivente, zero escolhas fáceis.
      </p>
    </section>
  )
}
