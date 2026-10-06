import { LoginForm } from '../organisms/LoginForm'
import { AuthTemplate } from '../templates/AuthTemplate'

export function LoginPage() {
  return (
    <AuthTemplate
      bannerSrc="/banner.webp"
      bannerWidth={407}
      bannerHeight={636}
      bannerAlt="Pessoa programando em um ambiente com interfaces verdes, logo Code Connect"
    >
      <LoginForm
        onSubmit={(values) => console.log('login', values.login)}
        onSocialLogin={(provider) => console.log('social login', provider)}
      />
    </AuthTemplate>
  )
}
