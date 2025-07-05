import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
  }, [])

  if (!user) return <p>Loading...</p>

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">👋 Welcome, {user.name}</h2>

      {user.role === 'employer' ? (
        <>
          <p className="text-gray-700">You can post new jobs and view applicants.</p>
          <p className="mt-2">
            🔧 Go to the <strong>Jobs</strong> page to start posting.
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-700">You can apply to jobs and track your applications.</p>
          <p className="mt-2">
            📄 Check <strong>My Applications</strong> to see your progress.
          </p>
        </>
      )}
    </div>
  )
}
