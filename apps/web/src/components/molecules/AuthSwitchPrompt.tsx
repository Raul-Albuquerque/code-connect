import type { ReactNode } from 'react'
import { TextLink } from '../atoms/TextLink'

type AuthSwitchPromptProps = {
  question: string
  linkLabel: string
  href: string
  icon?: ReactNode
}

export function AuthSwitchPrompt({
  question,
  linkLabel,
  href,
  icon,
}: AuthSwitchPromptProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-sm text-offwhite">
      <p>{question}</p>
      <TextLink href={href} variant="primary">
        {linkLabel}
        {icon}
      </TextLink>
    </div>
  )
}
