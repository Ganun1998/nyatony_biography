'use client'

import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  once?: boolean
}

export default function AnimateIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
}: AnimateInProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: once })

  const transforms: Record<string, string> = {
    up: 'translateY(40px)',
    down: 'translateY(-40px)',
    left: 'translateX(40px)',
    right: 'translateX(-40px)',
    fade: 'none',
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : transforms[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
