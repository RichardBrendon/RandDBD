import { Bookmark, LibraryBig, Shuffle } from 'lucide-react'

const PANELS = [
  { id: 'draw', label: 'Sorteio', Icon: Shuffle },
  { id: 'catalog', label: 'Catálogo', Icon: LibraryBig },
  { id: 'saved', label: 'Salvos', Icon: Bookmark },
]

export function PanelNavigation({ active, onChange }) {
  function onKeyDown(event, index) {
    const nextIndex = {
      ArrowLeft: (index + PANELS.length - 1) % PANELS.length,
      ArrowRight: (index + 1) % PANELS.length,
      Home: 0,
      End: PANELS.length - 1,
    }[event.key]
    if (nextIndex === undefined) return
    event.preventDefault()
    const next = PANELS[nextIndex].id
    onChange(next)
    document.getElementById(`tab-${next}`)?.focus()
  }

  return (
    <nav className="panel-navigation" aria-label="Painéis do RandDBD">
      <div className="panel-tabs" role="tablist" aria-label="Painéis">
        {PANELS.map(({ id, label, Icon }, index) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            aria-controls={`panel-${id}`}
            aria-selected={active === id}
            tabIndex={active === id ? 0 : -1}
            onClick={() => onChange(id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <Icon aria-hidden="true" size={18} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
