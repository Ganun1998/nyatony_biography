import type { Metadata } from 'next'
import Image from 'next/image'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export const metadata: Metadata = {
  title: 'Childhood - Nyatony Kai Tut',
  description: 'Childhood memories of Nyatony Kai Chuol Tut - life in Wan, Ayod, South Sudan.',
}

const CHILDHOOD_MEMORIES = [
  { year: '~2001', title: 'Born in Wan, Ayod', desc: 'Nyatony entered the world in the village of Wan, Ayod County, Jonglei State, South Sudan - surrounded by family, community, and the open landscape of her homeland.', icon: '🌅' },
  { year: '~2006', title: 'First Steps to School', desc: 'At age five, Nyatony began her educational journey, walking daily to a local school. Her curiosity was evident from her very first days in a classroom.', icon: '📚' },
  { year: '~2008', title: 'A Love of Stories', desc: "Her grandmother's evening storytelling sessions became a cornerstone of her childhood - tales of ancestors, resilience, and identity that she carries to this day.", icon: '🌙' },
  { year: '~2010', title: 'Community Life', desc: 'Traditional games, village ceremonies, and the rhythm of community life shaped her character. She was known for her laughter and her willingness to help others.', icon: '🌿' },
  { year: '~2012', title: 'Reading Under the Acacia Tree', desc: 'Neighbors still speak of the young Nyatony who would sit beneath the large acacia tree with any book she could find, reading through the heat of the afternoon.', icon: '🌳' },
  { year: '~2015', title: 'Primary School Completion', desc: 'Nyatony completed her primary education with distinction, laying the foundation for the academic journey that would follow.', icon: '🎯' },
]

export default function ChildhoodPage() {
  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-text to-gray-700 dark:from-dark-surface dark:to-dark-bg py-20 px-4 mb-16 overflow-hidden text-center">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="container-narrow relative z-10">
          <AnimateIn direction="up">
            <div className="text-4xl mb-4">🌱</div>
            <h1 className="heading-xl text-white mb-3">Childhood</h1>
            <p className="font-inter text-white/60">Wan, Ayod, South Sudan</p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Early Life"
          title="Where It All Began"
          description="A childhood rooted in community, storytelling, and an unquenchable thirst for learning."
        />

        {/* Opening quote */}
        <AnimateIn direction="up">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <p className="font-playfair text-xl italic text-text-muted dark:text-gray-400 leading-relaxed">
              &ldquo;Every great story has a humble beginning. Nyatony&apos;s began in a village where the earth was red, the sky was wide, and the community was everything.&rdquo;
            </p>
          </div>
        </AnimateIn>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <AnimateIn key={n} delay={n * 60} direction="up">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-rose-soft dark:bg-dark-card group">
                <Image
                  src={`/images/childhood/child-${n}.jpg`}
                  alt={`Childhood memory ${n}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="33vw"
                />
                <div className="gallery-overlay rounded-2xl" />
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Timeline */}
        <SectionHeading subtitle="Timeline" title="Growing Up" />
        <div className="max-w-2xl mx-auto space-y-4">
          {CHILDHOOD_MEMORIES.map((memory, i) => (
            <AnimateIn key={memory.year} delay={i * 80} direction="up">
              <div className="card flex gap-4 p-5 hover:-translate-y-0.5 transition-transform">
                <div className="text-3xl flex-shrink-0">{memory.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-inter text-xs font-bold text-gold">{memory.year}</span>
                    <h3 className="font-playfair font-bold text-text dark:text-white">{memory.title}</h3>
                  </div>
                  <p className="font-inter text-sm text-text-muted dark:text-gray-400 leading-relaxed">{memory.desc}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Village context */}
        <AnimateIn direction="up">
          <div className="mt-16 bg-rose-soft dark:bg-dark-surface rounded-3xl p-8 md:p-12 text-center">
            <h3 className="heading-md text-text dark:text-white mb-4">Wan, Ayod &mdash; A Place of Roots</h3>
            <p className="font-inter text-text-muted dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Ayod County in Jonglei State is a land of great cultural richness and significant hardship. The Nuer people who call it home have a tradition of resilience, communal care, and storytelling that runs deep. It is from this soil that Nyatony grew &mdash; and she carries its richness with her wherever she goes.
            </p>
            <div className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-gold">
              <span>📍</span> Wan, Ayod, Jonglei State, South Sudan
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  )
}
