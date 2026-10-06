import { render, screen } from '@testing-library/react'
import { AuthSwitchPrompt } from './AuthSwitchPrompt'
import { expectNoA11yViolations } from '../../test/axe'

describe('AuthSwitchPrompt', () => {
  it('renders the question and a link to the other auth page', () => {
    render(
      <AuthSwitchPrompt
        question="Ainda não tem conta?"
        linkLabel="Crie seu cadastro!"
        href="/cadastro"
      />,
    )
    expect(screen.getByText('Ainda não tem conta?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Crie seu cadastro!' })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })

  it('renders the optional icon', () => {
    render(
      <AuthSwitchPrompt
        question="q"
        linkLabel="l"
        href="/x"
        icon={<span data-testid="icon" />}
      />,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(
      <AuthSwitchPrompt
        question="Ainda não tem conta?"
        linkLabel="Crie seu cadastro!"
        href="/cadastro"
      />,
    )
    await expectNoA11yViolations(container)
  })
})
