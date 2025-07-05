import { useEffect, useState } from 'react'
import { Briefcase, FileText, User } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
  }, [])

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name} 👋</h2>
            <p className="text-gray-500 text-sm">{user.role === 'employer' ? 'Employer Dashboard' : 'Applicant Dashboard'}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {user.role === 'employer' ? (
            <>
              <div className="flex items-start gap-3">
                <Briefcase className="text-green-500 w-5 h-5 mt-1" />
                <div>
                  <p className="text-gray-700">
                    You can post new job openings and manage applicants with ease.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ➜ Head over to the <strong>Jobs</strong> page to start hiring.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <FileText className="text-blue-500 w-5 h-5 mt-1" />
                <div>
                  <p className="text-gray-700">
                    Start applying to jobs and keep track of your application status.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ➜ Go to <strong>My Applications</strong> to follow your progress.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
