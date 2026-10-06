import { render, screen } from '@testing-library/react'
import { Heading } from './Heading'
import { expectNoA11yViolations } from '../../test/axe'

describe('Heading', () => {
  it('renders an h1 by default', () => {
    render(<Heading>Login</Heading>)
    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
  })

  it('renders the requested heading level', () => {
    render(<Heading as="h2">Cadastro</Heading>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<Heading>Login</Heading>)
    await expectNoA11yViolations(container)
  })
})
