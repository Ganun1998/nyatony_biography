import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nyatony.com'
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/biography`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/graduation`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/wedding`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/gallery`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/family-gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/childhood`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/graduation-gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/wedding-gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/guestbook`, lastModified: new Date(), priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.5 },
  ]
}
