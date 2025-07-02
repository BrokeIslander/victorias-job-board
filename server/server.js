// server/server.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Test Route
app.get('/api/jobs', (req, res) => {
  res.json([
    { id: 1, title: 'Barista - Victorias Mall', company: 'Cafe Uno' },
    { id: 2, title: 'Delivery Rider', company: 'FoodTrip' } 
  ])
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
    })
  })
  .catch((err) => console.error('Mongo Error →', err))
