import type { ComponentProps } from 'react'

type SocialButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  src: string
  label: string
}

export function SocialButton({
  src,
  label,
  className = '',
  ...props
}: SocialButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`cursor-pointer transition-opacity hover:opacity-80 ${className}`}
      {...props}
    >
      <img src={src} alt="" />
    </button>
  )
}
