'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { GRADUATION_DATA } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

// Graceful image component — shows fallback if image is missing
function GradImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-50 to-rose-soft ${className}`}>
        <div className="text-center p-8">
          <span className="text-6xl block mb-3">🎓</span>
          <p className="font-inter text-xs text-text-muted">Add photo: {src}</p>
        </div>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  )
}

export default function GraduationPage() {
  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">

      {/* Hero */}
      <div className="relative bg-text dark:bg-dark-surface py-24 px-4 overflow-hidden mb-16 text-center">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, transparent 100%)' }} />
        <div className="container-wide text-center relative z-10">
          <AnimateIn direction="up">
            {/* Hero profile image or icon */}
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gold/30 shadow-gold-lg mb-6">
              <GradImage
                src="/images/graduation/graduation-profile.jpg"
                alt="Nyatony Graduation"
                className="transition-transform duration-700 hover:scale-110"
              />
              {/* Fallback background */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center" style={{ backgroundColor: 'rgba(201,162,39,0.2)' }}>
                <GraduationCap className="w-10 h-10 text-gold" />
              </div>
            </div>
            <h1 className="heading-xl text-white mb-3">Graduation Day</h1>
            <p className="font-inter text-lg text-white/70 mb-2">{GRADUATION_DATA.degree}</p>
            <p className="font-inter text-base text-gold font-semibold">
              {GRADUATION_DATA.university} &bull; Class of {GRADUATION_DATA.year}
            </p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">

        {/* Key facts */}
        <AnimateIn direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'University', value: GRADUATION_DATA.university, icon: '🏛️' },
              { label: 'Degree', value: 'BA Global Studies', icon: '📜' },
              { label: 'Honours', value: GRADUATION_DATA.honours, icon: '🏆' },
              { label: 'Year', value: GRADUATION_DATA.year, icon: '📅' },
            ].map((fact) => (
              <div key={fact.label} className="card-gold p-5 text-center">
                <div className="text-2xl mb-2">{fact.icon}</div>
                <p className="font-inter text-xs uppercase tracking-wider text-text-muted mb-1">{fact.label}</p>
                <p className="font-playfair text-sm font-bold text-text dark:text-white">{fact.value}</p>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <AnimateIn direction="left">
            {/* Main graduation image */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-gold-lg border-4 border-gold/20">
              <GradImage
                src="/images/graduation/graduation-main.jpg"
                alt="Nyatony Graduation Ceremony"
                className="hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Caption card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur rounded-2xl p-4">
                  <p className="font-playfair text-base font-bold text-text dark:text-white">
                    Nyatony Kai Chuol Tut
                  </p>
                  <p className="font-inter text-sm text-gold font-semibold mt-0.5">
                    First Female Graduate &bull; {GRADUATION_DATA.university}
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn direction="right">
            <SectionHeading subtitle="A Historic Milestone" title="Breaking New Ground" centered={false} />
            <p className="body-md text-text-muted dark:text-gray-400 mb-6">
              On graduation day, Nyatony Kai Chuol Tut walked across the stage and made history &mdash;
              becoming the first woman in her family to earn a university degree. In a region where
              barriers to women&apos;s education are real and persistent, this achievement is historic.
            </p>
            <p className="body-md text-text-muted dark:text-gray-400 mb-8">
              Her thesis &mdash; <em className="text-gold">&ldquo;{GRADUATION_DATA.thesis}&rdquo;</em> &mdash;
              reflects a woman who never saw education as separate from community.
            </p>
            <blockquote className="bio-pull-quote dark:text-gray-400 mb-8">
              {GRADUATION_DATA.quote}
            </blockquote>
            <Link href="/graduation-gallery" className="btn-primary">
              View Graduation Gallery
            </Link>
          </AnimateIn>
        </div>

        {/* Timeline */}
        <AnimateIn direction="up">
          <SectionHeading subtitle="Journey" title="Education Timeline" />
          <div className="max-w-2xl mx-auto mb-16">
            {GRADUATION_DATA.timeline.map((item, i) => (
              <div key={i} className="bio-timeline-marker last:after:hidden">
                <div className="bg-white dark:bg-dark-card rounded-xl px-5 py-4 shadow-card border border-gray-100 dark:border-dark-border hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-sm font-bold text-gold min-w-[52px]">{item.year}</span>
                    <p className="font-inter text-sm text-text dark:text-gray-300">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Achievements */}
        <div>
          <SectionHeading subtitle="Recognition" title="Achievements" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GRADUATION_DATA.achievements.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 80} direction="up">
                <div className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-2">{item.title}</h3>
                  <p className="font-inter text-sm text-text-muted">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
