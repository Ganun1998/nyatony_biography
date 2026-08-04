require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')

const seed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Create admin user
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL })
    if (!existing) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@nyatony.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@2026',
        role: 'admin',
      })
      console.log('✅ Admin user created successfully')
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`)
    } else {
      console.log('ℹ️  Admin user already exists — skipping creation')
    }

    await mongoose.disconnect()
    console.log('✅ Done. You can now log in to the admin panel.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seed()
