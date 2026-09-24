import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { App } from './app'

describe('App — écran d’accueil (P1-1)', () => {
  it('renders the tile grid and the actualités section', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Intranet' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Annuaire/ })).toBeInTheDocument()
    expect(screen.getByText(/Nouvelle procédure de remboursement/)).toBeInTheDocument()
  })

  it('filters rubrics and actualités as the visitor types in the search bar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText("Rechercher dans l'intranet"), 'formation')

    expect(screen.queryByRole('button', { name: /Applications/ })).not.toBeInTheDocument()
    expect(screen.getByText(/Inscriptions ouvertes/)).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
