import { render, screen } from '@testing-library/react'
import { AuthTemplate } from './AuthTemplate'
import { expectNoA11yViolations } from '../../test/axe'

describe('AuthTemplate', () => {
  it('renders the banner as a desktop-only <picture> source with its alt text', () => {
    const { container } = render(
      <AuthTemplate
        bannerSrc="/banner.webp"
        bannerAlt="Banner de teste"
        bannerWidth={407}
        bannerHeight={636}
      >
        <p>conteúdo</p>
      </AuthTemplate>,
    )
    const source = container.querySelector('picture source')
    expect(source).toHaveAttribute('srcset', '/banner.webp')
    expect(source).toHaveAttribute('media', '(min-width: 48rem)')
    const img = screen.getByAltText('Banner de teste')
    expect(img).not.toHaveAttribute('src', '/banner.webp')
    expect(img).toHaveAttribute('width', '407')
    expect(img).toHaveAttribute('height', '636')
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })

  it('renders its children', () => {
    render(
      <AuthTemplate bannerSrc="/banner.webp" bannerAlt="Banner">
        <p>conteúdo</p>
      </AuthTemplate>,
    )
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(
      <AuthTemplate bannerSrc="/banner.webp" bannerAlt="Banner de teste">
        <p>conteúdo</p>
      </AuthTemplate>,
    )
    await expectNoA11yViolations(container)
  })
})
