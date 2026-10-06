import type { ComponentProps } from 'react'

type SocialButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  src: string
  label: string
  width?: number
  height?: number
}

export function SocialButton({
  src,
  label,
  width,
  height,
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
      <img src={src} alt="" width={width} height={height} />
    </button>
  )
}
