import type { NewsItem } from '../data/mock-home'

export interface ActualitesListProps {
  items: NewsItem[]
}

const ActualitesList = ({ items }: ActualitesListProps) => {
  if (items.length === 0) {
    return <p className="text-caption text-base-content/60">Aucune actualité ne correspond à la recherche.</p>
  }

  return (
    <ul aria-label="Actualités" className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id} className="card bg-base-100 border border-base-300 p-4">
          <span className="text-micro font-semibold uppercase text-primary tracking-wide">{item.tag}</span>
          <p className="text-body font-semibold text-base-content leading-snug">{item.title}</p>
          <span className="text-caption text-base-content/60">{item.date}</span>
        </li>
      ))}
    </ul>
  )
}

export { ActualitesList }
