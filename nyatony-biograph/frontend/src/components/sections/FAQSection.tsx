'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { FAQ_ITEMS } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section className="section bg-background dark:bg-dark-bg" id="faq">
      <div className="container-wide">
        <SectionHeading
          subtitle="Frequently Asked"
          title="Questions About Nyatony"
          description="Answers to the most common questions family and friends ask about this extraordinary woman."
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openId === item.id
            return (
              <AnimateIn key={item.id} delay={i * 60} direction="up">
                <div className={cn(
                  'rounded-2xl border transition-all duration-300 overflow-hidden',
                  isOpen
                    ? 'border-gold/40 bg-white dark:bg-dark-card'
                    : 'border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-gold/20'
                )}>
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={cn('font-playfair text-base md:text-lg font-semibold transition-colors', isOpen ? 'text-gold' : 'text-text dark:text-white')}>
                      {item.question}
                    </span>
                    <span className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all', isOpen ? 'bg-gold text-white' : 'bg-gray-100 dark:bg-dark-bg text-text-muted')}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  <div className={cn('overflow-hidden transition-all duration-300', isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="px-6 pb-6">
                      <div className="w-full h-px bg-gold/20 mb-4" />
                      <p className="font-inter text-text-muted dark:text-gray-400 leading-relaxed text-[15px]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
