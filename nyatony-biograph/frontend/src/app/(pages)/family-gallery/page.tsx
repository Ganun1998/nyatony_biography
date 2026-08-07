import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { FAMILY_MEMBERS } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export const metadata: Metadata = {
  title: 'Family Reflections — Nyatony Kai Tut',
  description:
    'Read the full heartfelt messages from every family member of Nyatony Kai Chuol Tut — their pride, love, and blessings.',
}

export default function FamilyGalleryPage() {
  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">

      {/* Page header */}
      <div
        className="relative py-20 px-4 mb-16 overflow-hidden text-center"
        style={{ background: 'linear-gradient(135deg, #1F2937 0%, #2d3748 100%)' }}
      >
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, transparent 60%)' }} />
        <div className="container-narrow relative z-10">
          <AnimateIn direction="up">
            <div className="text-4xl mb-4">💛</div>
            <h1 className="heading-xl text-white mb-3">Family Reflections</h1>
            <p className="font-inter text-white/60 max-w-xl mx-auto">
              Every person who loves Nyatony has been given a voice here. Read their full words — unfiltered, heartfelt, and true.
            </p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">

        {/* Back link */}
        <AnimateIn direction="up">
          <div className="mb-10">
            <Link href="/#family" className="inline-flex items-center gap-2 font-inter text-sm text-text-muted hover:text-gold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to homepage
            </Link>
          </div>
        </AnimateIn>

        <SectionHeading
          subtitle="Words from the Heart"
          title="What the Family Says"
          description={`${FAMILY_MEMBERS.length} family members across South Sudan, Ethiopia, and Uganda have shared their pride, their love, and their blessings for Nyatony.`}
        />

        {/* Intro quote */}
        <AnimateIn direction="up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <blockquote
              className="font-playfair text-xl italic leading-relaxed text-text-muted dark:text-gray-400 px-8 py-6 rounded-2xl"
              style={{ backgroundColor: 'rgba(201,162,39,0.05)', borderLeft: '4px solid #C9A227' }}
            >
              &ldquo;You cannot understand who Nyatony is without understanding the family that raised her — the sacrifices they made, the love they gave freely, and the values they pressed into her heart every single day.&rdquo;
            </blockquote>
          </div>
        </AnimateIn>

        {/* All family member cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {FAMILY_MEMBERS.map((member, i) => (
            <AnimateIn key={member.id} delay={i * 80} direction="up">
              <article className="card p-8 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">

                {/* Member header — no avatar, just name, relationship, descriptor */}
                <div className="mb-6 pb-6 border-b border-gray-100 dark:border-dark-border">
                  <h3 className="font-playfair text-xl font-bold text-text dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="font-inter text-xs uppercase tracking-widest text-gold font-semibold mb-3">
                    {member.relationship}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter font-semibold"
                    style={{
                      backgroundColor: 'rgba(201,162,39,0.1)',
                      color: '#C9A227',
                      border: '1px solid rgba(201,162,39,0.3)',
                    }}
                  >
                    ✦ {member.descriptor}
                  </span>
                </div>

                {/* Full message */}
                <div className="flex-1 relative">
                  <Heart className="w-5 h-5 absolute -top-1 -left-1 opacity-20" style={{ color: '#C9A227' }} />
                  <p className="font-inter text-base text-text-muted dark:text-gray-400 leading-[1.9] italic pl-6">
                    &ldquo;{member.message}&rdquo;
                  </p>
                </div>

                {/* Counter */}
                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-dark-border/50 text-right">
                  <span className="font-inter text-xs text-gold/50 font-semibold">
                    #{i + 1} of {FAMILY_MEMBERS.length}
                  </span>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>

        {/* Summary banner */}
        <AnimateIn direction="up">
          <div
            className="rounded-3xl p-10 md:p-14 text-center mb-12"
            style={{ background: 'linear-gradient(135deg, #1F2937 0%, #2d3748 100%)' }}
          >
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">
              One Family. One Story. One Legacy.
            </h3>
            <p className="font-inter text-white/65 max-w-2xl mx-auto leading-relaxed mb-8">
              From South Sudan to Ethiopia to Uganda — Nyatony&apos;s family is scattered across countries,
              but united in their pride for the woman she has become. She is Educated. Confident.
              Patient. Independent. Respectful. Golden.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {FAMILY_MEMBERS.map((m) => (
                <span
                  key={m.id}
                  className="px-4 py-1.5 rounded-full font-inter text-sm font-semibold"
                  style={{
                    backgroundColor: 'rgba(201,162,39,0.15)',
                    color: '#E8C84A',
                    border: '1px solid rgba(201,162,39,0.3)',
                  }}
                >
                  {m.descriptor}
                </span>
              ))}
            </div>
          </div>
        </AnimateIn>

        {/* CTAs */}
        <AnimateIn direction="up">
          <div className="text-center flex flex-wrap justify-center gap-4">
            <Link href="/biography" className="btn-primary">
              Read Her Full Biography
            </Link>
            <Link href="/#guestbook" className="btn-secondary">
              <Heart className="w-4 h-4" /> Leave Your Blessing
            </Link>
          </div>
        </AnimateIn>
      </div>
    </div>
  )
}
