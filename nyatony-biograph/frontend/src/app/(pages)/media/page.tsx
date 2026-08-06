'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Download, X, Music, Video as VideoIcon, ArrowLeft, List
} from 'lucide-react'
import { musicApi, videoApi, type MusicTrack, type VideoItem } from '@/lib/api'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function resolveAudioSrc(src: string) {
  return src.startsWith('/uploads') ? `${API_BASE}${src}` : src
}

function resolveVideoThumb(v: VideoItem) {
  if (v.youtubeId) return `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`
  if (v.thumbnail?.startsWith('/uploads')) return `${API_BASE}${v.thumbnail}`
  return v.thumbnail || ''
}

function resolveVideoSrc(v: VideoItem) {
  if (v.youtubeId) return `https://youtube.com/watch?v=${v.youtubeId}`
  if (v.src?.startsWith('/uploads')) return `${API_BASE}${v.src}`
  return v.src || ''
}

// â”€â”€ Mini music player â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MusicPlayer({ tracks }: { tracks: MusicTrack[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying]           = useState(false)
  const [progress, setProgress]         = useState(0)
  const [volume, setVolume]             = useState(0.8)
  const [muted, setMuted]               = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const current = tracks[currentIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => { if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100) }
    const onEnd  = () => { setCurrentIndex(i => (i + 1) % tracks.length); setPlaying(false); setProgress(0) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnd) }
  })

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    if (playing) audio.play().catch(() => setPlaying(false))
  }, [currentIndex]) // eslint-disable-line

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause() } else { audio.play().catch(() => {}) }
    setPlaying(!playing)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio?.duration) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  if (!current) return null

  return (
    <div className="music-player sticky top-24 z-10">
      <div className="flex gap-4 mb-5">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-gold" style={{ backgroundColor: '#F7E7E7' }}>
          {current.artwork
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={current.artwork.startsWith('/uploads') ? `${API_BASE}${current.artwork}` : current.artwork} alt={current.title} className="w-full h-full object-cover rounded-2xl" />
            : 'ðŸŽµ'}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="font-inter text-xs uppercase tracking-widest text-gold mb-0.5">{current.category}</p>
          <h4 className="font-playfair text-lg font-bold text-text dark:text-white truncate">{current.title}</h4>
          <p className="font-inter text-sm text-text-muted truncate">{current.artist}</p>
        </div>
        <a href={musicApi.downloadUrl(current._id)} download
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/10 transition-all flex-shrink-0 self-center"
          title="Download" onClick={e => e.stopPropagation()}>
          <Download className="w-4 h-4" />
        </a>
      </div>
      <div className="progress-bar mb-4 cursor-pointer" onClick={seek}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { setCurrentIndex((currentIndex - 1 + tracks.length) % tracks.length); setPlaying(false); setProgress(0) }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/10 transition-all">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={toggle}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #C9A227, #E8C84A)' }}>
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={() => { setCurrentIndex((currentIndex + 1) % tracks.length); setPlaying(false); setProgress(0) }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/10 transition-all">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMuted(!muted)} className="text-text-muted hover:text-gold transition-colors">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
            onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
            className="w-16 h-1 cursor-pointer" style={{ accentColor: '#C9A227' }} />
        </div>
      </div>
      <audio ref={audioRef} src={resolveAudioSrc(current.src)} preload="metadata" />
      <p className="font-inter text-xs text-text-muted text-center mt-4">Track {currentIndex + 1} of {tracks.length}</p>
    </div>
  )
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// INNER CONTENT â€” uses useSearchParams, must be inside Suspense
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function MediaContent() {
  const searchParams = useSearchParams()
  const [tracks, setTracks]           = useState<MusicTrack[]>([])
  const [videos, setVideos]           = useState<VideoItem[]>([])
  const [loading, setLoading]         = useState(true)
  const [activeTab, setActiveTab]     = useState<'music' | 'videos'>('music')
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(true)

  // Read ?tab=videos from URL
  useEffect(() => {
    if (searchParams.get('tab') === 'videos') setActiveTab('videos')
  }, [searchParams])

  useEffect(() => {
    Promise.all([
      musicApi.getAll().then(r => setTracks(r.data)),
      videoApi.getAll().then(r => setVideos(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-24 pb-20 bg-background dark:bg-dark-bg min-h-screen">
      {/* Header */}
      <div className="relative py-16 px-4 mb-12 overflow-hidden text-center" style={{ background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)' }}>
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, transparent 100%)' }} />
        <div className="container-narrow relative z-10">
          <AnimateIn direction="up">
            <p className="font-inter text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2">Multimedia</p>
            <h1 className="heading-xl text-white mb-3">Music &amp; Videos</h1>
            <p className="font-inter text-white/60 max-w-lg mx-auto">All wedding songs, video memories, and multimedia content in one place.</p>
          </AnimateIn>
        </div>
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <AnimateIn direction="up">
          <Link href="/#music" className="inline-flex items-center gap-2 font-inter text-sm text-text-muted hover:text-gold transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </AnimateIn>

        {/* Tab switcher */}
        <AnimateIn direction="up">
          <div className="flex gap-3 mb-10">
            <button onClick={() => setActiveTab('music')}
              className={cn('flex items-center gap-2 px-6 py-2.5 rounded-full font-inter text-sm font-semibold transition-all',
                activeTab === 'music' ? 'bg-gold text-white shadow-gold' : 'border border-gold/30 text-text dark:text-white hover:border-gold')}>
              <Music className="w-4 h-4" /> Music {tracks.length > 0 && <span className="opacity-60">({tracks.length})</span>}
            </button>
            <button onClick={() => setActiveTab('videos')}
              className={cn('flex items-center gap-2 px-6 py-2.5 rounded-full font-inter text-sm font-semibold transition-all',
                activeTab === 'videos' ? 'bg-gold text-white shadow-gold' : 'border border-gold/30 text-text dark:text-white hover:border-gold')}>
              <VideoIcon className="w-4 h-4" /> Videos {videos.length > 0 && <span className="opacity-60">({videos.length})</span>}
            </button>
          </div>
        </AnimateIn>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid rgba(201,162,39,0.2)', borderTopColor: '#C9A227' }} />
            <p className="font-inter text-sm text-text-muted">Loading media...</p>
          </div>
        ) : (
          <>
            {/* â”€â”€ MUSIC TAB â”€â”€ */}
            {activeTab === 'music' && (
              <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
                <AnimateIn direction="left">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-playfair text-xl font-bold text-text dark:text-white">
                        All Tracks <span className="text-gold text-base">({tracks.length})</span>
                      </h2>
                      <button onClick={() => setShowPlaylist(!showPlaylist)}
                        className={cn('p-2 rounded-lg transition-all', showPlaylist ? 'bg-gold/10 text-gold' : 'text-text-muted hover:text-gold hover:bg-gold/10')}>
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {tracks.map((t, i) => (
                        <AnimateIn key={t._id} delay={i * 30} direction="up">
                          <button onClick={() => setCurrentTrack(i)}
                            className={cn('w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all border',
                              currentTrack === i ? 'bg-gold/8 border-gold/40' : 'border-gray-100 dark:border-dark-border hover:border-gold/20 hover:bg-gray-50 dark:hover:bg-dark-card')}>
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center font-playfair font-bold text-sm flex-shrink-0', currentTrack === i ? 'text-white' : 'text-gold')}
                              style={{ backgroundColor: currentTrack === i ? '#C9A227' : 'rgba(201,162,39,0.1)' }}>
                              {currentTrack === i ? 'â–¶' : i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn('font-inter text-sm font-semibold truncate', currentTrack === i ? 'text-gold' : 'text-text dark:text-white')}>{t.title}</p>
                              <p className="font-inter text-xs text-text-muted truncate">{t.artist} &bull; {t.category}</p>
                            </div>
                            <span className="font-inter text-xs text-text-light flex-shrink-0">{t.duration}</span>
                            <a href={musicApi.downloadUrl(t._id)} download
                              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/10 transition-all flex-shrink-0"
                              title="Download" onClick={e => e.stopPropagation()}>
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </button>
                        </AnimateIn>
                      ))}
                    </div>
                    {tracks.length === 0 && (
                      <div className="text-center py-16">
                        <div className="text-5xl mb-3">ðŸŽµ</div>
                        <p className="font-inter text-text-muted">No music uploaded yet.</p>
                        <p className="font-inter text-xs text-text-light mt-1">Upload from Admin Panel â†’ Music</p>
                      </div>
                    )}
                  </div>
                </AnimateIn>
                {tracks.length > 0 && (
                  <AnimateIn direction="right">
                    <MusicPlayer tracks={tracks} key={tracks.map(t => t._id).join()} />
                  </AnimateIn>
                )}
              </div>
            )}

            {/* â”€â”€ VIDEOS TAB â”€â”€ */}
            {activeTab === 'videos' && (
              <AnimateIn direction="up">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-text dark:text-white mb-6">
                    All Videos <span className="text-gold text-base">({videos.length})</span>
                  </h2>
                  {videos.length === 0 ? (
                    <div className="text-center py-24">
                      <div className="text-5xl mb-3">ðŸŽ¬</div>
                      <p className="font-inter text-text-muted">No videos uploaded yet.</p>
                      <p className="font-inter text-xs text-text-light mt-1">Upload from Admin Panel â†’ Videos</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {videos.map((video, i) => (
                        <AnimateIn key={video._id} delay={i * 50} direction="up">
                          <div className="card overflow-hidden group">
                            <button onClick={() => setPlayingVideo(video)} className="w-full relative block">
                              <div style={{ paddingTop: '56.25%', position: 'relative', backgroundColor: '#F7E7E7' }}>
                                {resolveVideoThumb(video) ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={resolveVideoThumb(video)} alt={video.title}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                    className="group-hover:scale-105" />
                                ) : (
                                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>ðŸŽ¬</div>
                                )}
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }} className="group-hover:bg-black/20" />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                                    <Play className="w-6 h-6 text-gold ml-0.5" />
                                  </div>
                                </div>
                                {video.duration && (
                                  <div style={{ position: 'absolute', bottom: 8, right: 8 }} className="bg-black/70 text-white text-xs px-2 py-0.5 rounded font-inter">
                                    {video.duration}
                                  </div>
                                )}
                              </div>
                            </button>
                            <div className="p-4">
                              <h3 className="font-playfair text-base font-bold text-text dark:text-white mb-0.5">{video.title}</h3>
                              {video.description && <p className="font-inter text-xs text-text-muted mb-3 line-clamp-2">{video.description}</p>}
                              <div className="flex items-center justify-between">
                                <span className="font-inter text-xs text-gold font-semibold capitalize">{video.category}</span>
                                <div className="flex gap-2">
                                  <button onClick={() => setPlayingVideo(video)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all"
                                    style={{ backgroundColor: '#C9A227' }}>
                                    <Play className="w-3 h-3" /> Play
                                  </button>
                                  {video.src && !video.youtubeId && (
                                    <a href={videoApi.downloadUrl(video._id)} download
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-all">
                                      <Download className="w-3 h-3" /> Download
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AnimateIn>
                      ))}
                    </div>
                  )}
                </div>
              </AnimateIn>
            )}
          </>
        )}
      </div>

      {/* Video modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/97 flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
          <button onClick={() => setPlayingVideo(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            {playingVideo.youtubeId ? (
              <iframe src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1`}
                title={playingVideo.title} className="w-full rounded-2xl" style={{ aspectRatio: '16/9' }}
                allow="autoplay; fullscreen" allowFullScreen />
            ) : playingVideo.src ? (
              <video controls autoPlay className="w-full rounded-2xl" style={{ aspectRatio: '16/9' }}>
                <source src={resolveVideoSrc(playingVideo)} />
              </video>
            ) : null}
            <div className="mt-4 text-center">
              <p className="font-playfair text-white text-lg font-bold">{playingVideo.title}</p>
              {playingVideo.description && <p className="font-inter text-white/60 text-sm mt-1">{playingVideo.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PAGE EXPORT â€” wraps MediaContent in Suspense (required by Next.js 14)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export default function MediaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid rgba(201,162,39,0.2)', borderTopColor: '#C9A227' }} />
          <p className="font-inter text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    }>
      <MediaContent />
    </Suspense>
  )
}
