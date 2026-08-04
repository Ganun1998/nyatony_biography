const Music = require('../models/Music')
const fs    = require('fs')
const path  = require('path')

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

// POST /api/admin/music — upload track
// Field name: 'audio' (matches uploadMusic.single('audio') in routes)
exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No audio file uploaded. Make sure the field name is "audio".' })
    const { title, artist, category, duration } = req.body
    if (!title || !artist) return res.status(400).json({ success: false, message: 'Title and artist are required.' })

    const track = await Music.create({
      title:    title.trim(),
      artist:   artist.trim(),
      category: category || 'Romantic',
      src:      `/uploads/music/${req.file.filename}`,
      duration: duration || '0:00',
      artwork:  req.body.artwork || '',
    })
    res.status(201).json({ success: true, data: track })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/music/:id/download — stream file to browser
exports.download = async (req, res) => {
  try {
    const track = await Music.findById(req.params.id)
    if (!track) return res.status(404).json({ success: false, message: 'Track not found.' })

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
    if (track.src) {
      const filePath = path.join(__dirname, '../../', track.src)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    await track.deleteOne()
    res.json({ success: true, message: 'Track deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
