// Simple MongoDB connectivity test for local debugging (CommonJS)
const mongoose = require('mongoose')

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set. Create .env.local with MONGODB_URI="your-connection-string"')
    process.exit(1)
  }
  try {
    const conn = await mongoose.connect(uri, { bufferCommands: false })
    console.log('✅ Connected to MongoDB:', conn.connection.name)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  }
}

main()


