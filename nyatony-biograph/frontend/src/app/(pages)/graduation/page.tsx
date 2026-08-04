import type { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { GRADUATION_DATA } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export const metadata: Metadata = {
  title: 'Graduation - Nyatony Kai Tut',
  description: 'Celebrating the graduation of Nyatony Kai Chuol Tut.',
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'rgba(201,162,39,0.2)' }}>
              <GraduationCap className="w-10 h-10 text-gold" />
            </div>
            <h1 className="heading-xl text-white mb-3">Graduation Day</h1>
            <p className="font-inter text-lg text-white/70 mb-2">{GRADUATION_DATA.degree}</p>
            <p className="font-inter text-base text-gold font-semibold">{GRADUATION_DATA.university} &bull; Class of {GRADUATION_DATA.year}</p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">

        {/* Key facts */}
        <AnimateIn direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'University', value: GRADUATION_DATA.university, icon: '🏛️' },
              { label: 'Degree', value: 'BSc Education', icon: '📜' },
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
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden flex items-center justify-center shadow-gold-lg" style={{ backgroundColor: '#FAF9F6' }}>
              <span className="text-8xl">🎓</span>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 dark:bg-dark-card rounded-2xl p-4">
                  <p className="font-playfair text-lg font-bold text-text dark:text-white">Nyatony Kai Chuol Tut</p>
                  <p className="font-inter text-sm text-gold">First Female Graduate &bull; {GRADUATION_DATA.university}</p>
                </div>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn direction="right">
            <SectionHeading subtitle="A Historic Milestone" title="Breaking New Ground" centered={false} />
            <p className="body-md text-text-muted dark:text-gray-400 mb-6">
              On graduation day, Nyatony Kai Chuol Tut walked across the stage and made history &mdash; becoming the first woman in her family to earn a university degree.
            </p>
            <p className="body-md text-text-muted dark:text-gray-400 mb-8">
              Her thesis &mdash; <em className="text-gold">&ldquo;{GRADUATION_DATA.thesis}&rdquo;</em> &mdash; reflects a woman who never saw education as separate from community.
            </p>
            <blockquote className="bio-pull-quote dark:text-gray-400 mb-8">{GRADUATION_DATA.quote}</blockquote>
            <Link href="/graduation-gallery" className="btn-primary">View Graduation Gallery</Link>
          </AnimateIn>
        </div>

        {/* Timeline */}
        <AnimateIn direction="up">
          <SectionHeading subtitle="Journey" title="Education Timeline" />
          <div className="max-w-2xl mx-auto">
            {GRADUATION_DATA.timeline.map((item, i) => (
              <div key={i} className="bio-timeline-marker last:after:hidden">
                <div className="bg-white dark:bg-dark-card rounded-xl px-5 py-4 shadow-card border border-gray-100 dark:border-dark-border hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-sm font-bold text-gold min-w-[44px]">{item.year}</span>
                    <p className="font-inter text-sm text-text dark:text-gray-300">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Achievements */}
        <div className="mt-16">
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
