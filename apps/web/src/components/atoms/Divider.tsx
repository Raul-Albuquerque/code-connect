type DividerProps = {
  children?: string
}

export function Divider({ children }: DividerProps) {
  if (!children) return <hr className="w-full border-muted/60" />

  return (
    <div className="flex w-full items-center gap-4 text-sm text-offwhite">
      <span className="h-px flex-1 bg-muted/60" aria-hidden="true" />
      <span>{children}</span>
      <span className="h-px flex-1 bg-muted/60" aria-hidden="true" />
    </div>
  )
}
