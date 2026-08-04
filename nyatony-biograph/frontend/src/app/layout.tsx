import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import BackToTop from '@/components/ui/BackToTop'

export const metadata: Metadata = {
  title: 'Nyatony Kai Tut - Biography, Graduation & Wedding',
  description:
    'The official digital biography, graduation portfolio, and wedding tribute of Nyatony Kai Chuol Tut - a journey of faith, education, perseverance, and love.',
  keywords: ['Nyatony Kai Tut', 'biography', 'graduation', 'wedding', 'South Sudan'],
  openGraph: {
    title: 'Nyatony Kai Tut - A Journey of Faith, Education & Love',
    description: 'The official digital biography and tribute of Nyatony Kai Chuol Tut',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div id="scroll-progress" />
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
