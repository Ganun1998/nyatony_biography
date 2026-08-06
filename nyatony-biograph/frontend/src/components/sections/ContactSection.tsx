'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Facebook, Instagram } from 'lucide-react'
import { SITE_META } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <section className="section bg-background dark:bg-dark-bg" id="contact">
      <div className="container-wide">
        <SectionHeading subtitle="Get in Touch" title="Contact" description="We would love to hear from you — family, friends, and well-wishers are always welcome." />
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Info */}
          <AnimateIn direction="left">
            <div className="space-y-8">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-text dark:text-white mb-4">Let&apos;s Connect</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-5 h-5" />, label: 'Email', value: SITE_META.email, href: `mailto:${SITE_META.email}` },
                  { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: SITE_META.phone, href: `tel:${SITE_META.phone}` },
                  { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Addis Ababa, Ethiopia', href: '#' },
                ].map((item) => (
                  <a key={item.label} href={item.href}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-background-secondary dark:bg-dark-card hover:border-gold/30 border border-transparent hover:shadow-card transition-all group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all" style={{ backgroundColor: 'rgba(201,162,39,0.1)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-inter text-xs text-text-muted uppercase tracking-wider">{item.label}</p>
                      <p className="font-inter text-sm font-semibold text-text dark:text-white">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div>
                <p className="font-inter text-sm font-semibold text-text dark:text-white mb-3">Follow the Journey</p>
                <div className="flex gap-3">
                  {[
                    { icon: <Facebook className="w-4 h-4" />, href: SITE_META.social.facebook, label: 'Facebook' },
                    { icon: <Instagram className="w-4 h-4" />, href: SITE_META.social.instagram, label: 'Instagram' },
                  ].map((s) => (
                    <a key={s.label} href={s.href} aria-label={s.label}
                      className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-text-muted hover:border-gold hover:text-gold hover:bg-gold/10 transition-all">
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Form */}
          <AnimateIn direction="right">
            <div className="bg-background-secondary dark:bg-dark-card rounded-3xl p-8 shadow-card border border-gold/10">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✉️</div>
                  <h4 className="font-playfair text-xl font-bold text-text dark:text-white mb-2">Message Sent!</h4>
                  <p className="font-inter text-sm text-text-muted">We will get back to you as soon as possible.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary mt-6 text-sm">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">Name *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">Subject</label>
                    <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Your message..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-70">
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
                    ) : (<><Send className="w-4 h-4" /> Send Message</>)}
                  </button>
                </form>
              )}
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
