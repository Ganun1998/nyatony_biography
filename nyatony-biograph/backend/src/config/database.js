const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('\n❌  MONGODB_URI is missing from your .env file!\n')
    return
  }

  // Show the URI (mask password) so you can verify it looks right
  const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')
  console.log(`🔌  Connecting to MongoDB Atlas...`)
  console.log(`    URI: ${masked}\n`)

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    })

    isConnected = true
    console.log('✅  MongoDB Atlas connected!')
    console.log(`    Host:     ${conn.connection.host}`)
    console.log(`    Database: ${conn.connection.name}\n`)

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️   MongoDB disconnected — will retry...')
      isConnected = false
      setTimeout(connectDB, 8000)
    })

    mongoose.connection.on('error', (err) => {
      console.error('❌  MongoDB error:', err.message)
    })

  } catch (err) {
    isConnected = false
    console.error('\n❌  MongoDB connection FAILED')
    console.error(`    Reason: ${err.message}\n`)

    // Give specific guidance based on the error
    if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
      console.error('    ⚠️   FIX: Wrong username or password in .env MONGODB_URI')
      console.error('    → Go to cloud.mongodb.com → Database Access')
      console.error('    → Edit user → Reset password → Update .env MONGODB_URI\n')
    } else if (err.message.includes('whitelist') || err.message.includes('IP')) {
      console.error('    ⚠️   FIX: Your IP is not whitelisted in MongoDB Atlas')
      console.error('    → Go to cloud.mongodb.com → Network Access')
      console.error('    → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)\n')
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('topology')) {
      console.error('    ⚠️   FIX: Cannot reach MongoDB Atlas — check internet connection\n')
    }

    console.log('    Retrying in 10 seconds...\n')
    setTimeout(connectDB, 10000)
  }
}

const dbReady = () => isConnected

module.exports = { connectDB, dbReady }
