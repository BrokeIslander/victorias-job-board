import DataTable, { createTheme } from 'react-data-table-component'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Trash2, Edit, Send, Eye, Search, MapPin, Building2, DollarSign, Calendar, Users } from 'lucide-react'
import JobDetailModal from './JobDetailModal'
import config from '../config'

const { API_BASE_URL } = config
/* ─── Enhanced Custom RDT theme ─── */


createTheme('modernTailwind', {
  text: {
    primary: '#1f2937', // gray‑800
    secondary: '#6b7280', // gray‑500
  },
  background: {
    default: 'transparent',
  },
  context: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#ffffff',
  },
  divider: {
    default: '#f3f4f6',
  },
  sortFocus: {
    default: '#3b82f6', // blue‑500
  },
  striped: {
    default: '#fafbfc',
    text: '#1f2937',
  },
})

export default function JobTable({ openEdit, compact = false }) {
  /* ─── State ───────────────────── */
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  /* ─── Fetch Jobs ──────────────── */
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/jobs`)
      setJobs(data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  /* ─── Filtering ───────────────── */
  const filtered = jobs.filter(j =>
    [j.title, j.company, j.location]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  /* ─── Permissions ─────────────── */
  const canEditDel = row =>
    user?.role === 'admin' ||
    (user?.role === 'employer' && row.postedBy?._id === user.id)

  /* ─── Handlers ────────────────── */
  const handleApply = async id => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/api/apply/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Applied successfully! 🎉')
    } catch (e) { alert(e.response?.data?.message || 'Error applying to job') }
  }

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchJobs()
    } catch (e) { alert(e.response?.data?.message || 'Delete failed') }
  }

  /* ─── Format Currency ─────────── */
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified'
    return `₱${salary.toLocaleString()}`
  }

  /* ─── Format Date ─────────────── */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  /* ─── Enhanced Column Def ──────────────── */
  const columns = [
    {
      name: 'Job Title',
      selector: r => r.title,
      sortable: true,
      wrap: true,
      width: '280px',
      cell: row => (
        <div className="py-2">
          <div className="font-semibold text-gray-900 text-sm leading-tight">
            {row.title}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Building2 size={12} />
            <span>{row.company}</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Location',
      selector: r => r.location,
      sortable: true,
      width: '160px',
      cell: row => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin size={14} className="text-gray-400" />
          <span>{row.location}</span>
        </div>
      ),
    },
    {
      name: 'Daily Salary',
      selector: r => r.salary,
      sortable: true,
      width: '140px',
      cell: row => (
        <div className="flex items-center gap-1">
          <DollarSign size={14} className="text-green-500" />
          <span className="font-medium text-green-700 text-sm">
            {formatSalary(row.salary)}
          </span>
        </div>
      ),
    },
    {
      name: 'Posted',
      selector: r => r.createdAt,
      sortable: true,
      width: '120px',
      cell: row => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(row.datePosted)}</span>
        </div>
      ),
    },
    {
      name: 'Actions',
     
      width: '140px',
      cell: row => (
        <div className="flex items-center gap-1">
          {/* View Details */}
          <button
            title="View Details"
            onClick={() => setSelectedJob(row)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
          >
            <Eye size={16} />
          </button>

          {/* Apply for applicants */}
          {user?.role === 'applicant' && (
            <button
              title="Apply Now"
              onClick={() => handleApply(row._id)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-105"
            >
              <Send size={16} />
            </button>
          )}

          {/* Edit / Delete for owner or admin */}
          {user && canEditDel(row) && (
            <>
              <button
                title="Edit Job"
                onClick={() => openEdit(row)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-800 transition-all duration-200 hover:scale-105"
              >
                <Edit size={16} />
              </button>
              <button
                title="Delete Job"
                onClick={() => handleDelete(row._id)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 transition-all duration-200 hover:scale-105"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]


  /* ─── Render ──────────────────── */
   return (
    <div className="w-full">
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search jobs by title, company, or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Stats */}
      {filtered.length > 0 && (
        <p className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span>
          {filtered.length !== jobs.length && <> of {jobs.length}</>} jobs
        </p>
      )}

      {/* Data table – NOTICE: no customStyles prop now */}
      <DataTable
        columns={columns}
        data={filtered}
        theme="modernTailwind"
        dense={compact}
        pagination={!compact}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        striped
        highlightOnHover
        responsive
        progressPending={loading}
        progressComponent={<div className="rdt-loader"><span className="loader" /></div>}
        noDataComponent={
          <div className="rdt-no-data flex flex-col">
            <Users size={36} className="mx-auto mb-2 text-gray-400" />
            {search
              ? <>No jobs match “{search}”. <button onClick={() => setSearch('')} className="underline">Clear search</button></>
              : 'No job postings right now — check back later!'}
          </div>
        }
      />

      {/* Detail modal */}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}