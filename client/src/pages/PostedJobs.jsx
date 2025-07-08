import { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'
import ListedJob from '../components/ListedJob'

const { API_BASE_URL } = config

// Modern PostedJobs Component
export default function PostedJobs() {
  const [groupedJobs, setGroupedJobs] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_BASE_URL}/api/apply/employer/applications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        // Group by jobId
        const jobMap = {}
        data.forEach(app => {
          const jobId = app.jobId?._id
          if (!jobMap[jobId]) {
            jobMap[jobId] = {
              job: app.jobId,
              applications: []
            }
          }
          jobMap[jobId].applications.push(app)
        })

        setGroupedJobs(Object.values(jobMap))
        setError(null)
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <X size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Applications</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600">Manage and review applications for your posted positions</p>
        </div>

        {/* Applications Grid */}
        <div className="space-y-6">
          {groupedJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                When candidates apply to your job postings, they'll appear here for you to review.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {groupedJobs.length} job{groupedJobs.length !== 1 && 's'} with applications
                </div>
                <div className="text-sm text-gray-500">
                  {groupedJobs.reduce((total, { applications }) => total + applications.length, 0)} total applications
                </div>
              </div>
              
              {groupedJobs.map(({ job, applications }) => (
                <ListedJob key={job._id} job={job} applications={applications} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}