import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, transparent 100%)',
          }}
        />

        <div className="container-wide text-center relative z-10">
          <AnimateIn direction="up">

            {/* Hero Image */}
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gold/30 shadow-gold-lg mb-6">
              <Image
                src="/images/graduation.jpg"
                alt="Nyatony Graduation"
                fill
                priority
                className="object-cover"
              />
            </div>

            <h1 className="heading-xl text-white mb-3">
              Graduation Day
            </h1>

            <p className="font-inter text-lg text-white/70 mb-2">
              {GRADUATION_DATA.degree}
            </p>

            <p className="font-inter text-base text-gold font-semibold">
              {GRADUATION_DATA.university} &bull; Class of{' '}
              {GRADUATION_DATA.year}
            </p>

          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* Left Image */}
          <AnimateIn direction="left">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-gold-lg border-4 border-gold/20">

              <Image
                src="/images/graduation.jpg"
                alt="Nyatony Graduation Ceremony"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur rounded-2xl p-4">
                  <p className="font-inter text-sm font-semibold text-gold">
                    First Female Graduate &bull; {GRADUATION_DATA.university}
                  </p>
                </div>
              </div>

            </div>
          </AnimateIn>

          {/* Right Content */}
          <AnimateIn direction="right">

            <SectionHeading
              subtitle="A Historic Milestone"
              title="Breaking New Ground"
              centered={false}
            />

            <p className="body-md text-text-muted dark:text-gray-400 mb-6">
              On graduation day, Nyatony walked across the stage and made
              history &mdash; becoming the first woman in her family to earn
              a university degree.
            </p>

            <p className="body-md text-text-muted dark:text-gray-400 mb-8">
              Her thesis &mdash;
              <em className="text-gold">
                &ldquo;{GRADUATION_DATA.thesis}&rdquo;
              </em>
              &mdash; reflects a woman who never saw education as separate
              from community.
            </p>

            <blockquote className="bio-pull-quote dark:text-gray-400 mb-8">
              {GRADUATION_DATA.quote}
            </blockquote>

            <Link
              href="/graduation-gallery"
              className="btn-primary"
            >
              View Graduation Gallery
            </Link>

          </AnimateIn>

        </div>

        {/* Achievements */}
        <div className="mt-16">
          <SectionHeading
            subtitle="Recognition"
            title="Achievements"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GRADUATION_DATA.achievements.map((item, i) => (
              <AnimateIn
                key={item.title}
                delay={i * 80}
                direction="up"
              >
                <div className="card p-6 hover:-translate-y-1 transition-transform duration-300">

                  <div className="text-4xl mb-4">
                    {item.icon}
                  </div>

                  <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="font-inter text-sm text-text-muted">
                    {item.desc}
                  </p>

                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}