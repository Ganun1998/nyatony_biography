'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, List, X, ArrowRight } from 'lucide-react'
import { musicApi, videoApi, type MusicTrack, type VideoItem } from '@/lib/api'
import { MUSIC_PLAYLIST, FEATURED_VIDEOS } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function MusicPlayerSection() {
  const [tracks, setTracks]         = useState<MusicTrack[]>([])
  const [videos, setVideos]         = useState<VideoItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying]       = useState(false)
  const [progress, setProgress]     = useState(0)
  const [volume, setVolume]         = useState(0.8)
  const [muted, setMuted]           = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Fetch music and videos from backend; fall back to static data if none
  useEffect(() => {
    musicApi.getAll()
      .then(r => { if (r.data.length > 0) setTracks(r.data) })
      .catch(() => {})

    videoApi.getAll()
      .then(r => { if (r.data.length > 0) setVideos(r.data) })
      .catch(() => {})
  }, [])

  // Use backend tracks if available, otherwise fall back to siteData
  const playlist = tracks.length > 0 ? tracks : MUSIC_PLAYLIST.map((t, i) => ({
    _id: String(i),
    title: t.title,
    artist: t.artist,
    category: t.category,
    src: t.src,
    duration: t.duration,
    artwork: t.artwork || '',
    isPublished: true,
    order: i,
  }))

  const displayVideos = videos.length > 0 ? videos : FEATURED_VIDEOS.map((v, i) => ({
    _id: String(i),
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail || '',
    youtubeId: v.youtubeId || '',
    src: v.src || '',
    duration: v.duration,
    category: v.category,
    isPublished: true,
  }))

  const current = playlist[currentIndex] || playlist[0]

  // Resolve audio src — backend file or static path
  const audioSrc = current
    ? current.src.startsWith('/uploads')
      ? `${API_BASE}${current.src}`
      : current.src
    : ''
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateProgress = () => { if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100) }
    const onEnded = () => { setCurrentIndex(i => (i + 1) % playlist.length); setPlaying(false); setProgress(0) }
    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', onEnded)
    return () => { audio.removeEventListener('timeupdate', updateProgress); audio.removeEventListener('ended', onEnded) }
  })

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  // When track changes, reload audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    if (playing) audio.play().catch(() => setPlaying(false))
  }, [currentIndex]) // eslint-disable-line

  const handlePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause() } else { audio.play().catch(() => {}) }
    setPlaying(!playing)
  }

  const handleSelect = (i: number) => {
    setCurrentIndex(i)
    setPlaying(false)
    setProgress(0)
    setShowPlaylist(false)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  const getVideoThumb = (v: VideoItem) => {
    if (v.youtubeId) return `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`
    if (v.thumbnail?.startsWith('/uploads')) return `${API_BASE}${v.thumbnail}`
    return v.thumbnail || ''
  }

  const getVideoUrl = (v: VideoItem) => {
    if (v.youtubeId) return `https://youtube.com/watch?v=${v.youtubeId}`
    if (v.src?.startsWith('/uploads')) return `${API_BASE}${v.src}`
    return v.src || ''
  }

  if (!current) return null

  return (
    <section className="section bg-background-secondary dark:bg-dark-surface" id="music">
      <div className="container-wide">
        <SectionHeading
          subtitle="Multimedia"
          title="Music & Videos"
          description="Wedding songs and precious video memories."
        />
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── MUSIC PLAYER ── */}
          <AnimateIn direction="left">
            <div className="music-player">
              <div className="flex items-center gap-2 mb-6">
                <Music className="w-5 h-16 text-gold" />
                <h3 className="font-inter font-semibold text-text dark:text-white">
                  Wedding Songs
                  {tracks.length > 0 && <span className="text-gold text-xs ml-2">({tracks.length} tracks)</span>}
                </h3>
              </div>

              {/* Album art + info */}
              <div className="flex gap-5 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-4xl shadow-gold" style={{ backgroundColor: '#F7E7E7' }}>
                  {current.artwork ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={current.artwork.startsWith('/uploads') ? `${API_BASE}${current.artwork}` : current.artwork}
                      alt={current.title} className="w-full h-full object-cover rounded-2xl" />
                  ) : '🎵'}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="font-inter text-xs uppercase tracking-widest text-gold mb-1">{current.category}</p>
                  <h4 className="font-playfair text-xl font-bold text-text dark:text-white truncate">{current.title}</h4>
                  <p className="font-inter text-sm text-text-muted">{current.artist}</p>
                  <p className="font-inter text-xs text-text-light mt-1">{current.duration}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-bar mb-5 cursor-pointer" onClick={handleProgressClick}
                role="slider" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Song progress">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleSelect((currentIndex - 1 + playlist.length) % playlist.length)}
                    aria-label="Previous" className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/10 transition-all">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button onClick={handlePlay} aria-label={playing ? 'Pause' : 'Play'}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #C9A227, #E8C84A)' }}>
                    {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>
                  <button onClick={() => handleSelect((currentIndex + 1) % playlist.length)}
                    aria-label="Next" className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/10 transition-all">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setMuted(!muted)} className="text-text-muted hover:text-gold transition-colors">
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
                    onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
                    className="w-20 h-1 cursor-pointer" style={{ accentColor: '#C9A227' }} aria-label="Volume" />
                  <button onClick={() => setShowPlaylist(!showPlaylist)}
                    className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all',
                      showPlaylist ? 'bg-gold text-white' : 'text-text-muted hover:text-gold hover:bg-gold/10')}>
                    {showPlaylist ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Playlist */}
              {showPlaylist && (
                <div className="mt-5 border-t border-gray-100 dark:border-dark-border pt-4 space-y-1 max-h-64 overflow-y-auto">
                  {playlist.map((song, i) => (
                    <button key={song._id} onClick={() => handleSelect(i)}
                      className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                        i === currentIndex ? 'bg-gold/10 border border-gold/30' : 'hover:bg-gray-50 dark:hover:bg-dark-bg')}>
                      <span className={cn('font-inter text-xs w-5 text-center flex-shrink-0',
                        i === currentIndex ? 'text-gold font-bold' : 'text-text-muted')}>
                        {i === currentIndex && playing ? '▶' : i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-inter text-sm font-medium truncate',
                          i === currentIndex ? 'text-gold' : 'text-text dark:text-white')}>{song.title}</p>
                        <p className="font-inter text-xs text-text-muted truncate">{song.artist}</p>
                      </div>
                      <span className="font-inter text-xs text-text-light flex-shrink-0">{song.duration}</span>
                    </button>
                  ))}
                </div>
              )}

              <audio ref={audioRef} src={audioSrc} preload="metadata" />

              {/* View all music link */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-dark-border text-center">
                <Link href="/media"
                  className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-gold hover:text-gold-dark transition-colors border-b border-gold/30 hover:border-gold pb-0.5">
                  View all {playlist.length} tracks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </AnimateIn>

          {/* ── VIDEO GRID ── */}
          <AnimateIn direction="right">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gold">🎬</span>
                  <h3 className="font-inter font-semibold text-text dark:text-white">
                    Featured Videos
                    {videos.length > 0 && <span className="text-gold text-xs ml-2">({videos.length} videos)</span>}
                  </h3>
                </div>
                {videos.length > 4 && (
                  <Link href="/media?tab=videos" className="font-inter text-xs text-gold hover:underline font-semibold flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {displayVideos.slice(0, 4).map((video) => (
                  <button
                    key={video._id}
                    onClick={() => setActiveVideo(video)}
                    className="relative w-full rounded-xl overflow-hidden group cursor-pointer border border-gray-100 dark:border-dark-border block"
                    aria-label={`Play ${video.title}`}
                    style={{ display: 'block' }}
                  >
                    {/* Aspect-ratio wrapper — 16:9 */}
                    <div style={{ paddingTop: '56.25%', position: 'relative' }}>

                      {/* Thumbnail */}
                      {getVideoThumb(video) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getVideoThumb(video)}
                          alt={video.title}
                          style={{
                            position: 'absolute', top: 0, left: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                          className="group-hover:scale-105"
                        />
                      ) : (
                        <div
                          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', backgroundColor: '#F7E7E7' }}
                        >
                          🎬
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }} className="group-hover:bg-black/20" />

                      {/* Play button — always visible */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
                          <Play className="w-5 h-5 text-gold ml-0.5" />
                        </div>
                      </div>

                      {/* Duration */}
                      <div style={{ position: 'absolute', bottom: 8, right: 8 }} className="bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-inter">
                        {video.duration || '0:00'}
                      </div>

                      {/* Title */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100">
                        <p className="font-inter text-xs text-white font-medium truncate">{video.title}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {displayVideos.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-text-muted font-inter text-sm">
                    No videos yet. Upload from Admin Panel → Videos.
                  </div>
                )}
              </div>

              {/* View all videos link */}
              <div className="mt-5 text-center">
                <Link href="/media?tab=videos"
                  className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-gold hover:text-gold-dark transition-colors border-b border-gold/30 hover:border-gold pb-0.5">
                  View all videos <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/97 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}>
          <button onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            {activeVideo.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full rounded-2xl"
                style={{ aspectRatio: '16/9' }}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : activeVideo.src ? (
              <video controls autoPlay className="w-full rounded-2xl" style={{ aspectRatio: '16/9' }}>
                <source src={getVideoUrl(activeVideo)} />
              </video>
            ) : null}
            <div className="mt-4 text-center">
              <p className="font-playfair text-white text-lg font-bold">{activeVideo.title}</p>
              {activeVideo.description && <p className="font-inter text-white/60 text-sm mt-1">{activeVideo.description}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
