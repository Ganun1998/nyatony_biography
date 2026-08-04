import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  subtitle?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
  light?: boolean
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  centered = true,
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && 'text-center', 'mb-12', className)}>
      {subtitle && (
        <p className="font-inter text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2">
          {subtitle}
        </p>
      )}
      <h2 className={cn('heading-lg', light ? 'text-white' : 'text-text dark:text-white')}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'body-md max-w-2xl mt-4',
            centered && 'mx-auto',
            light ? 'text-white/75' : 'text-text-muted dark:text-gray-400'
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
