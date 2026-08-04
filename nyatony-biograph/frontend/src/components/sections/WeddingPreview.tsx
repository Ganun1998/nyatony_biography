'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { WEDDING_DATA, SITE_META } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { getTimeUntil } from '@/lib/utils'

export default function WeddingPreview() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntil(SITE_META.weddingDate))

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeUntil(SITE_META.weddingDate)), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="section relative overflow-hidden" id="wedding-preview" style={{ backgroundColor: '#F7E7E7' }}>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(201,162,39,0.05)' }} />
      <div className="container-wide relative z-10">
        <SectionHeading subtitle="Coming Soon" title="A New Beginning 💍" description={`${WEDDING_DATA.brideFullName} — ${WEDDING_DATA.ceremonyDate}`} />
        <AnimateIn direction="up">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="font-playfair text-lg md:text-xl italic text-text-muted leading-relaxed">
              &ldquo;{WEDDING_DATA.loveStory}&rdquo;
            </p>
          </div>
        </AnimateIn>

        {/* Countdown */}
        <AnimateIn direction="up" delay={100}>
          <div className="flex justify-center items-center gap-6 sm:gap-10 mb-12">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins' },
              { value: timeLeft.seconds, label: 'Secs' },
            ].map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-6 sm:gap-10">
                <div className="countdown-unit">
                  <div className="countdown-number">{String(unit.value).padStart(2, '0')}</div>
                  <div className="countdown-label">{unit.label}</div>
                </div>
                {i < 3 && <span className="font-playfair text-3xl text-gold font-bold self-start mt-2">:</span>}
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Schedule preview */}
        <AnimateIn direction="up" delay={200}>
          <div className="max-w-lg mx-auto bg-white dark:bg-dark-card rounded-3xl p-6 shadow-card mb-10 border border-gold/10">
            <h3 className="font-playfair text-lg font-bold text-text dark:text-white text-center mb-5">Wedding Day Schedule</h3>
            <ul className="space-y-3">
              {WEDDING_DATA.schedule.slice(0, 4).map((item) => (
                <li key={item.event} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <span className="font-inter text-sm font-semibold text-text dark:text-white">{item.event}</span>
                    <span className="font-inter text-xs text-text-muted ml-2">{item.location}</span>
                  </div>
                  <span className="font-inter text-xs text-gold font-medium">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </AnimateIn>

        <AnimateIn direction="up" delay={300}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/wedding" className="btn-primary">Full Wedding Details <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/wedding-gallery" className="btn-secondary"><Heart className="w-4 h-4" /> Wedding Gallery</Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
