'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { BIOGRAPHY_CHAPTERS } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

// Pull quotes — one per chapter (cycles if chapters > quotes)
const PULL_QUOTES = [
  'From an early age, she displayed curiosity, determination, and a strong desire to learn.',
  'Through their encouragement and support, she developed the confidence and resilience that would later help her succeed.',
  'Her primary school years were marked by hard work, curiosity, and a growing determination to succeed.',
  'Through perseverance and commitment, she remained focused on her education.',
  'University demanded independence, discipline, and resilience — and she embraced each challenge as an opportunity to grow.',
  'She became the first girl in the family to attend and graduate from university — a historic moment.',
  '"I am incredibly proud of the woman you have become." — Grandmother',
]

export default function BiographySection() {
  const [activeChapter, setActiveChapter] = useState(BIOGRAPHY_CHAPTERS[0].id)
  const [readProgress, setReadProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const onScroll = () => {
      const height = el.scrollHeight - el.clientHeight
      setReadProgress(height > 0 ? (el.scrollTop / height) * 100 : 0)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const currentChapter = BIOGRAPHY_CHAPTERS.find((c) => c.id === activeChapter)!
  const chapterIndex = BIOGRAPHY_CHAPTERS.findIndex((c) => c.id === activeChapter)

  return (
    <section className="section bg-background dark:bg-dark-bg" id="story">
      <div className="container-wide">

        {/* Section heading */}
        <SectionHeading
          subtitle="Biography"
          title="The Story of Nyatony Kai Chuol Tut"
        />

        {/* ── Full-width story content ── */}
        <AnimateIn direction="up">
          <div
            ref={contentRef}
            className="max-w-7xl mx-auto max-h-[100vh] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#C9A227 transparent' }}
          >
            {/* Chapter header */}
            <div className="mb-8 text-center">
              <p className="font-inter text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-3">
                Chapter {chapterIndex + 1}
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-text dark:text-white mb-4">
                {currentChapter.title}
              </h2>
              
            </div>

            {/* Chapter hero image */}
            <div className="w-full rounded-2xl overflow-hidden mb-10 relative" style={{ aspectRatio: '21/7' }}>
              {currentChapter.image ? (
                <Image
                  src={currentChapter.image}
                  alt={currentChapter.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  onError={() => {}}
                />
              ) : null}
              {/* Fallback gradient shown under image or when image fails */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    chapterIndex % 3 === 0
                      ? 'linear-gradient(135deg, #FAF9F6 0%, #F7E7E7 100%)'
                      : chapterIndex % 3 === 1
                      ? 'linear-gradient(135deg, #F7E7E7 0%, #FAF9F6 100%)'
                      : 'linear-gradient(135deg, #FAF9F6 0%, #FFF8E7 100%)',
                  zIndex: -1,
                }}
              >
                <span className="text-6xl opacity-30">
                  {chapterIndex === 0 ? '🌟' :
                   chapterIndex === 1 ? '🌱' :
                   chapterIndex === 2 ? '📚' :
                   chapterIndex === 3 ? '🏫' :
                   chapterIndex === 4 ? '🎓' :
                   chapterIndex === 5 ? '🏆' : '❤️'}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6">
                <span className="font-inter text-xs text-white/80 font-semibold uppercase tracking-wider">
                  {currentChapter.title}
                </span>
              </div>
            </div>

            {/* Story text — full width, beautiful reading experience */}
            <div className="space-y-0">
              {currentChapter.content.split('\n\n').map((para, i) => {
                // Insert pull quote after paragraph 2 of each chapter
                const insertQuote = i === 2
                return (
                  <div key={i}>
                    <p
                      className={cn(
                        'font-inter text-[17px] md:text-[18px] leading-[1.95] text-text dark:text-gray-300 mb-7',
                        i === 0 && 'bio-drop-cap'
                      )}
                    >
                      {para}
                    </p>

                    {/* Pull quote after paragraph 2 */}
                    {insertQuote && (
                      <blockquote
                        className="my-10 px-8 py-6 rounded-2xl border-l-4 border-gold relative"
                        style={{ backgroundColor: 'rgba(201,162,39,0.04)' }}
                      >
                        <div
                          className="absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-playfair"
                          style={{ backgroundColor: '#C9A227' }}
                        >
                          &ldquo;
                        </div>
                        <p className="font-playfair text-xl md:text-2xl italic text-text-muted dark:text-gray-400 leading-relaxed mt-2">
                          {PULL_QUOTES[chapterIndex % PULL_QUOTES.length]}
                        </p>
                      </blockquote>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Chapter navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100 dark:border-dark-border">
              <button
                onClick={() => {
                  if (chapterIndex > 0) {
                    setActiveChapter(BIOGRAPHY_CHAPTERS[chapterIndex - 1].id)
                    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                disabled={chapterIndex === 0}
                className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>

              <div className="flex items-center gap-1.5">
                {BIOGRAPHY_CHAPTERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveChapter(BIOGRAPHY_CHAPTERS[i].id)
                      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      i === chapterIndex ? 'bg-gold w-6' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gold/50'
                    )}
                    aria-label={`Go to chapter ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  if (chapterIndex < BIOGRAPHY_CHAPTERS.length - 1) {
                    setActiveChapter(BIOGRAPHY_CHAPTERS[chapterIndex + 1].id)
                    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                disabled={chapterIndex === BIOGRAPHY_CHAPTERS.length - 1}
                className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            </div>

            {/* Read full biography CTA */}
            {chapterIndex === BIOGRAPHY_CHAPTERS.length - 1 && (
              <div className="text-center mt-10 pb-4">
                <p className="font-playfair text-lg italic text-text-muted dark:text-gray-400 mb-4">
                  You have reached the end of Nyatony&apos;s story — for now.
                </p>
                <Link href="/biography" className="btn-primary">
                  Read Full Biography <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
