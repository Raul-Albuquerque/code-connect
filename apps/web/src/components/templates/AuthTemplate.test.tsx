import { render, screen } from '@testing-library/react'
import { AuthTemplate } from './AuthTemplate'

describe('AuthTemplate', () => {
  it('renders the banner image with its alt text', () => {
    render(
      <AuthTemplate bannerSrc="/banner.png" bannerAlt="Banner de teste">
        <p>conteúdo</p>
      </AuthTemplate>,
    )
    expect(screen.getByAltText('Banner de teste')).toHaveAttribute('src', '/banner.png')
  })

  it('renders its children', () => {
    render(
      <AuthTemplate bannerSrc="/banner.png" bannerAlt="Banner">
        <p>conteúdo</p>
      </AuthTemplate>,
    )
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })
})
