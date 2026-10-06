import { render, screen } from '@testing-library/react'
import { TextLink } from './TextLink'
import { expectNoA11yViolations } from '../../test/axe'

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

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<TextLink href="/esqueci">Esqueci a senha</TextLink>)
    await expectNoA11yViolations(container)
  })
})
