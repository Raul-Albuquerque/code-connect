import { render, screen } from '@testing-library/react'
import { Label } from './Label'

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
})
