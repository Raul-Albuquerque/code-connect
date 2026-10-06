import { render, screen } from '@testing-library/react'
import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renders a link with the given href', () => {
    render(<TextLink href="/esqueci">Esqueci a senha</TextLink>)
    expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toHaveAttribute(
      'href',
      '/esqueci',
    )
  })

  it('applies the primary variant', () => {
    render(
      <TextLink href="/cadastro" variant="primary">
        Crie seu cadastro!
      </TextLink>,
    )
    expect(screen.getByRole('link')).toHaveClass('text-primary')
  })
})
