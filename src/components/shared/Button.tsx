import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
  onClick?: () => void
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = ''
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 tracking-wide'

  const styles =
    variant === 'primary'
      ? 'bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]'
      : 'border border-[var(--color-line-strong)] text-[var(--color-fg)] hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]'

  const merged = `${base} ${styles} ${className}`

  if (href) {
    return (
      <a href={href} className={merged}>
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={merged}>
      {children}
    </button>
  )
}
