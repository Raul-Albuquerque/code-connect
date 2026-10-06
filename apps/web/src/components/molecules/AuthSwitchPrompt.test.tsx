import { render, screen } from '@testing-library/react'
import { AuthSwitchPrompt } from './AuthSwitchPrompt'

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
})
