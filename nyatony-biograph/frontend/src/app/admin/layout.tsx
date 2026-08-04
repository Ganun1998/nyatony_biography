import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

export const metadata: Metadata = {
  title: 'Admin Panel — Nyatony Biography',
  description: 'Admin dashboard for Nyatony Kai Tut biography website',
  robots: 'noindex, nofollow',
}

/**
 * Admin layout — intentionally bare.
 * No Navbar, no Footer, no scroll progress bar.
 * The dashboard provides its own complete shell.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
