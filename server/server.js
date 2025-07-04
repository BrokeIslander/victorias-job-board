// server/server.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/Auth.js'
import jobRoutes from './routes/Job.js'
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Debug: check env
console.log('✅ Mongo URI:', process.env.MONGO_URI)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
// Optional test route
app.get('/api/jobs', (req, res) => {
  res.json([
    { id: 1, title: 'Barista', company: 'Cafe Uno' },
    { id: 2, title: 'Delivery Rider', company: 'FoodTrip' }
  ])
})

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
    })
  })
  .catch((err) => console.error('Mongo Error →', err))
