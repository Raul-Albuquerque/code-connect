import { render, screen } from '@testing-library/react'
import { LoginPage } from './LoginPage'
import { expectNoA11yViolations } from '../../test/axe'

describe('LoginPage', () => {
  it('renders the banner and the login form', () => {
    const { container } = render(<LoginPage />)
    expect(screen.getByRole('img', { name: /Code Connect/ })).toBeInTheDocument()
    expect(container.querySelector('picture source')).toHaveAttribute(
      'srcset',
      '/banner.webp',
    )
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<LoginPage />)
    await expectNoA11yViolations(container)
  })
})
