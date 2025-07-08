import { X, FileText, User, Calendar, Eye, Briefcase, MapPin, Users, Building2, Clock } from 'lucide-react'
import { useState } from 'react'
import config from '../config'

const { API_BASE_URL } = config

// Modern ListedJobApplications Component
export default function ListedJobApplications({ job, applications, onClose }) {
  const [resumeUrl, setResumeUrl] = useState(null)

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative border border-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
              <p className="text-gray-600 mt-1">
                Candidates for <span className="font-semibold text-blue-600">"{job.title}"</span>
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-white/50 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Applications List */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-4">
              {applications.map(app => (
                <div 
                  key={app._id} 
                  className="group border border-gray-200 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:border-blue-200 bg-white"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {app.applicantId?.name}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={14} />
                            <span>Applied {new Date(app.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {app.resumePath ? (
                        <button
                          onClick={() => setResumeUrl(`${API_BASE_URL}/${app.resumePath}`)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                        >
                          <Eye size={16} />
                          View Resume
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm">
                          <FileText size={16} />
                          No resume
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {resumeUrl && (
        <>
          <div 
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setResumeUrl(null)}
          />
          
            <div className="fixed z-70 flex items-center justify-center p-2" 
                 style={{ 
                   top: '76.8px', 
                   left: '0', 
                   right: '0', 
                   bottom: '0' 
                 }}>
            <div className="relative bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl overflow-hidden border border-gray-200">
              {/* Header for Resume Viewer */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
                <button
                  onClick={() => setResumeUrl(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* PDF Viewer */}
              <div className="pt-16 h-full">
                <iframe
                  src={resumeUrl}
                  className="w-full h-full border-0"
                  title="Resume Viewer"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

