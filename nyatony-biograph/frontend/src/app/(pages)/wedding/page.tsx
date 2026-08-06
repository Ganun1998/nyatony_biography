'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Calendar, MapPin } from 'lucide-react'
import { WEDDING_DATA, SITE_META, MUSIC_PLAYLIST } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { getTimeUntil } from '@/lib/utils'
import Image from 'next/image'

export default function WeddingPage() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntil(SITE_META.weddingDate))

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeUntil(SITE_META.weddingDate)), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">
      {/* Hero */}
      <div className="relative bg-text dark:bg-dark-surface py-24 px-4 overflow-hidden mb-16 text-center">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(247,231,231,0.1) 100%)",
          }}
        />
        <div className="relative z-10">
          <AnimateIn direction="up">
            <Heart
              className="w-12 h-12 text-gold mx-auto mb-4"
              style={{ fill: "rgba(201,162,39,0.2)" }}
            />
            <h1 className="heading-xl text-white mb-3">
              {WEDDING_DATA.brideFullName}
            </h1>
            <p className="font-inter text-xl text-gold mb-2">
              &amp; {WEDDING_DATA.groomFullName}
            </p>
            <p className="font-inter text-white/60">
              {WEDDING_DATA.ceremonyDate}
            </p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">
        {/* Love story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <AnimateIn direction="left">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-gold-lg">
              <Image
                src="/images/wedding1.jpg"
                alt={`${WEDDING_DATA.brideFullName} and ${WEDDING_DATA.groomFullName}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimateIn>
          <AnimateIn direction="right">
            <SectionHeading
              subtitle="Their Story"
              title="How It All Began"
              centered={false}
            />
            <p className="body-md text-text-muted dark:text-gray-400 mb-6 font-playfair italic text-lg">
              &ldquo;{WEDDING_DATA.loveStory}&rdquo;
            </p>
            <p className="font-inter text-text-muted dark:text-gray-400 mb-8 leading-relaxed">
              Two people, each walking their own purposeful road, found that the
              roads led to the same horizon. Their love is built on mutual
              respect, shared faith, and the kind of knowing that comes from
              truly seeing another person.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 font-inter text-sm text-text dark:text-white">
                <Calendar className="w-4 h-4 text-gold" />
                {WEDDING_DATA.ceremonyDate}
              </div>
              <div className="flex items-center gap-2 font-inter text-sm text-text dark:text-white">
                <MapPin className="w-4 h-4 text-gold" />
                {WEDDING_DATA.ceremonyVenue}
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Schedule */}
        <AnimateIn direction="up">
          <SectionHeading subtitle="Program" title="Wedding Day Schedule" />
          <div className="max-w-2xl mx-auto space-y-4 mb-16">
            {WEDDING_DATA.schedule.map((item) => (
              <div
                key={item.event}
                className="card flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-transform"
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <h4 className="font-playfair font-bold text-text dark:text-white">
                    {item.event}
                  </h4>
                  <p className="font-inter text-sm text-text-muted">
                    {item.location}
                  </p>
                </div>
                <span className="font-inter text-sm font-semibold text-gold whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Songs */}
        <AnimateIn direction="up">
          <SectionHeading subtitle="Playlist" title="Wedding Songs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {MUSIC_PLAYLIST.map((song, i) => (
              <div key={song.id} className="card flex items-center gap-3 p-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gold font-playfair font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: "rgba(201,162,39,0.1)" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-semibold text-text dark:text-white truncate">
                    {song.title}
                  </p>
                  <p className="font-inter text-xs text-text-muted truncate">
                    {song.artist}
                  </p>
                </div>
                <span className="font-inter text-xs text-text-light">
                  {song.duration}
                </span>
              </div>
            ))}
          </div>
        </AnimateIn>

        <AnimateIn direction="up">
          <div className="text-center">
            <Link href="/wedding-gallery" className="btn-primary mr-4">
              Wedding Gallery
            </Link>
            <Link href="/#guestbook" className="btn-secondary">
              Leave a Blessing
            </Link>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
