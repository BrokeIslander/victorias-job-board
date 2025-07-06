import DataTable from 'react-data-table-component'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Trash2, Edit, Send, Eye } from 'lucide-react'
import JobDetailModal from './JobDetailModal'

export default function JobTable({ openEdit }) {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  const user = JSON.parse(localStorage.getItem('user')) || null

  const fetchJobs = useCallback(async () => {
    const { data } = await axios.get('http://localhost:5000/api/jobs')
    setJobs(data)
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const filtered = jobs.filter(j =>
    [j.title, j.company, j.location]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const canEditDel = (row) =>
    user?.role === 'admin' ||
    (user?.role === 'employer' && row.postedBy?._id === user.id)

  const handleApply = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`http://localhost:5000/api/apply/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Applied!')
    } catch (e) {
      alert(e.response?.data?.message || 'Error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchJobs()
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed')
    }
  }

  const columns = [
    { name: 'Title', selector: r => r.title, sortable: true, wrap: true },
    { name: 'Company', selector: r => r.company, sortable: true },
    { name: 'Location', selector: r => r.location, sortable: true },
    { name: 'Daily Salary', selector: r => r.salary, sortable: true,},
    {
      name: 'Info / Details',
      cell: row => (
        <div className="flex gap-2">
          {/* Always show info */}
          <button
            title="View Info"
            onClick={() => setSelectedJob(row)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Eye size={18} />
          </button>

          {/* Show apply only if user is applicant */}
          {user?.role === 'applicant' && (
            <button
              title="Apply"
              onClick={() => handleApply(row._id)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Send size={18} />
            </button>
          )}

          {/* Show edit/delete if employer owns it or admin */}
          {user && canEditDel(row) && (
            <>
              <button
                title="Edit"
                onClick={() => openEdit(row)}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Edit size={18} />
              </button>
              <button
                title="Delete"
                onClick={() => handleDelete(row._id)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <input
        className="w-full md:w-1/2 mb-4 border px-3 py-2 rounded"
        placeholder="Search…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No jobs found."
      />

      {/* Modal for job info */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  )
}
