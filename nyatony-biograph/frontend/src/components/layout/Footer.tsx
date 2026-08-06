import Link from 'next/link'
import { Heart, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react'
import { SITE_META } from '@/data/siteData'

const FOOTER_LINKS = {
  Pages: [
    { href: '/biography', label: 'Full Biography' },
    { href: '/graduation', label: 'Graduation' },
    { href: '/wedding', label: 'Wedding' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ],
  Gallery: [
    { href: '/family-gallery', label: 'Family Gallery' },
    { href: '/childhood', label: 'Childhood' },
    { href: '/graduation-gallery', label: 'Graduation Gallery' },
    { href: '/wedding-gallery', label: 'Wedding Gallery' },
  ],
  Story: [
    { href: '/#story', label: 'The Story' },
    { href: '/#family', label: 'Family Reflection' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#guestbook', label: 'Guestbook' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-text dark:bg-dark-bg text-white">
      <div className="container-wide px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-playfair text-2xl font-bold mb-2">Nyatony Kai Chuol</h3>
            <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: '#C9A227' }} />
            <p className="font-inter text-gray-400 text-sm leading-relaxed mb-6">
              A biography, graduation portfolio, and wedding tribute — preserving the story of faith,
              education, perseverance, and love for generations to come.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: SITE_META.social.facebook, icon: <Facebook className="w-4 h-4" />, label: 'Facebook' },
                { href: SITE_META.social.instagram, icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                { href: SITE_META.social.twitter, icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-inter font-semibold text-sm uppercase tracking-widest text-gold mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-inter text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <a href={`mailto:${SITE_META.email}`} className="flex items-center gap-2 font-inter text-sm text-gray-400 hover:text-gold transition-colors">
            <Mail className="w-4 h-4" />{SITE_META.email}
          </a>
          <a href={`tel:${SITE_META.phone}`} className="flex items-center gap-2 font-inter text-sm text-gray-400 hover:text-gold transition-colors">
            <Phone className="w-4 h-4" />{SITE_META.phone}
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-wide px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-inter text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Nyatony Kai Chuol. All rights reserved.
          </p>
          <p className="font-inter text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-gold" style={{ fill: '#C9A227' }} /> for a remarkable woman
          </p>
        </div>
      </div>
    </footer>
  )
}
