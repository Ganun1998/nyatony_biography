import type { Metadata } from 'next'
import ContactSection from '@/components/sections/ContactSection'

export const metadata: Metadata = {
  title: 'Contact - Nyatony Kai Tut',
  description: 'Get in touch with the family of Nyatony Kai Chuol Tut.',
}

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-screen bg-background dark:bg-dark-bg">
      <div className="py-16 px-4 text-center bg-background-secondary dark:bg-dark-surface border-b border-gold/10">
        <p className="font-inter text-sm uppercase tracking-[0.2em] text-gold font-semibold mb-2">Reach Us</p>
        <h1 className="heading-lg text-text dark:text-white">Contact</h1>
        <p className="font-inter text-text-muted dark:text-gray-400 mt-3 max-w-lg mx-auto">
          We&apos;d love to hear from you &mdash; family, friends, and well-wishers are always welcome.
        </p>
      </div>
      <ContactSection />
    </div>
  )
}
