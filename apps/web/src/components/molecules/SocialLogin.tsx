import { Divider } from '../atoms/Divider'
import { SocialButton } from '../atoms/SocialButton'

export type SocialProvider = 'github' | 'google'

const providers: { id: SocialProvider; label: string; src: string }[] = [
  { id: 'github', label: 'Entrar com Github', src: '/github.png' },
  { id: 'google', label: 'Entrar com Gmail', src: '/gmail.png' },
]

type SocialLoginProps = {
  onSelect?: (provider: SocialProvider) => void
}

export function SocialLogin({ onSelect }: SocialLoginProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Divider>ou entre com outras contas</Divider>
      <div className="flex items-start gap-6">
        {providers.map(({ id, label, src }) => (
          <SocialButton
            key={id}
            src={src}
            label={label}
            onClick={() => onSelect?.(id)}
          />
        ))}
      </div>
    </div>
  )
}
