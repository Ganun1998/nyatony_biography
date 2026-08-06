const express = require('express')
const router  = express.Router()
const { protect, adminOnly }          = require('../middleware/auth')
const { uploadImage, uploadMusic, uploadVideo } = require('../middleware/upload')

// Controllers
const authCtrl    = require('../controllers/authController')
const gbCtrl      = require('../controllers/guestbookController')
const contactCtrl = require('../controllers/contactController')
const galleryCtrl = require('../controllers/galleryController')
const musicCtrl   = require('../controllers/musicController')
const videoCtrl   = require('../controllers/videoController')
const statsCtrl   = require('../controllers/statsController')

// ── PUBLIC ROUTES ────────────────────────────────────────────────────────

// Auth
router.post('/auth/login', authCtrl.login)
router.get('/auth/me',     protect, authCtrl.getMe)

// Guestbook
router.get('/guestbook',   gbCtrl.getMessages)
router.post('/guestbook',  gbCtrl.createMessage)

// Contact
router.post('/contact',    contactCtrl.sendMessage)

// Gallery — public read + public download
router.get('/gallery',              galleryCtrl.getImages)
router.get('/gallery/:id/download', galleryCtrl.downloadImage)

// Music — public read + public download (stream)
router.get('/music',                musicCtrl.getAll)
router.get('/music/:id/download',   musicCtrl.download)

// Videos — public read + public download
router.get('/videos',               videoCtrl.getAll)
router.get('/videos/:id/download',  videoCtrl.download)

// ── ADMIN ROUTES ─────────────────────────────────────────────────────────
const admin = express.Router()
admin.use(protect, adminOnly)

// Stats
admin.get('/stats', statsCtrl.getStats)

// Guestbook moderation
admin.get('/guestbook',                 gbCtrl.getAllMessages)
admin.patch('/guestbook/:id/approve',   gbCtrl.approveMessage)
admin.delete('/guestbook/:id',          gbCtrl.deleteMessage)

// Contact
admin.get('/contact',                   contactCtrl.getMessages)
admin.patch('/contact/:id/read',        contactCtrl.markRead)

// Gallery CRUD
admin.get('/gallery',                   galleryCtrl.getImages)
admin.post('/gallery',                  uploadImage.single('image'),  galleryCtrl.uploadImage)
admin.put('/gallery/:id',                                             galleryCtrl.updateImage)
admin.delete('/gallery/:id',            galleryCtrl.deleteImage)

// Music CRUD (field name: 'audio')
admin.get('/music',                     musicCtrl.getAll)
admin.post('/music',                    uploadMusic.single('audio'),  musicCtrl.upload)
admin.put('/music/:id',                 musicCtrl.update)
admin.delete('/music/:id',              musicCtrl.delete)

// Video CRUD (field name: 'video')
admin.get('/videos',                    videoCtrl.getAll)
admin.post('/videos',                   uploadVideo.single('video'),  videoCtrl.upload)
admin.put('/videos/:id',                videoCtrl.update)
admin.delete('/videos/:id',             videoCtrl.delete)

router.use('/admin', admin)

module.exports = router
