import { useState } from 'react'
import { X, FileText, User, Calendar, Eye, Briefcase, MapPin, Users, Building2, Clock } from 'lucide-react'
import ListedJobApplications from './ListedJobApplications'

// Modern ListedJob Component
export default function ListedJob({ job, applications }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer bg-white p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200 group"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase size={20} className="text-white" />
              </div>
              {job.title}
            </h3>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">{job.location}</span>
              </div>
              
              {job.company && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={16} />
                  <span className="text-sm">{job.company}</span>
                </div>
              )}
              
              {job.datePosted && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={16} />
                  <span className="text-sm">
                    Posted {new Date(job.datePosted).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <Users size={16} />
              {applications.length} applicant{applications.length !== 1 && 's'}
            </div>
            
            <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
              Click to view →
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ListedJobApplications
          job={job}
          applications={applications}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}