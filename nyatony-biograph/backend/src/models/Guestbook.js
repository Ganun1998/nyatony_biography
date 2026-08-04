const mongoose = require('mongoose')

const guestbookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    emoji: { type: String, default: '❤️' },
    avatar: { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
    ipAddress: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Guestbook', guestbookSchema)
