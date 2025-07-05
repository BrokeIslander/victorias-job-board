import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Filter, Plus } from 'lucide-react'
import PostJobModal from '../components/PostJobModal'
import JobDetailModal from '../components/JobDetailModal'

export default function Jobs() {
  /* ---------------- state ---------------- */
  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState({ search: '', location: '', company: '' })

  /* modal state */
  const [showPostModal, setShowPostModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  const user = JSON.parse(localStorage.getItem('user'))
  const isEmployer = user?.role === 'employer'

  /* ------------ fetch jobs (paginated) ------------ */
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        params: { page, ...filters } // backend: return 10 / page
      })
      const newJobs = res.data
      setJobs(newJobs)
      setHasNext(newJobs.length === 10) // backend page size = 10
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  /* load on page / filters change */
  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  /* reset page when filters apply */
  const applyFilters = () => setPage(1)

  /* --------------- ui --------------- */
  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Filter /> Jobs
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {['search', 'location', 'company'].map((f) => (
            <input
              key={f}
              type="text"
              name={f}
              value={filters[f]}
              placeholder={f[0].toUpperCase() + f.slice(1)}
              onChange={(e) => setFilters({ ...filters, [f]: e.target.value })}
              className="border px-3 py-2 rounded-lg text-sm"
            />
          ))}
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Apply
          </button>
        </div>

        {isEmployer && (
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus className="h-4 w-4" /> Post Job
          </button>
        )}
      </div>

      {/* Job grid */}
      {jobs.length === 0 && !loading ? (
        <p className="text-gray-500 text-center">No jobs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <button
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className="text-left bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
              <p className="text-sm text-gray-500 mt-1">
                📍 {job.location} • 💰 {job.salary} PHP
              </p>
              <p className="mt-2 line-clamp-3 text-gray-700">{job.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-md border disabled:opacity-40"
        >
          Prev
        </button>
        <span className="self-center text-sm text-gray-600">
          Page {page}
        </span>
        <button
          disabled={!hasNext || loading}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-md border disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {loading && <p className="text-center text-sm text-gray-500 mt-4">Loading…</p>}

      {/* Modals */}
      {showPostModal && (
        <PostJobModal
          open={showPostModal}
          onClose={() => setShowPostModal(false)}
          onJobPosted={() => {
            setShowPostModal(false)
            fetchJobs() // refresh current page
          }}
        />
      )}

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  )
}
