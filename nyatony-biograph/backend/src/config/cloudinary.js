/**
 * Cloudinary configuration for permanent cloud storage.
 *
 * To enable Cloudinary:
 * 1. Sign up FREE at https://cloudinary.com
 * 2. Copy your Cloud Name, API Key, API Secret from the dashboard
 * 3. Add to your .env file:
 *    CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    CLOUDINARY_API_KEY=your_api_key
 *    CLOUDINARY_API_SECRET=your_api_secret
 *    USE_CLOUDINARY=true
 */

const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const path   = require('path')
const fs     = require('fs')

const useCloudinary = process.env.USE_CLOUDINARY === 'true' &&
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  console.log('☁️  Cloudinary storage enabled')
} else {
  console.log('💾  Local disk storage enabled (uploads folder)')
}

// ── Local disk storage (fallback when Cloudinary not configured) ──────────
const getLocalStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '../../uploads', folder)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      cb(null, dir)
    },
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      cb(null, unique + path.extname(file.originalname))
    },
  })

// ── Cloudinary storage ────────────────────────────────────────────────────
const getCloudinaryStorage = (folder, resourceType) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder:        `nyatony-biography/${folder}`,
      resource_type: resourceType,
      // Keep original filename (sanitised)
      public_id: (req, file) =>
        `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`,
    },
  })

// ── Filters ───────────────────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('Only image files are allowed'), false)
}

const audioFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) cb(null, true)
  else cb(new Error('Only audio files are allowed'), false)
}

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) cb(null, true)
  else cb(new Error('Only video files are allowed'), false)
}

// ── Multer instances ──────────────────────────────────────────────────────
const uploadImage = multer({
  storage: useCloudinary ? getCloudinaryStorage('images', 'image') : getLocalStorage('images'),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

const uploadMusic = multer({
  storage: useCloudinary ? getCloudinaryStorage('music', 'video') : getLocalStorage('music'),
  // Note: Cloudinary uses resource_type 'video' for audio files too
  fileFilter: audioFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
})

const uploadVideo = multer({
  storage: useCloudinary ? getCloudinaryStorage('videos', 'video') : getLocalStorage('videos'),
  fileFilter: videoFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
})

// ── Helper: get public URL from an uploaded file ──────────────────────────
// Works for both local and Cloudinary uploads
function getFileUrl(req, file, folder) {
  if (useCloudinary && file.path) {
    // Cloudinary returns the full URL in file.path
    return file.path
  }
  // Local: return relative path served by Express static
  return `/uploads/${folder}/${file.filename}`
}

module.exports = { uploadImage, uploadMusic, uploadVideo, getFileUrl, useCloudinary }
