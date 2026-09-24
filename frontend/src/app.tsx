import { useMemo, useState } from 'react'

import { ActualitesList } from './components/actualites-list'
import { SearchBar } from './components/search-bar'
import { TileGrid } from './components/tile-grid'
import { NEWS_ITEMS, RUBRICS } from './data/mock-home'

const normalize = (value: string) => value.trim().toLowerCase()

const App = () => {
  const [query, setQuery] = useState('')

  const filteredRubrics = useMemo(() => {
    const needle = normalize(query)
    if (!needle) return RUBRICS
    return RUBRICS.filter((rubric) => normalize(rubric.label).includes(needle))
  }, [query])

  const filteredNews = useMemo(() => {
    const needle = normalize(query)
    if (!needle) return NEWS_ITEMS
    return NEWS_ITEMS.filter(
      (item) => normalize(item.title).includes(needle) || normalize(item.tag).includes(needle)
    )
  }, [query])

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-primary safe-top px-5 pb-4 pt-12">
        <p className="text-micro font-semibold uppercase text-primary-content/70">La Sauvegarde du Nord</p>
        <h1 className="text-title font-semibold text-primary-content mb-4">Intranet</h1>
        <SearchBar value={query} onChange={setQuery} />
      </header>

      <main className="mx-auto max-w-app px-4 py-6 flex flex-col gap-6">
        <TileGrid rubrics={filteredRubrics} />

        <section>
          <h2 className="text-caption font-semibold uppercase tracking-wide text-base-content/60 mb-3">
            Actualités
          </h2>
          <ActualitesList items={filteredNews} />
        </section>
      </main>
    </div>
  )
}

export { App }
