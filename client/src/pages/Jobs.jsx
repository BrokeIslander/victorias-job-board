import { useEffect, useState } from 'react'
import axios from 'axios'
import PostJobModal from '../components/PostJobModal'
import { Plus } from 'lucide-react'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  const isEmployer = () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role === 'employer'
    } catch {
      return false
    }
  }

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs')
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📋 Job Listings</h2>

        {isEmployer() && (
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus className="h-4 w-4" /> Post Job
          </button>
        )}
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No job listings available at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>

              <p className="text-gray-700 mb-3 line-clamp-3">{job.description}</p>

              <div className="text-sm text-gray-500 flex flex-wrap gap-4 mb-3">
                <span>📍 {job.location}</span>
                <span>💰 {job.salary} PHP</span>
              </div>

              {user?.role === 'applicant' && (
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.post(
                        `http://localhost:5000/api/apply/${job._id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                          },
                        }
                      )
                      alert(res.data.message)
                    } catch (err) {
                      alert(err.response?.data?.message || 'Error applying')
                    }
                  }}
                  className="mt-2 w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
                >
                  Apply
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Job Modal */}
      <PostJobModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSuccess={() => {
          setShowPostModal(false)
          fetchJobs()
        }}
      />
    </div>
  )
}
