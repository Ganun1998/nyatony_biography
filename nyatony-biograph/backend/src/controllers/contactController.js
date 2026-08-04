const Contact = require('../models/Contact')

// POST /api/contact
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' })
    }

    await Contact.create({ name, email, subject, message, ipAddress: req.ip })
    res.status(201).json({ success: true, message: 'Message sent! We will get back to you soon.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/admin/contact
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: messages })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PATCH /api/admin/contact/:id/read
exports.markRead = async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    res.json({ success: true, data: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
