import type { ReactNode } from 'react'
import { ChainShape } from '../atoms/ChainShape'

type AuthTemplateProps = {
  bannerSrc: string
  bannerAlt: string
  children: ReactNode
}

export function AuthTemplate({ bannerSrc, bannerAlt, children }: AuthTemplateProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page p-4">
      <ChainShape className="absolute -top-16 left-[8%] hidden h-[480px] md:block" />
      <ChainShape className="absolute -bottom-24 right-[6%] hidden h-[480px] md:block" />

      <section className="relative z-10 flex w-full max-w-5xl items-center justify-center gap-16 rounded-3xl bg-surface p-8 md:p-[77px]">
        <img
          src={bannerSrc}
          alt={bannerAlt}
          className="hidden h-auto w-[407px] shrink-0 md:block"
        />
        {children}
      </section>
    </main>
  )
}
