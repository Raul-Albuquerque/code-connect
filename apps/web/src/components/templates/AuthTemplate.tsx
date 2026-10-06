import type { ReactNode } from 'react'
import { ChainShape } from '../atoms/ChainShape'

// 1x1 transparent GIF: keeps the <img> valid on small viewports without downloading the banner.
const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

type AuthTemplateProps = {
  bannerSrc: string
  bannerAlt: string
  bannerWidth?: number
  bannerHeight?: number
  children: ReactNode
}

export function AuthTemplate({
  bannerSrc,
  bannerAlt,
  bannerWidth,
  bannerHeight,
  children,
}: AuthTemplateProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page p-4">
      <ChainShape className="absolute -top-16 left-1/12 hidden h-120 md:block" />
      <ChainShape className="absolute -bottom-24 right-1/16 hidden h-120 md:block" />

      <section className="relative z-10 flex w-full max-w-5xl items-center justify-center gap-16 rounded-3xl bg-surface p-8 md:p-19">
        <picture>
          <source media="(min-width: 48rem)" srcSet={bannerSrc} />
          <img
            src={emptyImage}
            alt={bannerAlt}
            width={bannerWidth}
            height={bannerHeight}
            decoding="async"
            fetchPriority="high"
            className="hidden h-auto w-102 shrink-0 md:block"
          />
        </picture>
        {children}
      </section>
    </main>
  )
}
