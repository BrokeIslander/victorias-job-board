import express from 'express'
import jwt from 'jsonwebtoken'
import Application from '../models/Application.js'
import upload from '../middleware/upload.js'
const router = express.Router()

// Middleware to extract user from token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, 'jwtsecret')
    req.user = decoded
    next()
  } catch {
    res.status(403).json({ message: "Invalid token" })
  }
}

// POST /api/apply/:jobId  (with résumé upload)
router.post('/:jobId', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'applicant')
      return res.status(403).json({ message: 'Only applicants can apply' })

    const application = new Application({
      jobId: req.params.jobId,
      applicantId: req.user.id,
      resumePath: req.file?.path,   // save file path
    })

    await application.save()
    res.status(201).json({ message: 'Application submitted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all applications for the logged-in applicant
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'applicant') {
      return res.status(403).json({ message: 'Only applicants can view applications' })
    }

    const applications = await Application.find({ applicantId: req.user.id }).populate('jobId')

    const jobs = applications.map(app => ({
      id: app.jobId._id,
      title: app.jobId.title,
      company: app.jobId.company,
      location: app.jobId.location,
      salary: app.jobId.salary,
      appliedAt: app.date
    }))

    res.json(jobs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
