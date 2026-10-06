import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & {
  fullWidth?: boolean
}

export function Button({
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-page transition-opacity hover:opacity-90 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    />
  )
}
