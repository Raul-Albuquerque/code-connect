import type { ComponentProps } from 'react'

export function ChainShape({ className = '', ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 240 360"
      fill="none"
      stroke="currentColor"
      strokeWidth="44"
      aria-hidden="true"
      className={`text-shape ${className}`}
      {...props}
    >
      <rect x="22" y="180" width="140" height="158" rx="70" />
      <rect x="78" y="22" width="140" height="158" rx="70" />
    </svg>
  )
}
