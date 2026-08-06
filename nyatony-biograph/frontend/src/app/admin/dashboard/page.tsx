'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, BookOpen, Image as ImageIcon, Video, Music,
  MessageSquare, Users, HelpCircle, GraduationCap, Heart,
  Settings, LogOut, Bell, TrendingUp, Upload, Trash2,
  Check, X, Eye, RefreshCw, Plus, ExternalLink
} from 'lucide-react'
import {
  authApi, guestbookApi, contactApi, galleryApi,
  musicApi, videoApi, statsApi, removeToken, getToken,
  type GuestbookEntry, type ContactMessage,
  type GalleryImage, type MusicTrack, type VideoItem,
  type DashboardStats
} from '@/lib/api'
import { cn } from '@/lib/utils'

// ── Sidebar nav items ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard',  id: 'dashboard' },
  { icon: <MessageSquare  className="w-4 h-4" />, label: 'Guestbook',  id: 'guestbook' },
  { icon: <ImageIcon      className="w-4 h-4" />, label: 'Gallery',    id: 'gallery' },
  { icon: <Music          className="w-4 h-4" />, label: 'Music',      id: 'music' },
  { icon: <Video          className="w-4 h-4" />, label: 'Videos',     id: 'videos' },
  { icon: <Eye            className="w-4 h-4" />, label: 'Contact',    id: 'contact' },
  { icon: <BookOpen       className="w-4 h-4" />, label: 'Biography',  id: 'biography' },
  { icon: <Users          className="w-4 h-4" />, label: 'Family',     id: 'family' },
  { icon: <HelpCircle     className="w-4 h-4" />, label: 'FAQ',        id: 'faq' },
  { icon: <GraduationCap  className="w-4 h-4" />, label: 'Graduation', id: 'graduation' },
  { icon: <Heart          className="w-4 h-4" />, label: 'Wedding',    id: 'wedding' },
  { icon: <Settings       className="w-4 h-4" />, label: 'Settings',   id: 'settings' },
]

// ── Toast helper ──────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  // Use a ref so `show` is always stable — never causes useCallback to re-create
  const showRef = useRef((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  })
  return { toast, show: showRef.current }
}

// ── Spinner ───────────────────────────────────────────────────────────────
function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
}

// ── Upload progress bar ───────────────────────────────────────────────────
function UploadProgress({ pct }: { pct: number }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
      <div className="h-full rounded-full bg-gold transition-all duration-200" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// DASHBOARD OVERVIEW PANEL
// ══════════════════════════════════════════════════════════════════════════
function DashboardPanel({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statsApi.get()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Gallery Photos',      value: stats.gallery.total,            icon: '📸', action: 'gallery' },
    { label: 'Guestbook Messages',  value: stats.guestbook.total,          icon: '💌', badge: stats.guestbook.pending, action: 'guestbook' },
    { label: 'Contact Messages',    value: stats.contact.total,            icon: '✉️',  badge: stats.contact.unread,   action: 'contact' },
    { label: 'Music Tracks',        value: stats.music.total,              icon: '🎵', action: 'music' },
    { label: 'Videos',              value: stats.videos.total,             icon: '🎬', action: 'videos' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {loading ? Array(5).fill(0).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-6 w-8 bg-gray-200 dark:bg-dark-border rounded mb-3" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-dark-border rounded mb-2" />
            <div className="h-3 w-24 bg-gray-100 dark:bg-dark-border rounded" />
          </div>
        )) : statCards.map(s => (
          <button key={s.label} onClick={() => onNavigate(s.action)}
            className="card p-5 text-left hover:border-gold/30 border border-transparent transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              {s.badge != null && s.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{s.badge}</span>
              )}
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="font-playfair text-3xl font-bold text-text dark:text-white mb-1">{s.value}</p>
            <p className="font-inter text-sm text-text-muted">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Upload Photos',  icon: '📸', id: 'gallery' },
            { label: 'Add Music',      icon: '🎵', id: 'music' },
            { label: 'Upload Video',   icon: '🎬', id: 'videos' },
            { label: 'Guestbook',      icon: '💌', id: 'guestbook' },
            { label: 'Contact Inbox',  icon: '✉️',  id: 'contact' },
          ].map(a => (
            <button key={a.id} onClick={() => onNavigate(a.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-dark-border hover:border-gold/30 hover:bg-gold/5 transition-all group">
              <span className="text-2xl">{a.icon}</span>
              <span className="font-inter text-xs text-text-muted group-hover:text-gold transition-colors text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// GUESTBOOK PANEL
// ══════════════════════════════════════════════════════════════════════════
function GuestbookPanel() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const { toast, show } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    guestbookApi.getAll()
      .then(r => setEntries(r.data))
      .catch(() => show('Failed to load messages', 'error'))
      .finally(() => setLoading(false))
  }, []) // show is a stable ref — no dependency needed

  useEffect(() => { load() }, [load])

  const approve = async (id: string) => {
    try {
      await guestbookApi.approve(id)
      setEntries(e => e.map(m => m._id === id ? { ...m, isApproved: true } : m))
      show('Message approved')
    } catch { show('Failed to approve', 'error') }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      await guestbookApi.delete(id)
      setEntries(e => e.filter(m => m._id !== id))
      show('Message deleted')
    } catch { show('Failed to delete', 'error') }
  }

  const filtered = entries.filter(e =>
    filter === 'all' ? true : filter === 'pending' ? !e.isApproved : e.isApproved
  )

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['all','pending','approved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-4 py-1.5 rounded-full font-inter text-sm font-medium transition-all capitalize',
                filter === f ? 'bg-gold text-white' : 'border border-gray-200 dark:border-dark-border text-text-muted hover:border-gold')}>
              {f} {f === 'pending' && entries.filter(e => !e.isApproved).length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {entries.filter(e => !e.isApproved).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg text-text-muted hover:text-gold transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div> :
       filtered.length === 0 ? (
         <div className="text-center py-16 text-text-muted font-inter">No messages found.</div>
       ) : (
         <div className="space-y-3">
           {filtered.map(entry => (
             <div key={entry._id} className={cn('card p-5 border-l-4 transition-all',
               entry.isApproved ? 'border-l-green-400' : 'border-l-yellow-400')}>
               <div className="flex items-start justify-between gap-4">
                 <div className="flex items-start gap-3 flex-1 min-w-0">
                   <span className="text-2xl flex-shrink-0">{entry.emoji}</span>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1 flex-wrap">
                       <p className="font-inter font-semibold text-text dark:text-white text-sm">{entry.name}</p>
                       <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold',
                         entry.isApproved ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20')}>
                         {entry.isApproved ? 'Approved' : 'Pending'}
                       </span>
                       <span className="font-inter text-xs text-text-light">
                         {new Date(entry.createdAt).toLocaleDateString()}
                       </span>
                     </div>
                     <p className="font-inter text-sm text-text-muted dark:text-gray-400 leading-relaxed">{entry.message}</p>
                   </div>
                 </div>
                 <div className="flex gap-2 flex-shrink-0">
                   {!entry.isApproved && (
                     <button onClick={() => approve(entry._id)}
                       className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors" title="Approve">
                       <Check className="w-4 h-4" />
                     </button>
                   )}
                   <button onClick={() => del(entry._id)}
                     className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors" title="Delete">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// CONTACT PANEL
// ══════════════════════════════════════════════════════════════════════════
function ContactPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const { toast, show } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    contactApi.getAll()
      .then(r => setMessages(r.data))
      .catch(() => show('Failed to load messages', 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const markRead = async (id: string) => {
    try {
      await contactApi.markRead(id)
      setMessages(m => m.map(msg => msg._id === id ? { ...msg, isRead: true } : msg))
    } catch { /* silent */ }
  }

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg)
    if (!msg.isRead) markRead(msg._id)
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div className="flex justify-between items-center mb-6">
        <p className="font-inter text-sm text-text-muted">
          {messages.filter(m => !m.isRead).length} unread of {messages.length} total
        </p>
        <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg text-text-muted hover:text-gold transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div> :
       messages.length === 0 ? (
         <div className="text-center py-16 text-text-muted font-inter">No contact messages yet.</div>
       ) : (
         <div className="grid md:grid-cols-2 gap-4">
           {/* List */}
           <div className="space-y-2">
             {messages.map(msg => (
               <button key={msg._id} onClick={() => openMessage(msg)}
                 className={cn('w-full text-left p-4 rounded-xl border transition-all',
                   selected?._id === msg._id ? 'border-gold bg-gold/5' : 'border-gray-100 dark:border-dark-border hover:border-gold/30',
                   !msg.isRead && 'font-semibold')}>
                 <div className="flex items-center justify-between mb-1">
                   <span className="font-inter text-sm text-text dark:text-white truncate">{msg.name}</span>
                   {!msg.isRead && <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />}
                 </div>
                 <p className="font-inter text-xs text-text-muted truncate">{msg.subject || msg.message.slice(0, 60)}</p>
                 <p className="font-inter text-xs text-text-light mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
               </button>
             ))}
           </div>

           {/* Detail */}
           {selected ? (
             <div className="card p-6">
               <div className="flex items-start justify-between mb-4">
                 <div>
                   <h3 className="font-playfair text-lg font-bold text-text dark:text-white">{selected.name}</h3>
                   <a href={`mailto:${selected.email}`} className="font-inter text-sm text-gold hover:underline">{selected.email}</a>
                 </div>
                 <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg text-text-muted">
                   <X className="w-4 h-4" />
                 </button>
               </div>
               {selected.subject && <p className="font-inter text-sm font-semibold text-text dark:text-white mb-3">{selected.subject}</p>}
               <p className="font-inter text-sm text-text-muted dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
               <p className="font-inter text-xs text-text-light mt-4">{new Date(selected.createdAt).toLocaleString()}</p>
               <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Message'}`}
                 className="btn-primary mt-4 text-sm w-full justify-center">
                 <ExternalLink className="w-3.5 h-3.5" /> Reply via Email
               </a>
             </div>
           ) : (
             <div className="card p-6 flex items-center justify-center text-text-muted font-inter text-sm">
               Select a message to read
             </div>
           )}
         </div>
       )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// GALLERY PANEL
// ══════════════════════════════════════════════════════════════════════════
function GalleryPanel() {
  const [images, setImages]   = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [category, setCategory] = useState('graduation')
  const [title, setTitle] = useState('')
  const [editId, setEditId]   = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCat, setEditCat] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast, show } = useToast()
  const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
  const CATS = ['childhood', 'graduation', 'wedding', 'family', 'other']

  const load = useCallback(() => {
    setLoading(true)
    galleryApi.getAll()
      .then(r => setImages(r.data))
      .catch(() => show('Failed to load gallery', 'error'))
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return show('Please select an image', 'error')
    const fd = new FormData()
    fd.append('image', file)
    fd.append('title', title || file.name)
    fd.append('category', category)
    setUploading(true); setUploadPct(20)
    try {
      setUploadPct(70)
      const res = await galleryApi.upload(fd)
      setImages(prev => [res.data, ...prev])
      setTitle(''); if (fileRef.current) fileRef.current.value = ''
      setUploadPct(100); show('Image uploaded!')
    } catch (err: unknown) { show(err instanceof Error ? err.message : 'Upload failed', 'error') }
    finally { setTimeout(() => { setUploading(false); setUploadPct(0) }, 800) }
  }

  const startEdit = (img: GalleryImage) => { setEditId(img._id); setEditTitle(img.title); setEditCat(img.category) }

  const saveEdit = async () => {
    if (!editId) return
    try {
      const res = await galleryApi.update(editId, { title: editTitle, category: editCat })
      setImages(prev => prev.map(i => i._id === editId ? res.data : i))
      setEditId(null); show('Image updated!')
    } catch { show('Update failed', 'error') }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this image?')) return
    try { await galleryApi.delete(id); setImages(prev => prev.filter(i => i._id !== id)); show('Image deleted') }
    catch { show('Delete failed', 'error') }
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Edit modal */}
      {editId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setEditId(null)}>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-4">Edit Photo</h3>
            <div className="space-y-4">
              <div>
                <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Title</label>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
                <select value={editCat} onChange={e => setEditCat(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors capitalize">
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEdit} className="btn-primary flex-1 justify-center text-sm"><Check className="w-4 h-4" /> Save</button>
              <button onClick={() => setEditId(null)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload form */}
      <form onSubmit={handleUpload} className="card p-6 mb-6">
        <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-gold" /> Upload New Photo
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Title (optional)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Photo title"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors capitalize">
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Image File</label>
            <input ref={fileRef} type="file" accept="image/*" required
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gold/10 file:text-gold" />
          </div>
        </div>
        {uploading && <div className="mb-3"><UploadProgress pct={uploadPct} /></div>}
        <button type="submit" disabled={uploading} className="btn-primary text-sm disabled:opacity-70">
          {uploading ? <><Spinner /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Photo</>}
        </button>
      </form>

      {/* Grid */}
      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img._id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-card border border-gray-100 dark:border-dark-border">
              <div style={{ paddingTop: '100%', position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${API}${img.imageUrl}`} alt={img.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  className="group-hover:scale-105" />
                {/* Actions overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px' }} className="group-hover:opacity-100">
                  <div className="flex justify-between items-start">
                    <span className="bg-gold/90 text-white text-[10px] font-inter font-semibold px-2 py-0.5 rounded-full capitalize">{img.category}</span>
                    <div className="flex gap-1">
                      {/* Download */}
                      <a href={galleryApi.downloadUrl(img._id)} download
                        className="w-7 h-7 rounded-lg bg-white/20 hover:bg-blue-500 flex items-center justify-center text-white transition-colors" title="Download"
                        onClick={e => e.stopPropagation()}>
                      </a>
                      {/* Edit */}
                      <button onClick={() => startEdit(img)}
                        className="w-7 h-7 rounded-lg bg-white/20 hover:bg-gold flex items-center justify-center text-white transition-colors" title="Edit">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="font-inter text-xs text-white truncate mb-2">{img.title}</p>
                    <button onClick={() => del(img._id)} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-500/90 hover:bg-red-600 text-white text-xs font-semibold transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {images.length === 0 && <div className="col-span-full text-center py-16 text-text-muted font-inter">No photos yet. Upload your first photo above.</div>}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// MUSIC PANEL
// ══════════════════════════════════════════════════════════════════════════
function MusicPanel() {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [form, setForm] = useState({ title: '', artist: '', category: 'Romantic', duration: '' })
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast, show } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    musicApi.getAll()
      .then(r => setTracks(r.data))
      .catch(() => show('Failed to load music', 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return show('Please select an audio file', 'error')
    if (!form.title || !form.artist) return show('Title and artist are required', 'error')
    const fd = new FormData()
    fd.append('audio', file)
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    setUploading(true); setUploadPct(30)
    try {
      setUploadPct(70)
      const res = await musicApi.upload(fd)
      setTracks(prev => [res.data, ...prev])
      setForm({ title: '', artist: '', category: 'Romantic', duration: '' })
      if (fileRef.current) fileRef.current.value = ''
      setUploadPct(100); show('Track uploaded!')
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally { setTimeout(() => { setUploading(false); setUploadPct(0) }, 800) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this track?')) return
    try {
      await musicApi.delete(id)
      setTracks(prev => prev.filter(t => t._id !== id))
      show('Track deleted')
    } catch { show('Delete failed', 'error') }
  }

  const CATS = ['Traditional', 'Christian Wedding', 'Instrumental', 'Romantic', 'Classic']

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <form onSubmit={handleUpload} className="card p-6 mb-6">
        <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-gold" /> Add Music Track
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[
            { key: 'title', label: 'Song Title *', placeholder: 'e.g. A Thousand Years' },
            { key: 'artist', label: 'Artist *', placeholder: 'e.g. Christina Perri' },
            { key: 'duration', label: 'Duration', placeholder: 'e.g. 4:05' },
          ].map(f => (
            <div key={f.key}>
              <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
          ))}
          <div>
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Audio File (.mp3, .wav, .ogg)</label>
          <input ref={fileRef} type="file" accept="audio/*" required
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gold/10 file:text-gold" />
        </div>
        {uploading && <div className="mb-3"><UploadProgress pct={uploadPct} /></div>}
        <button type="submit" disabled={uploading} className="btn-primary text-sm disabled:opacity-70">
          {uploading ? <><Spinner /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Track</>}
        </button>
      </form>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : (
        <div className="space-y-3">
          {tracks.map((t, i) => (
            <div key={t._id} className="card flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold font-playfair font-bold flex-shrink-0" style={{ backgroundColor: 'rgba(201,162,39,0.1)' }}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-inter font-semibold text-text dark:text-white text-sm truncate">{t.title}</p>
                <p className="font-inter text-xs text-text-muted">{t.artist} &bull; {t.category} &bull; {t.duration}</p>
              </div>
              {/* Inline audio preview */}
              <audio controls className="h-8 hidden sm:block" style={{ width: '140px' }}>
                <source src={musicApi.streamUrl(t.src)} />
              </audio>
              {/* Action buttons */}
              <div className="flex gap-1.5 flex-shrink-0">
                <a href={musicApi.downloadUrl(t._id)} download
                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors" title="Download">
                </a>
                <button onClick={() => del(t._id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {tracks.length === 0 && <div className="text-center py-16 text-text-muted font-inter">No music tracks yet.</div>}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// VIDEO PANEL
// ══════════════════════════════════════════════════════════════════════════
function VideoPanel() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [mode, setMode] = useState<'file' | 'youtube'>('youtube')
  const [form, setForm] = useState({ title: '', description: '', category: 'Wedding', youtubeId: '', duration: '' })
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast, show } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    videoApi.getAll()
      .then(r => setVideos(r.data))
      .catch(() => show('Failed to load videos', 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return show('Title is required', 'error')
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
    if (mode === 'file') {
      const file = fileRef.current?.files?.[0]
      if (!file) return show('Please select a video file', 'error')
      fd.append('video', file)
    }
    setUploading(true); setUploadPct(20)
    try {
      setUploadPct(60)
      const res = await videoApi.upload(fd)
      setVideos(prev => [res.data, ...prev])
      setForm({ title: '', description: '', category: 'Wedding', youtubeId: '', duration: '' })
      if (fileRef.current) fileRef.current.value = ''
      setUploadPct(100); show('Video added!')
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : 'Failed to add video', 'error')
    } finally { setTimeout(() => { setUploading(false); setUploadPct(0) }, 800) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this video?')) return
    try {
      await videoApi.delete(id)
      setVideos(prev => prev.filter(v => v._id !== id))
      show('Video deleted')
    } catch { show('Delete failed', 'error') }
  }

  const CATS = ['Graduation', 'Wedding', 'Family', 'Childhood', 'Other']

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <form onSubmit={handleSubmit} className="card p-6 mb-6">
        <h3 className="font-playfair text-lg font-bold text-text dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-gold" /> Add Video
        </h3>
        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          {(['youtube', 'file'] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={cn('px-4 py-1.5 rounded-full font-inter text-sm font-medium transition-all capitalize',
                mode === m ? 'bg-gold text-white' : 'border border-gray-200 dark:border-dark-border text-text-muted hover:border-gold')}>
              {m === 'youtube' ? '▶ YouTube Link' : '📁 Upload File'}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Video title"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Description</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
        </div>
        {mode === 'youtube' ? (
          <div className="mb-4">
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">YouTube Video ID</label>
            <input value={form.youtubeId} onChange={e => setForm(p => ({ ...p, youtubeId: e.target.value }))} placeholder="e.g. dQw4w9WgXcQ (from youtube.com/watch?v=...)"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
        ) : (
          <div className="mb-4">
            <label className="font-inter text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Video File (.mp4, .webm)</label>
            <input ref={fileRef} type="file" accept="video/*"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gold/10 file:text-gold" />
          </div>
        )}
        {uploading && <div className="mb-3"><UploadProgress pct={uploadPct} /></div>}
        <button type="submit" disabled={uploading} className="btn-primary text-sm disabled:opacity-70">
          {uploading ? <><Spinner /> Adding...</> : <><Upload className="w-4 h-4" /> Add Video</>}
        </button>
      </form>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => (
            <div key={v._id} className="card overflow-hidden group">
              <div className="relative bg-gray-100 dark:bg-dark-bg" style={{ aspectRatio: '16/9' }}>
                {v.youtubeId ? (
                  /* YouTube thumbnail — always use img for external URLs */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                    alt={v.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : v.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.thumbnail.startsWith('/uploads') ? `http://localhost:5000${v.thumbnail}` : v.thumbnail}
                    alt={v.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl" style={{ backgroundColor: '#F7E7E7' }}>
                    🎬
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  {v.youtubeId && (
                    <a href={`https://youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noreferrer"
                      className="p-3 bg-white/90 rounded-full hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                      onClick={e => e.stopPropagation()}>
                      <ExternalLink className="w-5 h-5 text-text" />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="font-inter font-semibold text-text dark:text-white text-sm mb-1 truncate">{v.title}</p>
                <p className="font-inter text-xs text-text-muted mb-3">{v.category} {v.duration && `• ${v.duration}`}</p>
                <div className="flex gap-2">
                  {/* Download (only for uploaded files, not YouTube) */}
                  {v.src && !v.youtubeId && (
                    <a href={videoApi.downloadUrl(v._id)} download
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors"> Download
                    </a>
                  )}
                  {v.youtubeId && (
                    <a href={`https://youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> YouTube
                    </a>
                  )}
                  <button onClick={() => del(v._id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && <div className="col-span-full text-center py-16 text-text-muted font-inter">No videos yet. Add your first video above.</div>}
        </div>
      )}
    </div>
  )
}

// ── Toast component ───────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={cn(
      'fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg font-inter text-sm font-medium text-white flex items-center gap-2 animate-fade-in',
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    )}>
      {type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {msg}
    </div>
  )
}

// ── Static placeholder panel for unimplemented sections ──────────────────
function PlaceholderPanel({ section }: { section: string }) {
  const links: Record<string, string> = {
    biography: '/biography', family: '/family-gallery',
    graduation: '/graduation', wedding: '/wedding', faq: '/#faq',
  }
  return (
    <div className="card p-12 text-center max-w-lg mx-auto">
      <div className="text-5xl mb-4">📝</div>
      <h2 className="font-playfair text-2xl font-bold text-text dark:text-white mb-2 capitalize">{section}</h2>
      <p className="font-inter text-text-muted mb-6 text-sm leading-relaxed">
        This section&apos;s content is managed from <code className="bg-gray-100 dark:bg-dark-bg px-2 py-0.5 rounded text-xs">/src/data/siteData.ts</code>.
        Edit that file to update the biography, FAQ, family members, graduation, and wedding information.
      </p>
      {links[section] && (
        <Link href={links[section]} target="_blank" className="btn-primary text-sm">
          <ExternalLink className="w-4 h-4" /> View on Site
        </Link>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  // Desktop: sidebar open by default. Mobile: closed by default.
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [adminName, setAdminName]         = useState('Admin')
  const [pendingCount, setPendingCount]   = useState(0)
  const router = useRouter()

  // Set sidebar open on desktop after mount
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024
    setSidebarOpen(isDesktop)
  }, [])

  useEffect(() => {
    if (!getToken()) { router.replace('/admin'); return }
    authApi.me()
      .then(user => setAdminName(user.name))
      .catch(() => { removeToken(); router.replace('/admin') })
    guestbookApi.getAll()
      .then(r => setPendingCount(r.data.filter((m: GuestbookEntry) => !m.isApproved).length))
      .catch(() => {})
  }, [router])

  const handleLogout = () => { removeToken(); router.push('/admin') }

  // On mobile: close sidebar when a nav item is selected
  const handleNavigate = (id: string) => {
    setActiveSection(id)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardPanel onNavigate={handleNavigate} />
      case 'guestbook': return <GuestbookPanel />
      case 'gallery':   return <GalleryPanel />
      case 'music':     return <MusicPanel />
      case 'videos':    return <VideoPanel />
      case 'contact':   return <ContactPanel />
      default:          return <PlaceholderPanel section={activeSection} />
    }
  }

  const sectionTitles: Record<string, string> = {
    dashboard: 'Dashboard Overview', guestbook: 'Guestbook Moderation',
    gallery: 'Photo Gallery', music: 'Music Tracks', videos: 'Videos',
    contact: 'Contact Messages', biography: 'Biography Content',
    family: 'Family Members', faq: 'FAQ Management',
    graduation: 'Graduation Info', wedding: 'Wedding Info', settings: 'Settings',
  }

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-dark-bg flex overflow-x-hidden">

      {/* ── Mobile backdrop overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{ backgroundColor: '#1F2937', width: '240px' }}
        className={cn(
          'fixed left-0 top-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out',
          // Mobile (<lg): hidden off-screen by default, slides in when open
          // Desktop (lg+): always visible, no transform needed
          sidebarOpen
            ? 'translate-x-0'        // open on all screen sizes
            : '-translate-x-full lg:translate-x-0'  // hidden mobile, visible desktop
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-playfair text-sm font-bold text-white" style={{ backgroundColor: '#C9A227' }}>N</div>
            <div className="min-w-0">
              <p className="font-playfair text-sm font-bold text-white leading-none">Admin Panel</p>
              <p className="font-inter text-xs text-white/40 truncate mt-0.5">{adminName}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                    activeSection === item.id ? 'bg-gold text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-inter text-sm flex-1 truncate">{item.label}</span>
                  {item.id === 'guestbook' && pendingCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 flex-shrink-0 space-y-1">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="font-inter text-sm">View Site</span>
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-white/10 transition-all">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-inter text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main
        className="flex-1 min-w-0 flex flex-col transition-all duration-300 ml-0 lg:ml-[240px]"
      >
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — visible on all sizes */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              <LayoutDashboard className="w-4 h-4 text-text-muted" />
            </button>
            <div className="min-w-0">
              <h1 className="font-playfair text-base sm:text-lg font-bold text-text dark:text-white truncate">
                {sectionTitles[activeSection] || activeSection}
              </h1>
              <p className="font-inter text-xs text-text-muted hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {pendingCount > 0 && (
              <button onClick={() => handleNavigate('guestbook')}
                className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
                <Bell className="w-4 h-4 text-text-muted" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
            )}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-inter text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: '#C9A227' }}>
              {adminName[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}
