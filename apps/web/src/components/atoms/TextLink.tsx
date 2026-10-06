import type { ComponentProps } from 'react'

type TextLinkProps = ComponentProps<'a'> & {
  variant?: 'default' | 'primary'
}

const variants = {
  default: 'text-sm text-offwhite underline',
  primary: 'inline-flex items-center gap-2 text-lg text-primary',
}

export function TextLink({
  variant = 'default',
  className = '',
  ...props
}: TextLinkProps) {
  return <a className={`${variants[variant]} ${className}`} {...props} />
}
