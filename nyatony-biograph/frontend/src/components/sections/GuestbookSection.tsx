'use client'

import { useState } from 'react'
import { Heart, Send, SmilePlus } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

const SAMPLE_ENTRIES = [
  { id: 1, name: 'Atak Deng', emoji: '🎉', message: 'Nyatony, you have made all of us so proud. May your marriage be as beautiful as your journey. God bless you both!', date: 'July 2026' },
  { id: 2, name: 'Nyamach Lual', emoji: '💍', message: 'A true inspiration to every girl in our community. Your story will be told for generations.', date: 'July 2026' },
  { id: 3, name: 'Gatluak Bol', emoji: '🌸', message: 'The first in your family is never just for yourself — you carry everyone. We celebrate you!', date: 'July 2026' },
]

const EMOJI_OPTIONS = ['🎉', '💍', '🌸', '❤️', '🙏', '🎓', '✨', '💐', '🕊️', '🌟']

export default function GuestbookSection() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [emoji, setEmoji] = useState('❤️')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
    setName('')
    setMessage('')
    setEmoji('❤️')
  }

  return (
    <section className="section bg-background-secondary dark:bg-dark-surface" id="guestbook">
      <div className="container-wide">
        <SectionHeading subtitle="Guestbook" title="Leave a Blessing" description="Share your love, prayers, and well-wishes for Nyatony and her family." />
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Form */}
          <AnimateIn direction="left">
            <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-card border border-gold/10">
              <h3 className="font-playfair text-xl font-bold text-text dark:text-white mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-gold" /> Write Your Message
              </h3>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">🙏</div>
                  <h4 className="font-playfair text-xl font-bold text-text dark:text-white mb-2">Thank you for your blessing!</h4>
                  <p className="font-inter text-sm text-text-muted">Your message is awaiting approval.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6 text-sm">Leave Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">Your Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 flex items-center gap-1.5 block">
                      <SmilePlus className="w-4 h-4" /> Choose an Emoji
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map((e) => (
                        <button key={e} type="button" onClick={() => setEmoji(e)}
                          className={cn('w-9 h-9 rounded-full text-lg transition-all hover:scale-110', emoji === e ? 'ring-2 ring-gold bg-gold/10 scale-110' : 'bg-gray-100 dark:bg-dark-bg')}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">Your Blessing *</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share your love, prayers, and well-wishes..." required rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors resize-none" />
                  </div>
                  <p className="font-inter text-xs text-text-muted">Messages are reviewed before appearing publicly.</p>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-70">
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
                    ) : (<><Send className="w-4 h-4" /> Send Blessing</>)}
                  </button>
                </form>
              )}
            </div>
          </AnimateIn>

          {/* Entries */}
          <AnimateIn direction="right">
            <div className="space-y-4">
              <h3 className="font-inter text-sm font-semibold uppercase tracking-widest text-gold mb-6">Recent Blessings</h3>
              {SAMPLE_ENTRIES.map((entry, i) => (
                <AnimateIn key={entry.id} delay={i * 100} direction="up">
                  <div className="guestbook-card bg-white dark:bg-dark-card rounded-2xl p-5 shadow-card border border-transparent hover:border-gold/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-lg flex-shrink-0">{entry.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-inter text-sm font-semibold text-text dark:text-white">{entry.name}</h4>
                          <span className="font-inter text-xs text-text-light">{entry.date}</span>
                        </div>
                        <p className="font-inter text-sm text-text-muted dark:text-gray-400 leading-relaxed">{entry.message}</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              ))}
              <div className="text-center pt-2">
                <p className="font-inter text-sm text-text-muted italic">Be the next to leave a blessing ✨</p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
