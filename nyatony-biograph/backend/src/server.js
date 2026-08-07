require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const morgan  = require('morgan')
const rateLimit = require('express-rate-limit')
const path    = require('path')

const { connectDB, dbReady } = require('./config/database')
const routes = require('./routes/index')

const app = express()

// ── Security ──────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

// ── Rate limiting ─────────────────────────────────────────────────────────
// In development: very high limit so hot-reload never triggers 429
// In production: stricter per-IP limits
const isDev = process.env.NODE_ENV !== 'production'

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,           // 15 minutes
  max: isDev ? 10000 : 300,           // dev: 10k (effectively unlimited), prod: 300
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Never rate-limit requests coming from localhost in development
    const ip = req.ip || ''
    return isDev && (ip === '::1' || ip === '127.0.0.1' || ip.includes('localhost'))
  },
  message: { success: false, message: 'Too many requests, please slow down.' },
}))

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Dev logging ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// ── Static file serving for uploaded media ───────────────────────────────
// __dirname = backend/src — uploads folder is at backend/uploads (one level up)
const uploadsPath = path.join(__dirname, '..', 'uploads')
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin')
    res.set('Cache-Control', 'public, max-age=86400')
  }
}))

// ── DB-ready middleware ───────────────────────────────────────────────────
// Routes that need the DB show a clear error if DB is not yet connected
app.use('/api', (req, res, next) => {
  // Health and auth/login don't strictly need DB guard here
  if (req.path === '/health' || req.path === '/auth/login') return next()
  if (!dbReady()) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. Please check MongoDB Atlas credentials in .env',
    })
  }
  next()
})

// ── API routes ────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── Health check ─────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Nyatony Biography API is running',
    database: dbReady() ? 'connected' : 'disconnected',
    timestamp: new Date(),
  })
})

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// ── Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  })
})

// ── Start Express first (no blocking wait) ────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`🚀  Backend:     http://localhost:${PORT}`)
  console.log(`📡  API:         http://localhost:${PORT}/api`)
  console.log(`🏥  Health:      http://localhost:${PORT}/health`)
  console.log(`🌐  Frontend:    http://localhost:3000`)
  console.log(`🔐  Admin:       http://localhost:3000/admin`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
})

// ── Connect to MongoDB Atlas ──────────────────────────────────────────────
connectDB()
