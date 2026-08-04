const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    thumbnail: { type: String, default: '' },
    youtubeId: { type: String, default: '' },
    src: { type: String, default: '' },
    duration: { type: String, default: '0:00' },
    category: {
      type: String,
      enum: ['Graduation', 'Wedding', 'Family', 'Childhood', 'Other'],
      default: 'Other',
    },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Video', videoSchema)
