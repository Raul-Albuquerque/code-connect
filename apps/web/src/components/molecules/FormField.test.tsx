import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormField } from './FormField'
import { expectNoA11yViolations } from '../../test/axe'

describe('FormField', () => {
  it('associates the label with the input', () => {
    render(<FormField label="Senha" name="password" type="password" />)
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })

  it('lets the user type into the input', async () => {
    render(<FormField label="Email ou usuário" name="login" />)
    const input = screen.getByLabelText('Email ou usuário')
    await userEvent.type(input, 'usuario123')
    expect(input).toHaveValue('usuario123')
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<FormField label="Email ou usuário" name="login" />)
    await expectNoA11yViolations(container)
  })
})
