import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { FAMILY_MEMBERS } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'


export default function FamilySection() {
  // Show only the first 3 members on the homepage
  const preview = FAMILY_MEMBERS.slice(0, 3)

  return (
    <section className="section bg-background-secondary dark:bg-dark-surface" id="family">
      <div className="container-wide">
        <SectionHeading
          subtitle="Family Reflection"
          title="Words from the Heart"
          description="The people who raised, guided, and cheered for Nyatony share their love and pride."
        />

        {/* 3-column preview grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {preview.map((member, i) => (
            <AnimateIn key={member.id} delay={i * 100} direction="up">
              <div className="card group hover:-translate-y-2 transition-transform duration-300 p-7 text-center h-full flex flex-col">


                {/* Name */}
                <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-0.5">
                  {member.name}
                </h3>

                {/* Relationship */}
                <p className="font-inter text-xs uppercase tracking-widest text-gold font-semibold mb-2">
                  {member.relationship}
                </p>

                {/* Descriptor badge */}
                <span
                  className="inline-block px-3 py-0.5 rounded-full text-xs font-inter font-medium text-text-muted mb-5 self-center"
                  style={{ backgroundColor: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)' }}
                >
                  {member.descriptor}
                </span>

                {/* Truncated message — first 200 chars */}
                <div className="flex-1 relative">
                  <Heart
                    className="w-4 h-4 absolute -top-1 left-0 opacity-30"
                    style={{ color: '#C9A227' }}
                  />
                  <p className="font-inter text-sm text-text-muted dark:text-gray-400 leading-relaxed italic pl-5">
                    &ldquo;{member.message.length > 160
                      ? member.message.slice(0, 160) + '…'
                      : member.message}&rdquo;
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* "View all" call-to-action */}
        <AnimateIn direction="up" delay={300}>
          <div className="text-center">
            <p className="font-inter text-sm text-text-muted dark:text-gray-400 mb-5">
              {FAMILY_MEMBERS.length - 3} more family members have shared their heartfelt words.
            </p>
            <Link href="/family-gallery" className="btn-primary">
              Read All Family Messages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
