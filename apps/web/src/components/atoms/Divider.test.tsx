import { render, screen } from '@testing-library/react'
import { Divider } from './Divider'
import { expectNoA11yViolations } from '../../test/axe'

describe('Divider', () => {
  it('renders the centered text', () => {
    render(<Divider>ou entre com outras contas</Divider>)
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
  })

  it('renders a plain separator without text', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('has no WCAG 2 AA violations', async () => {
    const { container } = render(<Divider>ou entre com outras contas</Divider>)
    await expectNoA11yViolations(container)
  })
})
