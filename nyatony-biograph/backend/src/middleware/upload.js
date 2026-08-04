const multer = require('multer')
const path = require('path')
const fs = require('fs')

const getStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '../../uploads', folder)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      cb(null, dir)
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, unique + path.extname(file.originalname))
    },
  })

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

exports.uploadImage = multer({ storage: getStorage('images'), fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } })
exports.uploadMusic = multer({ storage: getStorage('music'), fileFilter: audioFilter, limits: { fileSize: 30 * 1024 * 1024 } })
exports.uploadVideo = multer({ storage: getStorage('videos'), fileFilter: videoFilter, limits: { fileSize: 200 * 1024 * 1024 } })
