import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ActualitesList } from './actualites-list'

const ITEMS = [{ id: 'news-1', tag: 'RH', title: 'Une actualité de test', date: '1 janvier 2026' }]

describe('ActualitesList', () => {
  it('renders one card per news item', () => {
    render(<ActualitesList items={ITEMS} />)
    expect(screen.getByText('Une actualité de test')).toBeInTheDocument()
    expect(screen.getByText('RH')).toBeInTheDocument()
  })

  it('shows an empty-state message when no news matches', () => {
    render(<ActualitesList items={[]} />)
    expect(screen.getByText(/Aucune actualité ne correspond/)).toBeInTheDocument()
  })
})
