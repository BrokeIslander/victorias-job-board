import express from 'express'
import jwt from 'jsonwebtoken'
import Application from '../models/Application.js'

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

// Apply for a job
router.post('/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'applicant') {
      return res.status(403).json({ message: 'Only applicants can apply' })
    }

    const application = new Application({
      jobId: req.params.jobId,
      applicantId: req.user.id
    })

    await application.save()
    res.status(201).json({ message: 'Application submitted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
