'use client'

import { useState, useEffect } from 'react'
import { ZoomIn, X, Download, RefreshCw } from 'lucide-react'
import { GALLERY_CATEGORIES } from '@/data/siteData'
import { galleryApi, type GalleryImage } from '@/lib/api'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function GalleryPage() {
  const [images, setImages]               = useState<GalleryImage[]>([])
  const [loading, setLoading]             = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightbox, setLightbox]           = useState<GalleryImage | null>(null)
  const [error, setError]                 = useState('')

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await galleryApi.getAll()
      setImages(res.data || [])
    } catch {
      setError('Could not load photos. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory)

  const imageUrl = (img: GalleryImage) => `${API_BASE}${img.imageUrl}`

  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Photo Gallery"
          title="A Life in Pictures"
          description="Childhood, graduation, wedding, and family — every photograph tells a story."
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn('px-5 py-2 rounded-full font-inter text-sm font-medium transition-all',
              activeCategory === 'all' ? 'bg-gold text-white shadow-gold' : 'border border-gold/30 text-text dark:text-white hover:border-gold')}
          >
            All Photos {images.length > 0 && <span className="ml-1 opacity-60">({images.length})</span>}
          </button>
          {GALLERY_CATEGORIES.map((cat) => {
            const count = images.filter(i => i.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn('px-5 py-2 rounded-full font-inter text-sm font-medium transition-all flex items-center gap-2',
                  activeCategory === cat.id ? 'bg-gold text-white shadow-gold' : 'border border-gold/30 text-text dark:text-white hover:border-gold')}
              >
                <span>{cat.icon}</span>
                {cat.label}
                {count > 0 && <span className="opacity-60 text-xs">({count})</span>}
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ border: '3px solid rgba(201,162,39,0.2)', borderTopColor: '#C9A227' }} />
            <p className="font-inter text-sm text-text-muted">Loading photos...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="font-inter text-sm text-red-500 mb-4">{error}</p>
            <button onClick={fetchImages} className="btn-secondary text-sm flex items-center gap-2 mx-auto">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">
              {activeCategory === 'graduation' ? '🎓' : activeCategory === 'wedding' ? '💍' : activeCategory === 'family' ? '👨‍👩‍👧' : activeCategory === 'childhood' ? '🌱' : '📷'}
            </div>
            <p className="font-inter text-text-muted mb-2">
              {images.length === 0
                ? 'No photos uploaded yet.'
                : `No ${activeCategory} photos yet.`}
            </p>
            <p className="font-inter text-xs text-text-light">
              Upload photos from the Admin Panel → Gallery section.
            </p>
          </div>
        )}

        {/* Photo grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((img, i) => (
              <AnimateIn key={img._id} delay={Math.min(i * 40, 400)} direction="up">
                <button
                  onClick={() => setLightbox(img)}
                  className="relative w-full rounded-xl group overflow-hidden bg-gray-100 dark:bg-dark-card border border-gray-100 dark:border-dark-border block"
                  aria-label={`View ${img.title}`}
                >
                  {/* Square aspect-ratio wrapper */}
                  <div style={{ paddingTop: '100%', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl(img)}
                      alt={img.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      className="group-hover:scale-110"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }} className="group-hover:bg-black/30" />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <ZoomIn className="w-5 h-5 text-gold" />
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: 8, left: 8, opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100">
                      <span className="bg-gold/90 text-white text-xs font-inter font-semibold px-2 py-0.5 rounded-full capitalize">{img.category}</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100">
                      <p className="font-inter text-xs text-white font-medium truncate">{img.title}</p>
                    </div>
                  </div>
                </button>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/97 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <a
              href={`${API_BASE}/api/gallery/${lightbox._id}/download`}
              download
              onClick={e => e.stopPropagation()}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Download photo"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setLightbox(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[88vh] w-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(lightbox)}
              alt={lightbox.title}
              style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="font-playfair text-white font-semibold text-lg">{lightbox.title}</p>
            {lightbox.description && (
              <p className="font-inter text-white/60 text-sm mt-1">{lightbox.description}</p>
            )}
            <span className="inline-block mt-2 bg-gold/80 text-white text-xs font-inter px-3 py-1 rounded-full capitalize">
              {lightbox.category}
            </span>
          </div>

          {/* Navigate arrows */}
          {filtered.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); const i = filtered.findIndex(x => x._id === lightbox._id); setLightbox(filtered[(i - 1 + filtered.length) % filtered.length]) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
              >
                ‹
              </button>
              <button
                onClick={e => { e.stopPropagation(); const i = filtered.findIndex(x => x._id === lightbox._id); setLightbox(filtered[(i + 1) % filtered.length]) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
