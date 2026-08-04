import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export const metadata: Metadata = {
  title: 'Wedding Gallery - Nyatony Kai Tut',
  description: 'Wedding photos of Nyatony Kai Chuol Tut.',
}

const WEDDING_SECTIONS = [
  { label: 'Engagement', icon: '💍', count: 16 },
  { label: 'Traditional Ceremony', icon: '🌿', count: 20 },
  { label: 'Wedding Ceremony', icon: '⛪', count: 24 },
  { label: 'Reception', icon: '🎉', count: 18 },
  { label: 'First Dance', icon: '💃', count: 10 },
  { label: 'Family Celebration', icon: '👨‍👩‍👧‍👦', count: 14 },
]

const EMOJIS = ['💍', '🌿', '⛪', '🎉', '💃', '👨‍👩‍👧‍👦', '💐', '🕊️', '🥂', '❤️', '🎊', '💒', '👰', '🤵', '🌸', '✨']

export default function WeddingGalleryPage() {
  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">

      {/* Header */}
      <div className="relative py-20 px-4 mb-16 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(247,231,231,0.1) 100%)' }} />
        <div className="container-narrow relative z-10">
          <AnimateIn direction="up">
            <div className="text-4xl mb-4">💐</div>
            <h1 className="heading-xl text-white mb-3">Wedding Gallery</h1>
            <p className="font-inter text-white/60">Every moment of a beautiful new beginning</p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <SectionHeading subtitle="Wedding Day" title="The Most Beautiful Day" description="From the traditional ceremony to the reception dance — every frame is a memory." />

        {/* Section tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {WEDDING_SECTIONS.map((sec) => (
            <div key={sec.label} className="card-gold p-4 text-center hover:bg-gold/5 cursor-pointer transition-all">
              <div className="text-2xl mb-2">{sec.icon}</div>
              <p className="font-inter text-xs font-semibold text-text dark:text-white mb-1">{sec.label}</p>
              <p className="font-inter text-xs text-text-muted">{sec.count} photos</p>
            </div>
          ))}
        </div>

        {/* Featured banner */}
        <AnimateIn direction="up">
          <div className="relative aspect-[16/7] rounded-3xl overflow-hidden mb-8 flex items-center justify-center shadow-gold-lg" style={{ background: 'linear-gradient(135deg, #F7E7E7 0%, #FAF9F6 100%)' }}>
            <div className="text-center">
              <div className="text-8xl mb-4">💑</div>
              <p className="font-playfair text-2xl text-text font-bold">The Wedding Day</p>
              <p className="font-inter text-text-muted text-sm">December 2026</p>
            </div>
          </div>
        </AnimateIn>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {EMOJIS.map((emoji, i) => (
            <AnimateIn key={i} delay={i * 40} direction="up">
              <div className="gallery-item rounded-xl aspect-square group overflow-hidden flex items-center justify-center cursor-pointer" style={{ backgroundColor: i % 2 === 0 ? '#F7E7E7' : '#FAF9F6' }}>
                <span className="text-5xl group-hover:scale-125 transition-transform duration-300">{emoji}</span>
                <div className="gallery-overlay rounded-xl" />
              </div>
            </AnimateIn>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="font-inter text-sm text-text-muted italic">
            Add your wedding photos to /public/images/wedding/ to display them here
          </p>
        </div>
      </div>
    </div>
  )
}
