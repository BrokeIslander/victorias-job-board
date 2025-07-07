import DataTable, { createTheme } from 'react-data-table-component'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Trash2, Edit, Send, Eye, Search, MapPin, Building2, DollarSign, Calendar, Users } from 'lucide-react'
import JobDetailModal from './JobDetailModal'
import config from '../config'
import ApplicationModal from './ApplicationModal'

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
  const [applyingJob, setApplyingJob] = useState(null)
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
  /* --- Column Definition (responsive) -------------------- */
const columns = [
  /* 1 ▸ Job / Company  ---------------------------------- */
  {
    name: 'Job',
    selector: row => row.title,
    sortable: true,
    wrap: true,
    minWidth: '220px',          // shrinks, but never below 220 px
    cell: row => (
      <div className="py-1">
        <p className="font-semibold text-gray-900 text-sm leading-tight">
          {row.title}
        </p>
        <p className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
          <Building2 size={12} />
          <span>{row.company}</span>
        </p>
      </div>
    ),
  },

  /* 2 ▸ Location  (hide on xs) -------------------------- */
  {
    name: 'Location',
    selector: row => row.location,
    sortable: true,
    minWidth: '160px',
    cell: row => (
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <MapPin size={14} className="text-gray-400" />
        <span>{row.location}</span>
      </div>
    ),
    // hide this column on screens <640 px
    reorder: true,   /* keep drag‑reorder support */
    grow: 0,         /* don’t steal space on narrow view */
    conditionalCellStyles: [
      {
        when: () => true,
        style: { '@media(max-width: 639px)': { display: 'none' } },
      },
    ],
  },

  /* 3 ▸ Daily Salary ------------------------------------ */
  {
    name: 'Salary / day',
    selector: row => row.salary,
    sortable: true,
    right: true,
    minWidth: '120px',
    cell: row => (
      <span className="text-sm font-medium text-green-700">
        {formatSalary(row.salary)}
      </span>
    ),
  },

  /* 4 ▸ Posted (hide on xs) ----------------------------- */
  {
    name: 'Posted',
    selector: row => row.datePosted,
    sortable: true,
    right: true,
    minWidth: '110px',
    cell: row => (
      <span className="text-sm text-gray-600">
        {formatDate(row.datePosted)}
      </span>
    ),
    conditionalCellStyles: [
      {
        when: () => true,
        style: { '@media(max-width: 639px)': { display: 'none' } },
      },
    ],
  },

  /* 5 ▸ Actions (flex‑grow so it always fits) ----------- */
  {
    name: '',
    allowOverflow: true,        // don’t clip icons
    button: true,
    grow: 2,                    // take leftover space
    cell: row => (
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-1">
        {/* View */}
        <ActionIcon
          title="View Details"
          icon={Eye}
          onClick={() => setSelectedJob(row)}
        />

        {/* Apply */}
        {user?.role === 'applicant' && (
          <ActionIcon
            title="Apply Now"
            icon={Send}
            iconClass="text-blue-600 hover:text-blue-800"
            bg="blue"
            onClick={() => setApplyingJob(row)}
          />
        )}

        {/* Edit / Delete */}
        {user && canEditDel(row) && (
          <>
            <ActionIcon
              title="Edit Job"
              icon={Edit}
              iconClass="text-green-600 hover:text-green-800"
              bg="green"
              onClick={() => openEdit(row)}
            />
            <ActionIcon
              title="Delete Job"
              icon={Trash2}
              iconClass="text-red-600 hover:text-red-800"
              bg="red"
              onClick={() => handleDelete(row._id)}
            />
          </>
        )}
      </div>
    ),
  },
]

/* --- Little helper for 32‑line DRYness ----------------- */
const ActionIcon = ({ title, icon: Icon, bg, iconClass='', onClick }) => (
  <button
    title={title}
    onClick={onClick}
    className={`
      inline-flex items-center justify-center w-8 h-8 rounded-full
      bg-${bg ? bg + '-100' : 'gray-100'} hover:bg-${bg ? bg + '-200' : 'gray-200'}
      ${iconClass} transition duration-200 transform hover:scale-105
    `}
  >
    <Icon size={16} />
  </button>
)


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
  <JobDetailModal
    job={selectedJob}
    onClose={() => setSelectedJob(null)}
  />
)}

{applyingJob && (
  <ApplicationModal
    job={applyingJob}
    onClose={() => setApplyingJob(null)}
    onSuccess={fetchJobs}
  />
)}

    </div>
  )
}