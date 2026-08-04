import type { Metadata } from 'next'
import Image from 'next/image'
import { BookOpen, Clock, Star } from 'lucide-react'
import { BIOGRAPHY_CHAPTERS, SITE_META } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export const metadata: Metadata = {
  title: 'Full Biography - Nyatony Kai Tut',
  description: 'Read the complete life story of Nyatony Kai Chuol Tut - from Wan, Ayod to university graduation and marriage.',
}

const READING_TIME = Math.ceil(
  BIOGRAPHY_CHAPTERS.reduce((acc, ch) => acc + ch.content.split(' ').length, 0) / 200
)

export default function BiographyPage() {
  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-br from-text to-gray-800 dark:from-dark-surface dark:to-dark-bg py-20 px-4 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="container-narrow text-center relative z-10">
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-4">
            The Complete Story
          </p>
          <h1 className="heading-xl text-white mb-4">Full Biography</h1>
          <p className="font-playfair text-xl italic text-white/70 mb-6">
            Nyatony Kai Chuol Tut &mdash; {SITE_META.hometown}
          </p>
          <div className="flex items-center justify-center gap-4 text-white/50 font-inter text-sm">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> {BIOGRAPHY_CHAPTERS.length} Chapters
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> ~{READING_TIME} min read
            </span>
          </div>
        </div>
      </div>

      <div className="container-narrow px-4 sm:px-6">
        {/* Milestones */}
        <AnimateIn direction="up">
          <div className="grid grid-cols-3 gap-4 mb-16">
            {[
              { icon: '🌱', label: 'Born in Wan, Ayod', year: '~2001' },
              { icon: '🎓', label: 'University Graduate', year: '2026' },
              { icon: '💍', label: 'Beautiful Bride', year: '2026' },
            ].map((m) => (
              <div key={m.label} className="card-gold p-5 text-center">
                <div className="text-3xl mb-2">{m.icon}</div>
                <p className="font-playfair text-sm font-semibold text-text dark:text-white">{m.label}</p>
                <p className="font-inter text-xs text-gold mt-1">{m.year}</p>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Chapters */}
        {BIOGRAPHY_CHAPTERS.map((chapter, i) => (
          <AnimateIn key={chapter.id} delay={i * 50} direction="up">
            <article className="mb-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <span className="font-inter text-xs font-bold text-gold">{i + 1}</span>
                </div>
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                  Chapter {i + 1}
                </p>
              </div>

              <h2 className="heading-md text-text dark:text-white mb-6">{chapter.title}</h2>

              {/* Image */}
              <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-8 bg-rose-soft dark:bg-dark-card">
                <Image
                  src={chapter.image || '/images/bio-placeholder.jpg'}
                  alt={chapter.title}
                  fill
                  className="object-cover"
                  sizes="800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Text */}
              <div className="space-y-6">
                {chapter.content.split('\n\n').map((para, pi) => (
                  <p
                    key={pi}
                    className={`font-inter text-[17px] leading-[1.9] text-text dark:text-gray-300 ${
                      pi === 0 ? 'bio-drop-cap' : ''
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {i < BIOGRAPHY_CHAPTERS.length - 1 && (
                <div className="floral-divider mt-14">
                  <Star className="w-4 h-4 text-gold" style={{ fill: 'rgba(201,162,39,0.3)' }} />
                </div>
              )}
            </article>
          </AnimateIn>
        ))}

        {/* End note */}
        <AnimateIn direction="up">
          <div className="text-center py-12 border-t border-gold/20">
            <p className="font-playfair text-2xl italic text-text-muted dark:text-gray-400 mb-4">
              &ldquo;I have been given so much. The only worthy response is to give.&rdquo;
            </p>
            <p className="font-inter text-sm text-gold font-semibold">&mdash; Nyatony Kai Chuol Tut</p>
          </div>
        </AnimateIn>
      </div>
    </div>
  )
}
