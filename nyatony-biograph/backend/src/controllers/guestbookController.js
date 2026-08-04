const Guestbook = require('../models/Guestbook')

// GET /api/guestbook — public (approved only)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Guestbook.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(50)
    res.json({ success: true, data: messages })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/guestbook — public
exports.createMessage = async (req, res) => {
  try {
    const { name, message, emoji } = req.body
    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required.' })
    }
    if (message.length > 1000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 1000 chars).' })
    }

    const entry = await Guestbook.create({
      name: name.trim(),
      message: message.trim(),
      emoji: emoji || '❤️',
      ipAddress: req.ip,
    })

    res.status(201).json({
      success: true,
      message: 'Thank you! Your blessing is awaiting approval.',
      data: { id: entry._id },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/admin/guestbook — all messages for admin
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Guestbook.find().sort({ createdAt: -1 })
    res.json({ success: true, data: messages })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PATCH /api/admin/guestbook/:id/approve
exports.approveMessage = async (req, res) => {
  try {
    const msg = await Guestbook.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    )
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' })
    res.json({ success: true, data: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/admin/guestbook/:id
exports.deleteMessage = async (req, res) => {
  try {
    await Guestbook.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Message deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
