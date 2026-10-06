import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders the title, fields and links', () => {
    render(<LoginForm />)
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Crie seu cadastro/ })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })

  it('submits the typed values', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Email ou usuário'), 'usuario123')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo')
    await userEvent.click(screen.getByLabelText('Lembrar-me'))
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(onSubmit).toHaveBeenCalledWith({
      login: 'usuario123',
      password: 'segredo',
      remember: false,
    })
  })

  it('reports social login selection', async () => {
    const onSocialLogin = vi.fn()
    render(<LoginForm onSocialLogin={onSocialLogin} />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrar com Github' }))
    expect(onSocialLogin).toHaveBeenCalledWith('github')
  })
})
