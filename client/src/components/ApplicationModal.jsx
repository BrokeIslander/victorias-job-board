import { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import config from '../config'

const { API_BASE_URL } = config

export default function ApplicationModal({ job, onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!job) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!file) {
      setError('Please upload your résumé (PDF or DOC).')
      return
    }

    const formData = new FormData()
    formData.append('resume', file)

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/api/apply/${job._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-4">
            Apply to &ldquo;{job.title}&rdquo; – {job.company}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Résumé (PDF / DOC / DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
