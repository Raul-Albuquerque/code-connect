import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialLogin } from './SocialLogin'
import { expectNoA11yViolations } from '../../test/axe'

describe('SocialLogin', () => {
  it('renders the divider text and both providers', () => {
    render(<SocialLogin />)
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar com Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar com Gmail' })).toBeInTheDocument()
  })

  it('reports the selected provider', async () => {
    const onSelect = vi.fn()
    render(<SocialLogin onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrar com Github' }))
    await userEvent.click(screen.getByRole('button', { name: 'Entrar com Gmail' }))
    expect(onSelect).toHaveBeenNthCalledWith(1, 'github')
    expect(onSelect).toHaveBeenNthCalledWith(2, 'google')
  })

  it('gives every provider image an intrinsic size', () => {
    const { container } = render(<SocialLogin />)
    const imgs = container.querySelectorAll('img')
    expect(imgs).toHaveLength(2)
    imgs.forEach((img) => {
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
    })
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<SocialLogin />)
    await expectNoA11yViolations(container)
  })
})
