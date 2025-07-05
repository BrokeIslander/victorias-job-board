import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MyApplications() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/apply/my', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setApplications(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">📄 My Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map(job => (
            <li key={job.id} className="p-4 border rounded shadow bg-white">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-sm text-gray-500">
                📍 {job.location} | 💰 {job.salary} PHP
              </p>
              <p className="text-sm text-gray-400">
                🗓️ Applied on {new Date(job.appliedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
