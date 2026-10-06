import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'
import { expectNoA11yViolations } from '../../test/axe'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Login</Button>)
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Login</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('stretches when fullWidth is set', () => {
    render(<Button fullWidth>Login</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<Button>Login</Button>)
    await expectNoA11yViolations(container)
  })
})
