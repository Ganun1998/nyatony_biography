'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#story', label: 'Story' },
  { href: '/#family', label: 'Family' },
  { href: '/graduation', label: 'Graduation' },
  { href: '/wedding', label: 'Wedding' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="container-wide flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-playfair text-xl font-bold text-text dark:text-white group-hover:text-gold transition-colors">
            Nyatony
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="nav-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-300"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-text dark:text-white" />
            ) : (
              <Sun className="w-4 h-4 text-gold" />
            )}
          </button>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center border border-gold/30 hover:border-gold"
          >
            {open ? <X className="w-4 h-4 text-text dark:text-white" /> : <Menu className="w-4 h-4 text-text dark:text-white" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn('lg:hidden overflow-hidden transition-all duration-300', open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0')}>
        <div className="bg-white/98 dark:bg-dark-surface backdrop-blur-md px-6 pb-6 pt-2 border-t border-gold/10">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-inter text-sm text-text dark:text-gray-200 hover:text-gold border-b border-gray-100 dark:border-dark-border transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
