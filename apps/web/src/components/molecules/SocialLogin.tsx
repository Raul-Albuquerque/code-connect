import { Divider } from '../atoms/Divider'
import { SocialButton } from '../atoms/SocialButton'

export type SocialProvider = 'github' | 'google'

const providers: { id: SocialProvider; label: string; src: string; width: number; height: number }[] = [
  { id: 'github', label: 'Entrar com Github', src: '/github.png', width: 40, height: 55 },
  { id: 'google', label: 'Entrar com Gmail', src: '/gmail.png', width: 33, height: 51 },
]

type SocialLoginProps = {
  onSelect?: (provider: SocialProvider) => void
}

export function SocialLogin({ onSelect }: SocialLoginProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Divider>ou entre com outras contas</Divider>
      <div className="flex items-start gap-6">
        {providers.map(({ id, label, src, width, height }) => (
          <SocialButton
            key={id}
            src={src}
            width={width}
            height={height}
            label={label}
            onClick={() => onSelect?.(id)}
          />
        ))}
      </div>
    </div>
  )
}
