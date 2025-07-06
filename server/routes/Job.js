// server/routes/Job.js
import express from 'express'
import Job from '../models/Job.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    req.user = jwt.verify(token, 'jwtsecret')
    next()
  } catch { return res.status(400).json({ message: 'Bad token' }) }
}

const allowOwnerOrAdmin = async (req, res, next) => {
  const job = await Job.findById(req.params.id)
  if (!job) return res.status(404).json({ message: 'Job not found' })

  const isOwner  = job.postedBy.toString() === req.user.id
  const isAdmin  = req.user.role === 'admin'
  if (isOwner || isAdmin) { req.job = job; return next() }

  return res.status(403).json({ message: 'Forbidden' })
}


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

/* UPDATE (employer owner or admin) */
router.put('/:id', verifyToken, allowOwnerOrAdmin, async (req, res) => {
  Object.assign(req.job, req.body)
  await req.job.save()
  res.json({ message: 'Job updated' })
})

/* DELETE (employer owner or admin) */
router.delete('/:id', verifyToken, allowOwnerOrAdmin, async (req, res) => {
  await req.job.deleteOne()
  res.json({ message: 'Job deleted' })
})

export default router
