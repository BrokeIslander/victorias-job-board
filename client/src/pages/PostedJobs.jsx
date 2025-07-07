import { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'
import { FileText, X, User, Calendar, Briefcase, Building2, MapPin, DollarSign, Eye } from 'lucide-react'

const { API_BASE_URL } = config

export default function PostedJobs() {
  const [applications, setApplications] = useState([])
  const [selectedResume, setSelectedResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Handle modal open/close and body scroll
  useEffect(() => {
    if (selectedResume) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedResume])
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_BASE_URL}/api/apply/employer/applications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        setApplications(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError(err.response?.data?.message || 'Failed to fetch applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
              <div className="mt-4 text-slate-600 font-medium">Loading applications...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
              <div className="text-red-600 font-semibold mb-2">Error</div>
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Job Applications</h1>
          <p className="text-slate-600 text-lg">Review applications for your posted positions</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Applications Yet</h3>
              <p className="text-slate-600">Applications will appear here when candidates apply to your jobs.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map(app => (
              <div key={app._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        {app.jobId?.title || 'Unknown Job'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        {app.jobId?.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {app.jobId.company}
                          </span>
                        )}
                        {app.jobId?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.jobId.location}
                          </span>
                        )}
                        {app.jobId?.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {app.jobId.salary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="font-medium text-slate-900">
                            {app.applicantId?.name || 'Unknown Applicant'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(app.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {app.resumePath ? (
                          <button
                            onClick={() => setSelectedResume(`${API_BASE_URL}/${app.resumePath}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            View Resume
                          </button>
                        ) : (
                          <div className="text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                            No resume uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PDF Modal - Positioned below navbar */}
        {selectedResume && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" 
              onClick={() => setSelectedResume(null)}
            />
            
            {/* Modal - Positioned below navbar */}
            <div className="fixed z-50 flex items-center justify-center p-4" 
                 style={{ 
                   top: '76.8px', 
                   left: '0', 
                   right: '0', 
                   bottom: '0' 
                 }}>
              <div className="relative bg-white rounded-2xl w-full max-w-6xl h-full shadow-2xl overflow-hidden">
                {/* Modal Header with close button */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white">Resume Preview</h3>
                  <button
                    onClick={() => setSelectedResume(null)}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                {/* PDF Container */}
                <div className="bg-slate-50" style={{ height: 'calc(100% - 60px)' }}>
                  <iframe
                    src={selectedResume}
                    className="w-full h-full border-0"
                    title="Resume PDF Viewer"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}