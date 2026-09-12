import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
}

export default function ScrollReveal({ children, className = '', delay = 0 }: Props) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('is-visible')
      return
    }

    let fallbackTimer: number | undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible')
          observer.unobserve(element)
          if (fallbackTimer) window.clearTimeout(fallbackTimer)
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px -20px' },
    )

    observer.observe(element)
    fallbackTimer = window.setTimeout(() => element.classList.add('is-visible'), 1400)
    return () => {
      observer.disconnect()
      if (fallbackTimer) window.clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
