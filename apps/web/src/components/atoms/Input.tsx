import type { ComponentProps } from 'react'

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={`w-full rounded-md bg-input px-4 py-2.5 text-sm text-page placeholder:text-page/70 ${className}`}
      {...props}
    />
  )
}
