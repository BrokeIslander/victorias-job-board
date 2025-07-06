import { useRef } from 'react'
import JobTable from '../components/JobTable'
import workerBanner from '../assets/hero.png' // 👈 Place your banner here

export default function Home() {
  const jobSectionRef = useRef()

  const scrollToJobs = () => {
    jobSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Hero Text */}
      {/* Hero Section with Text on Background Image */}
<div
  className="relative h-[90vh] bg-cover bg-center flex flex-col justify-start items-center text-white text-center px-4"
  style={{ backgroundImage: `url(${workerBanner})` }}
>
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-black/20 z-0"></div>

  {/* Text Content */}
  <div className="relative z-10 pt-0 md:pt-8 max-w-3xl mx-auto">
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
      VCHire - Victorias City Job Board
    </h1>
    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
      Empowering local workers and employers with a faster, simpler job platform.
    </p>
    <button
      onClick={scrollToJobs}
      className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-500 hover:text-white transition"
    >
      View Jobs
    </button>
  </div>
</div>


      {/* Features */}
      <div className="px-6 py-16 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Local Focus',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              ),
              desc: 'Jobs exclusively from Victorias — no irrelevant listings.',
            },
            {
              title: 'Fast & Free',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              ),
              desc: 'Browse and apply in seconds. No accounts, no fees.',
            },
            {
              title: 'Community Built',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              ),
              desc: 'Created by locals to support job seekers and businesses.',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Listings Section */}
      <div ref={jobSectionRef} className="bg-white px-6 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            🔎 Browse Local Job Listings
          </h2>
          <JobTable compact />
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-full shadow hover:bg-gray-700 transition z-50"
        title="Back to Top"
      >
        ↑ Top
      </button>
    </div>
  )
}
