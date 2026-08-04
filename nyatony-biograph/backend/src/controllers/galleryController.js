const Gallery = require('../models/Gallery')
const fs      = require('fs')
const path    = require('path')

// GET /api/gallery — public
exports.getImages = async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isPublished: true }
    if (category && category !== 'all') filter.category = category
    const images = await Gallery.find(filter).sort({ order: 1, createdAt: -1 })
    res.set('Cache-Control', 'no-store')
    res.json({ success: true, data: images })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/admin/gallery — upload image (field: 'image')
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' })
    const { title, description, category, tags } = req.body

    const image = await Gallery.create({
      title:       title || req.file.originalname,
      description: description || '',
      imageUrl:    `/uploads/images/${req.file.filename}`,
      category:    category || 'other',
      tags:        tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
    res.status(201).json({ success: true, data: image })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/gallery/:id/download — download image file
exports.downloadImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image) return res.status(404).json({ success: false, message: 'Image not found.' })

    const filePath = path.join(__dirname, '../../', image.imageUrl)
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found on disk.' })

    const ext  = path.extname(image.imageUrl).slice(1) || 'jpg'
    const name = image.title.replace(/[^a-z0-9]/gi, '_')
    res.setHeader('Content-Disposition', `attachment; filename="${name}.${ext}"`)
    res.setHeader('Content-Type', `image/${ext}`)
    res.sendFile(path.resolve(filePath))
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/admin/gallery/:id
exports.deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image) return res.status(404).json({ success: false, message: 'Image not found.' })

    // Delete file from disk
    if (image.imageUrl) {
      const filePath = path.join(__dirname, '../../', image.imageUrl)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    await image.deleteOne()
    res.json({ success: true, message: 'Image deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
