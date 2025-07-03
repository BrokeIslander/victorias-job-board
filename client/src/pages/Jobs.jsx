import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Jobs() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Job Listings</h2>
      <ul className="space-y-3">
        {jobs.map(job => (
          <li key={job.id} className="p-4 bg-white rounded shadow border">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
