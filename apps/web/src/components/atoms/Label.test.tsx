import { render, screen } from '@testing-library/react'
import { Label } from './Label'
import { expectNoA11yViolations } from '../../test/axe'

describe('Label', () => {
  it('renders its text and links to the field through htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})
