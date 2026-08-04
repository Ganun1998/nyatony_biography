const Gallery = require('../models/Gallery')
const Guestbook = require('../models/Guestbook')
const Contact = require('../models/Contact')
const Music = require('../models/Music')
const Video = require('../models/Video')

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [galleryCount, guestbookTotal, guestbookPending, contactTotal, contactUnread, musicCount, videoCount] =
      await Promise.all([
        Gallery.countDocuments({ isPublished: true }),
        Guestbook.countDocuments(),
        Guestbook.countDocuments({ isApproved: false }),
        Contact.countDocuments(),
        Contact.countDocuments({ isRead: false }),
        Music.countDocuments({ isPublished: true }),
        Video.countDocuments({ isPublished: true }),
      ])

    res.json({
      success: true,
      data: {
        gallery: { total: galleryCount },
        guestbook: { total: guestbookTotal, pending: guestbookPending },
        contact: { total: contactTotal, unread: contactUnread },
        music: { total: musicCount },
        videos: { total: videoCount },
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
