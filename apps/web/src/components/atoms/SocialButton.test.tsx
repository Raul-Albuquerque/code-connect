import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialButton } from './SocialButton'
import { expectNoA11yViolations } from '../../test/axe'

describe('SocialButton', () => {
  it('is accessible by its label', () => {
    render(<SocialButton src="/github.png" label="Entrar com Github" />)
    expect(screen.getByRole('button', { name: 'Entrar com Github' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<SocialButton src="/github.png" label="Github" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('sets the intrinsic size on the image', () => {
    const { container } = render(
      <SocialButton src="/github.png" label="Github" width={40} height={55} />,
    )
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('width', '40')
    expect(img).toHaveAttribute('height', '55')
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<SocialButton src="/github.png" label="Github" />)
    await expectNoA11yViolations(container)
  })
})
