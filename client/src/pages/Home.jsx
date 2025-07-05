export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        
        {/* Content */}
        <div className="relative px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* City Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-8 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300">Victorias City , Philippines</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent leading-tight">
              VCHire
              <br />
              <span className="text-4xl lg:text-6xl font-light">Victorias City Job Board</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect with opportunities in your city.
              <br />
              <span className="text-gray-500 text-lg">Fast, free, and local.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <div className="flex flex-wrap gap-4 justify-center mt-6">
              <button className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                Browse Jobs
              </button>
              <button className="px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                Post a Job
              </button>
            </div>

            </div>   
          </div>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="px-6 py-16 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Local Focus */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Local First</h3>
              <p className="text-gray-600 leading-relaxed">Focused exclusively on Victorias opportunities. No need to filter through distant jobs.</p>
            </div>
            
            {/* Fast & Free */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Quick job searches and instant applications. Get connected with employers today.</p>
            </div>
            
            {/* Community */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">Built by locals, for locals. Supporting Victoria's growing job market.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}