import { X } from 'lucide-react'

export default function JobDetailModal({ job, onClose }) {
  if (!job) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-xl">
          <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}>
            <X />
          </button>
          <h3 className="text-2xl font-bold mb-1">{job.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{job.company}</p>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            📍 {job.location} &nbsp;•&nbsp; 💰 {job.salary} PHP (daily)
          </p>
        </div>
      </div>
    </>
  )
}
