import { useId, type ComponentProps } from 'react'
import { Input } from '../atoms/Input'
import { Label } from '../atoms/Label'

type FormFieldProps = ComponentProps<'input'> & {
  label: string
}

export function FormField({ label, id, className = '', ...props }: FormFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} {...props} />
    </div>
  )
}
