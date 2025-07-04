import { useEffect, useState } from "react"

const JobList = () => {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error loading jobs:", err))
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title} at {job.company}</h3>
            <p>{job.description}</p>
            <p className="text-sm text-gray-600">📍 {job.location} | 💰 {job.salary} PHP</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobList
