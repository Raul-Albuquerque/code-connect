import type { ComponentProps } from 'react'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 text-sm text-muted ${className}`}
    >
      <input
        type="checkbox"
        className="size-5 cursor-pointer appearance-none rounded border border-primary bg-transparent checked:bg-primary"
        {...props}
      />
      {label}
    </label>
  )
}
