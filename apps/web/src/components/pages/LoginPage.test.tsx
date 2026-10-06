import { render, screen } from '@testing-library/react'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('renders the banner and the login form', () => {
    render(<LoginPage />)
    expect(screen.getByRole('img', { name: /Code Connect/ })).toHaveAttribute(
      'src',
      '/banner.png',
    )
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })
})
