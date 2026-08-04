import type { Metadata } from 'next'
import GuestbookSection from '@/components/sections/GuestbookSection'

export const metadata: Metadata = {
  title: 'Guestbook - Nyatony Kai Tut',
  description: 'Leave a blessing and message for Nyatony Kai Chuol Tut.',
}

export default function GuestbookPage() {
  return (
    <div className="pt-24 min-h-screen bg-background dark:bg-dark-bg">
      <div className="py-16 px-4 text-center bg-background-secondary dark:bg-dark-surface border-b border-gold/10">
        <p className="font-inter text-sm uppercase tracking-[0.2em] text-gold font-semibold mb-2">Community</p>
        <h1 className="heading-lg text-text dark:text-white">Guestbook</h1>
        <p className="font-inter text-text-muted dark:text-gray-400 mt-3 max-w-lg mx-auto">
          Your words mean everything. Leave your love, prayers, and memories for Nyatony and her family.
        </p>
      </div>
      <GuestbookSection />
    </div>
  )
}
