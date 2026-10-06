import { render } from '@testing-library/react'
import { ChainShape } from './ChainShape'
import { expectNoA11yViolations } from '../../test/axe'

describe('ChainShape', () => {
  it('renders a decorative svg and accepts className', () => {
    const { container } = render(<ChainShape className="absolute" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('absolute')
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<ChainShape />)
    await expectNoA11yViolations(container)
  })
})
