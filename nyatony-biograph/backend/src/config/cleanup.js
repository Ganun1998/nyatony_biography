/**
 * Cleanup stale database records that point to files no longer on disk.
 * Runs once at server startup after MongoDB connects.
 */
const fs   = require('fs')
const path = require('path')
const Gallery = require('../models/Gallery')
const Music   = require('../models/Music')
const Video   = require('../models/Video')

const uploadsDir = path.join(__dirname, '../../uploads')

async function cleanStaleRecords() {
  try {
    let removed = 0

    // Gallery images
    const images = await Gallery.find({})
    for (const img of images) {
      const file = path.join(uploadsDir, img.imageUrl.replace('/uploads', ''))
      if (!fs.existsSync(file)) {
        await Gallery.findByIdAndDelete(img._id)
        removed++
        console.log(`  🗑  Removed stale gallery record: ${img.imageUrl}`)
      }
    }

    // Music tracks
    const tracks = await Music.find({})
    for (const track of tracks) {
      if (track.src && track.src.startsWith('/uploads')) {
        const file = path.join(uploadsDir, track.src.replace('/uploads', ''))
        if (!fs.existsSync(file)) {
          await Music.findByIdAndDelete(track._id)
          removed++
          console.log(`  🗑  Removed stale music record: ${track.src}`)
        }
      }
    }

    // Videos (only check uploaded files, not YouTube)
    const videos = await Video.find({ youtubeId: { $in: [null, ''] } })
    for (const video of videos) {
      if (video.src && video.src.startsWith('/uploads')) {
        const file = path.join(uploadsDir, video.src.replace('/uploads', ''))
        if (!fs.existsSync(file)) {
          await Video.findByIdAndDelete(video._id)
          removed++
          console.log(`  🗑  Removed stale video record: ${video.src}`)
        }
      }
    }

    if (removed > 0) {
      console.log(`\n🧹 Cleanup complete: removed ${removed} stale record(s)`)
    } else {
      console.log('✅ No stale records found')
    }
  } catch (err) {
    console.error('Cleanup error:', err.message)
  }
}

module.exports = cleanStaleRecords
