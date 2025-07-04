import { useEffect, useState } from 'react'
import axios from 'axios'
import PostJob from '../components/PostJob'

export default function Jobs() {
  const [jobs, setJobs] = useState([])

  const user = JSON.parse(localStorage.getItem('user')) // ✅ added this

  // Check if logged in as employer
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

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4">Job Listings</h2>

      {isEmployer() && (
        <>
          <PostJob />
          <hr className="my-8" />
        </>
      )}

      <ul className="space-y-3">
        {jobs.map(job => (
          <li key={job._id} className="p-4 bg-white rounded shadow border">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm">{job.description}</p>
            <p className="text-sm text-gray-500">
              📍 {job.location} | 💰 {job.salary} PHP
            </p>

            {/* ✅ Show Apply button for applicants only */}
            {user?.role === 'applicant' && (
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(`http://localhost:5000/api/apply/${job._id}`, {}, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    alert(res.data.message)
                  } catch (err) {
                    alert(err.response?.data?.message || 'Error applying')
                  }
                }}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Apply
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
