import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SearchBar } from './search-bar'

describe('SearchBar', () => {
  it('renders the input with its accessible label', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByLabelText("Rechercher dans l'intranet")).toBeInTheDocument()
  })

  it('calls onChange with the typed value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar value="" onChange={onChange} />)

    await user.type(screen.getByLabelText("Rechercher dans l'intranet"), 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })
})
