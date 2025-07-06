import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import config from '../config'

const { API_BASE_URL } = config

export default function PostJobModal({ open, onClose, onSuccess, initialData }) {
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        company: initialData.company || '',
        location: initialData.location || '',
        salary: initialData.salary || '',
        description: initialData.description || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/jobs/${initialData._id}`, formData, config)
      } else {
        await axios.post(`${API_BASE_URL}/api/jobs`, formData, config)
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit job')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {isEdit ? 'Edit Job' : 'Post a New Job'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary (PHP)"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job Description"
              rows="4"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
            >
              {loading ? (isEdit ? 'Updating…' : 'Posting…') : isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
