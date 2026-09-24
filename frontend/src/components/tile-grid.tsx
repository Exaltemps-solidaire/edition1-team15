import type { Rubric } from '../data/mock-home'

export interface TileGridProps {
  rubrics: Rubric[]
}

const TileGrid = ({ rubrics }: TileGridProps) => {
  if (rubrics.length === 0) {
    return <p className="text-caption text-base-content/60">Aucune rubrique ne correspond à la recherche.</p>
  }

  return (
    <ul className="grid grid-cols-2 gap-3" aria-label="Rubriques de l'intranet">
      {rubrics.map((rubric) => (
        <li key={rubric.id}>
          <button
            type="button"
            className="card bg-base-100 border border-base-300 w-full min-h-touch p-4 text-left shadow-raised hoverable active:bg-(--overlay-active) focus-visible:outline-2 focus-visible:outline-(--color-focus)"
          >
            <span className="text-2xl" aria-hidden="true">
              {rubric.icon}
            </span>
            <span className="text-body font-semibold text-base-content">{rubric.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export { TileGrid }
