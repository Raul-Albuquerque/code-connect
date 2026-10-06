import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialButton } from './SocialButton'

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
})
