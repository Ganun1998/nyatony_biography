const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Traditional', 'Christian Wedding', 'Instrumental', 'Romantic', 'Classic'],
      default: 'Romantic',
    },
    artwork: { type: String, default: '' },
    src: { type: String, required: true },
    duration: { type: String, default: '0:00' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Music', musicSchema)
