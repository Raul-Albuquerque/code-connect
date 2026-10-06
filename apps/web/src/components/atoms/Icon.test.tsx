import { render } from '@testing-library/react'
import { ArrowRightIcon, ClipboardIcon } from './Icon'
import { expectNoA11yViolations } from '../../test/axe'

describe('Icon', () => {
  it.each([
    ['ArrowRightIcon', ArrowRightIcon],
    ['ClipboardIcon', ClipboardIcon],
  ])('%s renders a decorative svg', (_name, Component) => {
    const { container } = render(<Component />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards props such as className', () => {
    const { container } = render(<ArrowRightIcon className="size-4" />)
    expect(container.querySelector('svg')).toHaveClass('size-4')
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<ArrowRightIcon />)
    await expectNoA11yViolations(container)
  })
})
