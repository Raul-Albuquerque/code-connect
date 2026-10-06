import type { SubmitEvent } from 'react'
import { ArrowRightIcon, ClipboardIcon } from '../atoms/Icon'
import { Button } from '../atoms/Button'
import { Checkbox } from '../atoms/Checkbox'
import { Heading } from '../atoms/Heading'
import { TextLink } from '../atoms/TextLink'
import { AuthSwitchPrompt } from '../molecules/AuthSwitchPrompt'
import { FormField } from '../molecules/FormField'
import { SocialLogin, type SocialProvider } from '../molecules/SocialLogin'

export type LoginValues = {
  login: string
  password: string
  remember: boolean
}

type LoginFormProps = {
  onSubmit?: (values: LoginValues) => void
  onSocialLogin?: (provider: SocialProvider) => void
}

export function LoginForm({ onSubmit, onSocialLogin }: LoginFormProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSubmit?.({
      login: String(data.get('login') ?? ''),
      password: String(data.get('password') ?? ''),
      remember: data.get('remember') === 'on',
    })
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <header className="flex flex-col gap-8">
        <Heading>Login</Heading>
        <p className="text-xl text-offwhite">Boas-vindas! Faça seu login.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField
          label="Email ou usuário"
          name="login"
          placeholder="usuario123"
          autoComplete="username"
          required
        />
        <FormField
          label="Senha"
          name="password"
          type="password"
          placeholder="******"
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between">
          <Checkbox label="Lembrar-me" name="remember" defaultChecked />
          <TextLink href="/esqueci-a-senha">Esqueci a senha</TextLink>
        </div>
        <Button type="submit" fullWidth className="mt-5">
          Login
          <ArrowRightIcon />
        </Button>
      </form>

      <SocialLogin onSelect={onSocialLogin} />

      <AuthSwitchPrompt
        question="Ainda não tem conta?"
        linkLabel="Crie seu cadastro!"
        href="/cadastro"
        icon={<ClipboardIcon />}
      />
    </div>
  )
}
