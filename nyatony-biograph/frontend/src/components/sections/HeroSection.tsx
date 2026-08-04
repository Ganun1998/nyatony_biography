'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, Heart, ChevronDown, MapPin } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'

/** Renders the full-screen bg image, falls back gracefully if missing */
function BgImage() {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <Image
      src="/images/nyatony-bg.jpg"
      alt=""
      fill
      priority
      className="object-cover object-center"
      sizes="100vw"
      onError={() => setFailed(true)}
    />
  )
}

/** Renders Nyatony's portrait, falls back to emoji placeholder if missing */
function Portrait() {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative w-full h-full">
      {/* Fallback always rendered behind */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #1a1210 0%, #2a1a0a 100%)' }}
      >
        <span className="text-8xl mb-2">👩‍🎓</span>
        <p className="font-playfair text-xs text-gold font-semibold px-4 text-center leading-snug">
          Place Nyatony&apos;s photo here:<br />
          <span className="opacity-60">/public/images/nyatony-portrait.jpg</span>
        </p>
      </div>
      {/* Actual portrait on top */}
      {!failed && (
        <Image
          src="/images/nyatony-portrait.jpg"
          alt="Nyatony Kai Chuol Tut"
          fill
          priority
          className="object-cover object-top relative z-10"
          sizes="(max-width: 768px) 288px, 360px"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── BACKGROUND IMAGE (full screen) ── */}
      <div className="absolute inset-0 z-0">
        {/* CSS background fallback — elegant dark gradient when no photo yet */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(145deg, #0f0f0f 0%, #1a100a 40%, #0a0a14 100%)',
          }}
        />
        {/* The actual background image — place nyatony-bg.jpg in /public/images/ */}
        <BgImage />
        {/* Dark overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(110deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.65) 100%)',
          }}
        />
        {/* Gold tint at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to top, rgba(201,162,39,0.15), transparent)' }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 container-wide px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Text side ── */}
          <div className="order-2 lg:order-1 text-center lg:text-left">

            <AnimateIn delay={0} direction="up">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 font-inter text-xs font-semibold uppercase tracking-widest border"
                style={{
                  backgroundColor: 'rgba(201,162,39,0.15)',
                  borderColor: 'rgba(201,162,39,0.4)',
                  color: '#E8C84A',
                }}
              >
                <MapPin className="w-3 h-3" /> Wan, Ayod &bull; South Sudan
              </div>
            </AnimateIn>

            <AnimateIn delay={80} direction="up">
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white mb-1">
                Nyatony
              </h1>
              <h1
                className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-1"
                style={{
                  background: 'linear-gradient(135deg, #C9A227 0%, #E8C84A 50%, #C9A227 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Kai Chuol
              </h1>
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white mb-6">
                Tut
              </h1>
            </AnimateIn>

            <AnimateIn delay={160} direction="up">
              <p className="font-playfair text-lg md:text-xl italic text-white/75 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                &ldquo;A Journey of Faith, Education, Perseverance, and Love.&rdquo;
              </p>
            </AnimateIn>

            {/* Badges */}
            <AnimateIn delay={240} direction="up">
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                
              </div>
            </AnimateIn>

            {/* CTAs */}
            <AnimateIn delay={320} direction="up">
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/biography" className="btn-primary">
                  Read Her Story
                </Link>
                <Link
                  href="/#guestbook"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-inter font-semibold transition-all duration-300 border-2 text-white hover:bg-white hover:text-text"
                  style={{ borderColor: 'rgba(255,255,255,0.6)' }}
                >
                  Leave a Blessing
                </Link>
              </div>
            </AnimateIn>
          </div>

          {/* ── Portrait side ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <AnimateIn delay={120} direction="fade">
              <div className="relative">

                {/* Glow rings */}
                <div
                  className="absolute -inset-4 rounded-full animate-pulse"
                  style={{ border: '1px solid rgba(201,162,39,0.25)' }}
                />
                <div
                  className="absolute -inset-8 rounded-full"
                  style={{ border: '1px solid rgba(201,162,39,0.12)' }}
                />

                {/* Portrait circle */}
                <div
                  className="relative w-72 h-72 md:w-[360px] md:h-[360px] rounded-full overflow-hidden"
                  style={{
                    border: '3px solid rgba(201,162,39,0.5)',
                    boxShadow:
                      '0 0 0 8px rgba(201,162,39,0.08), 0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(201,162,39,0.2)',
                  }}
                >
                  {/*
                    Replace /images/nyatony-portrait.jpg with Nyatony's real portrait.
                    Until then a graceful placeholder is shown.
                  */}
                  <Portrait />

                  {/* Bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce z-10">
        <span className="font-inter text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
        <ChevronDown className="w-4 h-4 text-gold" />
      </div>
    </section>
  )
}
