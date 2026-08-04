const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: {
      type: String,
      enum: ['childhood', 'graduation', 'wedding', 'family', 'other'],
      required: true,
    },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Gallery', gallerySchema)
