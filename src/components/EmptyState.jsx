import { Shuffle } from 'lucide-react'

export function EmptyState() {
  return (
    <section className="empty">
      <div className="diamond ghost">
        <Shuffle />
      </div>
      <b>A névoa está esperando</b>
      <span>Configure a partida e randomize para revelar suas perks.</span>
    </section>
  )
}
