import { render } from '@testing-library/react'
import { ChainShape } from './ChainShape'

describe('ChainShape', () => {
  it('renders a decorative svg and accepts className', () => {
    const { container } = render(<ChainShape className="absolute" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('absolute')
  })
})
