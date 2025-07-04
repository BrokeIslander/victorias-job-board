// server/routes/Job.js
import express from 'express'
import Job from '../models/Job.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Middleware to check if user is an employer
const verifyEmployer = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })

  try {
    const decoded = jwt.verify(token, 'jwtsecret')
    if (decoded.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied. Only employers can post jobs.' })
    }
    req.user = decoded
    next()
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' })
  }
}

// POST /api/jobs — Post a new job
router.post('/', verifyEmployer, async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.id })
    await job.save()
    res.status(201).json({ message: 'Job posted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/jobs — Public list of all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email')
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
