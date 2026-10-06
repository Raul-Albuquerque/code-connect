import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'
import { expectNoA11yViolations } from '../../test/axe'

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

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<Checkbox label="Lembrar-me" />)
    await expectNoA11yViolations(container)
  })
})
