const Music = require('../models/Music')
const { useCloudinary } = require('../config/cloudinary')
const fs   = require('fs')
const path = require('path')

// GET /api/music — public
exports.getAll = async (req, res) => {
  try {
    const tracks = await Music.find({ isPublished: true }).sort({ order: 1, createdAt: -1 })
    res.set('Cache-Control', 'no-store')
    res.json({ success: true, data: tracks })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/admin/music — upload (field: 'audio')
exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No audio file uploaded.' })
    const { title, artist, category, duration } = req.body
    if (!title || !artist) return res.status(400).json({ success: false, message: 'Title and artist are required.' })

    const src = useCloudinary
      ? req.file.path                                // full Cloudinary URL
      : `/uploads/music/${req.file.filename}`        // local relative path

    const track = await Music.create({
      title:    title.trim(),
      artist:   artist.trim(),
      category: category || 'Romantic',
      src,
      duration: duration || '0:00',
      artwork:  req.body.artwork || '',
    })
    res.status(201).json({ success: true, data: track })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/music/:id/download
exports.download = async (req, res) => {
  try {
    const track = await Music.findById(req.params.id)
    if (!track) return res.status(404).json({ success: false, message: 'Track not found.' })

    // Cloudinary URL — redirect
    if (useCloudinary || track.src.startsWith('http')) {
      return res.redirect(track.src)
    }

    const filePath = path.join(__dirname, '../../', track.src)
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found on disk.' })

    res.setHeader('Content-Disposition', `attachment; filename="${track.title}.${path.extname(track.src).slice(1)}"`)
    res.setHeader('Content-Type', 'audio/mpeg')
    res.sendFile(path.resolve(filePath))
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/admin/music/:id
exports.update = async (req, res) => {
  try {
    const track = await Music.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!track) return res.status(404).json({ success: false, message: 'Track not found.' })
    res.json({ success: true, data: track })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/admin/music/:id
exports.delete = async (req, res) => {
  try {
    const track = await Music.findById(req.params.id)
    if (!track) return res.status(404).json({ success: false, message: 'Track not found.' })

    if (!useCloudinary && track.src && !track.src.startsWith('http')) {
      const filePath = path.join(__dirname, '../../', track.src)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await track.deleteOne()
    res.json({ success: true, message: 'Track deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
