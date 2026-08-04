'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GALLERY_CATEGORIES } from '@/data/siteData'
import { galleryApi, type GalleryImage } from '@/lib/api'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function GalleryPreview() {
  const [images, setImages]   = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    galleryApi.getAll()
      .then(r => setImages(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Show up to 8 images as preview
  const preview = images.slice(0, 8)

  // Count per category from real data
  const catCount = (id: string) => images.filter(i => i.category === id).length

  return (
    <section className="section bg-background dark:bg-dark-bg" id="gallery-preview">
      <div className="container-wide">
        <SectionHeading
          subtitle="Gallery"
          title="Moments in Time"
          description="A glimpse into childhood, graduation, wedding, and family life."
        />

        {/* Category badges with live counts */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {GALLERY_CATEGORIES.map((cat) => {
            const count = catCount(cat.id) || cat.count
            return (
              <Link
                key={cat.id}
                href={`/gallery?category=${cat.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 hover:border-gold hover:bg-gold/5 font-inter text-sm text-text dark:text-white transition-all"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-text-muted text-xs">({count})</span>
              </Link>
            )
          })}
        </div>

        {/* Loading shimmer */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {Array(8).fill(0).map((_, i) => (
              <div
                key={i}
                className={cn('rounded-xl animate-pulse bg-gray-100 dark:bg-dark-card', i === 0 || i === 5 ? 'md:row-span-2' : '')}
                style={{ aspectRatio: i === 0 || i === 5 ? '3/4' : '4/3' }}
              />
            ))}
          </div>
        )}

        {/* Real photo grid — equal columns, uniform aspect ratio */}
        {!loading && preview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
            {preview.map((item, i) => (
              <AnimateIn key={item._id} delay={Math.min(i * 50, 300)} direction="up">
                <Link
                  href="/gallery"
                  className="block rounded-xl overflow-hidden group bg-gray-100 dark:bg-dark-card border border-gray-100 dark:border-dark-border"
                  aria-label={item.title}
                  style={{ display: 'block' }}
                >
                  {/* Uniform 1:1 square for all thumbnails */}
                  <div style={{ paddingTop: '100%', position: 'relative' }}>
                    <img
                      src={`${API_BASE}${item.imageUrl}`}
                      alt={item.title}
                      style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      className="group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }} className="group-hover:bg-black/25" />
                    {/* Category badge */}
                    <div style={{ position: 'absolute', top: 8, left: 8 }}>
                      <span className="bg-gold/85 text-white text-[10px] font-inter font-semibold px-2 py-0.5 rounded-full capitalize">
                        {item.category}
                      </span>
                    </div>
                    {/* Caption */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100">
                      <p className="font-inter text-xs text-white font-medium truncate">{item.title}</p>
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        )}

        {/* Empty state — no photos uploaded yet */}
        {!loading && preview.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
            {Array(8).fill(0).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-dashed border-gray-200 dark:border-dark-border overflow-hidden"
              >
                <div style={{ paddingTop: '100%', position: 'relative', backgroundColor: i % 2 === 0 ? '#F7E7E7' : '#FAF9F6' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    {['🎓', '💍', '👨‍👩‍👧', '🌱', '🎓', '💍', '👨‍👩‍👧', '🌱'][i]}
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-center py-4">
              <p className="font-inter text-sm text-text-muted">
                No photos uploaded yet. Upload from{' '}
                <Link href="/admin/dashboard" className="text-gold hover:underline font-semibold">
                  Admin Panel → Gallery
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Total count + view all */}
        {images.length > 0 && (
          <div className="text-center">
            <p className="font-inter text-sm text-text-muted mb-4">
              Showing {preview.length} of {images.length} photos
            </p>
            <Link href="/gallery" className="btn-primary">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        {images.length === 0 && !loading && (
          <div className="text-center">
            <Link href="/gallery" className="btn-primary">
              View Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
