import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import PostJobModal from '../components/PostJobModal'
import JobTable from '../components/JobTable'

export default function Jobs() {
  const [showPostModal, setShowPostModal] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshTable = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

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

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-4">
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

      {/* SINGLE JobTable */}
      <JobTable key={refreshKey} openEdit={setEditJob} />

      {/* Post Modal */}
      {showPostModal && (
        <PostJobModal
          open={true}
          onClose={() => setShowPostModal(false)}
          onSuccess={() => {
            setShowPostModal(false)
            refreshTable()
          }}
        />
      )}

      {/* Edit Modal */}
      {editJob && (
        <PostJobModal
          open={true}
          initialData={editJob}
          onClose={() => setEditJob(null)}
          onSuccess={() => {
            setEditJob(null)
            refreshTable()
          }}
        />
      )}
    </div>
  )
}
