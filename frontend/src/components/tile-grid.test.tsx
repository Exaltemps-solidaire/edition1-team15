import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TileGrid } from './tile-grid'

const RUBRICS = [
  { id: 'applications', label: 'Applications', icon: '🖥️' },
  { id: 'annuaire', label: 'Annuaire', icon: '👥' }
]

describe('TileGrid', () => {
  it('renders one tile per rubric', () => {
    render(<TileGrid rubrics={RUBRICS} />)
    expect(screen.getByRole('button', { name: /Applications/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Annuaire/ })).toBeInTheDocument()
  })

  it('shows an empty-state message when no rubric matches', () => {
    render(<TileGrid rubrics={[]} />)
    expect(screen.getByText(/Aucune rubrique ne correspond/)).toBeInTheDocument()
  })
})
