import { render } from '@testing-library/react'
import { ArrowRightIcon, ClipboardIcon } from './Icon'

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
})
