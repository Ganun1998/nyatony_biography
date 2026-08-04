import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GRADUATION_DATA } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export default function GraduationPreview() {
  return (
    <section className="section bg-text dark:bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, transparent 100%)' }} />
      <div className="container-wide relative z-10">
        <SectionHeading subtitle="Class of 2026" title="Graduation" description={`${GRADUATION_DATA.degree} — ${GRADUATION_DATA.university}`} light />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {GRADUATION_DATA.achievements.map((item, i) => (
            <AnimateIn key={item.title} delay={i * 80} direction="up">
              <div className="rounded-2xl p-5 hover:bg-white/10 transition-all duration-300" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-playfair text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="font-inter text-sm text-gray-400">{item.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
        <AnimateIn direction="up">
          <blockquote className="text-center max-w-2xl mx-auto mb-10">
            <p className="font-playfair text-xl md:text-2xl italic text-white/80">{GRADUATION_DATA.quote}</p>
          </blockquote>
        </AnimateIn>
        <AnimateIn direction="up" delay={200}>
          <div className="flex justify-center gap-4">
            <Link href="/graduation" className="btn-primary">
              View Graduation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/graduation-gallery" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
              Photo Gallery
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
