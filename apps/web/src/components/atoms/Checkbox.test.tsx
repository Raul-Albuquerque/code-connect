import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders with its label', () => {
    render(<Checkbox label="Lembrar-me" />)
    expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument()
  })

  it('toggles when clicked', async () => {
    render(<Checkbox label="Lembrar-me" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Lembrar-me' })
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
