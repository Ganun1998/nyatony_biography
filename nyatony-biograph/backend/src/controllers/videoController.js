const Video = require('../models/Video')
const { useCloudinary } = require('../config/cloudinary')
const fs   = require('fs')
const path = require('path')

// GET /api/videos — public
exports.getAll = async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isPublished: true }
    if (category) filter.category = category
    const videos = await Video.find(filter).sort({ order: 1, createdAt: -1 })
    res.set('Cache-Control', 'no-store')
    res.json({ success: true, data: videos })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/admin/videos — upload file OR add YouTube (field: 'video')
exports.upload = async (req, res) => {
  try {
    const { title, description, category, youtubeId, duration } = req.body
    if (!title) return res.status(400).json({ success: false, message: 'Title is required.' })
    if (!req.file && !youtubeId) return res.status(400).json({ success: false, message: 'Upload a video or provide a YouTube ID.' })

    const src = req.file
      ? (useCloudinary ? req.file.path : `/uploads/videos/${req.file.filename}`)
      : ''

    const thumbnail = req.body.thumbnail ||
      (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : '')

    const video = await Video.create({
      title:       title.trim(),
      description: description?.trim() || '',
      category:    category || 'Other',
      youtubeId:   youtubeId || '',
      duration:    duration || '0:00',
      src,
      thumbnail,
    })
    res.status(201).json({ success: true, data: video })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/videos/:id/download
exports.download = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return res.status(404).json({ success: false, message: 'Video not found.' })
    if (!video.src || video.youtubeId) return res.status(400).json({ success: false, message: 'YouTube videos cannot be downloaded here.' })

    // Cloudinary URL — redirect
    if (useCloudinary || video.src.startsWith('http')) {
      return res.redirect(video.src)
    }

    const filePath = path.join(__dirname, '../../', video.src)
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found on disk.' })

    const ext  = path.extname(video.src).slice(1) || 'mp4'
    const name = video.title.replace(/[^a-z0-9]/gi, '_')
    res.setHeader('Content-Disposition', `attachment; filename="${name}.${ext}"`)
    res.setHeader('Content-Type', `video/${ext}`)
    res.sendFile(path.resolve(filePath))
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/admin/videos/:id
exports.update = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!video) return res.status(404).json({ success: false, message: 'Video not found.' })
    res.json({ success: true, data: video })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/admin/videos/:id
exports.delete = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return res.status(404).json({ success: false, message: 'Video not found.' })

    if (!useCloudinary && video.src && !video.src.startsWith('http') && !video.youtubeId) {
      const filePath = path.join(__dirname, '../../', video.src)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await video.deleteOne()
    res.json({ success: true, message: 'Video deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
