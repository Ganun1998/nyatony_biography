import type { Metadata } from 'next'
import Image from 'next/image'
import { Download } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export const metadata: Metadata = {
  title: 'Graduation Gallery - Nyatony Kai Tut',
  description: 'Photos from the graduation of Nyatony Kai Chuol Tut - campus life, ceremony, and celebrations.',
}

const GRAD_CATEGORIES = [
  { label: 'Ceremony', count: 12 },
  { label: 'Campus Life', count: 8 },
  { label: 'Friends', count: 10 },
  { label: 'Lecturers', count: 6 },
  { label: 'Family Celebrations', count: 8 },
]

export default function GraduationGalleryPage() {
  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">

      {/* Header */}
      <div className="relative bg-text dark:bg-dark-surface py-20 px-4 mb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-gold/15 to-transparent" />
        <div className="container-narrow relative z-10">
          <AnimateIn direction="up">
            <div className="text-4xl mb-4">🎓</div>
            <h1 className="heading-xl text-white mb-3">Graduation Gallery</h1>
            <p className="font-inter text-white/60">The day a dream became a diploma</p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Class of 2026"
          title="Captured Moments"
          description="Every photograph from the ceremony, the campus, and the celebrations that followed."
        />

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {GRAD_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 font-inter text-sm text-text dark:text-white"
            >
              {cat.label}
              <span className="w-5 h-5 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center font-bold">
                {cat.count}
              </span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <AnimateIn key={n} delay={n * 40} direction="up">
              <div
                className={`gallery-item rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-card group ${
                  n === 1 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ aspectRatio: n === 1 ? '1' : '4/3' }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={`/images/graduation/grad-${n}.jpg`}
                    alt={`Graduation photo ${n}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="gallery-overlay rounded-xl" />
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Download CTA */}
        <AnimateIn direction="up">
          <div className="text-center bg-background-secondary dark:bg-dark-surface rounded-3xl p-8">
            <h3 className="font-playfair text-xl font-bold text-text dark:text-white mb-2">Download Photos</h3>
            <p className="font-inter text-sm text-text-muted mb-5">
              High-resolution graduation photos are available for family and friends to download.
            </p>
            <button className="btn-primary">
              <Download className="w-4 h-4" /> Download Gallery
            </button>
          </div>
        </AnimateIn>
      </div>
    </div>
  )
}
