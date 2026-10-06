import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'
import { expectNoA11yViolations } from '../../test/axe'

describe('Input', () => {
  it('renders with the given placeholder', () => {
    render(<Input placeholder="usuario123" />)
    expect(screen.getByPlaceholderText('usuario123')).toBeInTheDocument()
  })

  it('accepts typed text', async () => {
    render(<Input aria-label="campo" />)
    const input = screen.getByLabelText('campo')
    await userEvent.type(input, 'abc')
    expect(input).toHaveValue('abc')
  })

  it('forwards native props such as type', () => {
    render(<Input aria-label="senha" type="password" />)
    expect(screen.getByLabelText('senha')).toHaveAttribute('type', 'password')
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<Input aria-label="Email ou usuário" />)
    await expectNoA11yViolations(container)
  })
})
