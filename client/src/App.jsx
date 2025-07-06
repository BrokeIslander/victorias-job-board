import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { User, LogOut, Briefcase, FileText, Home as HomeIcon, Menu, X } from 'lucide-react'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Login from './pages/Login'
import Register from './pages/Register'
import MyApplications from './pages/MyApplications'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import './index.css'
import VHireLogo from './assets/VCHire_logo.png'
import config from './config'


function Nav({ user, setUser }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Clear app state
    setUser(null)

    // Navigate home
    navigate('/')

    // Close mobile menu (optional)
    setIsMobileMenuOpen(false)
  }

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 
        ${location.pathname === to 
          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20' 
          : 'text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
        }`}
    >
      {icon}
      <span className="relative">
        {label}
        {location.pathname === to && (
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/60 rounded-full" />
        )}
      </span>
    </Link>
  )

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/40 shadow-lg">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

    {/* ─── Logo / Brand ─── */}
   <Link to="/" className="flex items-center gap-2 hover:scale-105 transition duration-300 ease-out">
  <img src={VHireLogo} alt="VHire Logo" className="h-8 w-8 rounded-full" />
  <span className="text-xl font-bold text-white">VCHire</span>
</Link>


    {/* ── Desktop Links ─── */}
    <nav className="hidden md:flex items-center gap-3 text-sm">
      {user ? (
        <>
          {navLink('/dashboard', 'Dashboard', <HomeIcon className="h-4 w-4" />)}
          {navLink('/jobs',       'Jobs',      <Briefcase className="h-4 w-4" />)}
          {user.role === 'applicant' &&
            navLink('/my-applications', 'Applications', <FileText className="h-4 w-4" />)}
        </>
      ) : null}
    </nav>

   {/* ─── User pill or Login/Register ─── */}
<div className="flex items-center gap-4">
  {user ? (
    <div className="hidden md:flex items-center gap-3 bg-gray-700/70 px-4 py-2 rounded-lg">
      <User className="h-4 w-4 text-gray-200" />
      <span className="text-gray-200 text-sm">{user.name}</span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 bg-red-500/90 hover:bg-red-600 px-3 py-1.5 rounded-md text-xs font-medium text-white"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  ) : isHome ? (
    <div className="hidden md:flex items-center gap-2">
      <Link
        to="/login"
        className="bg-gray-700/70 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="bg-gray-700/70 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
      >
        Register
      </Link>
    </div>
  ) : null}

  {/* Mobile Menu Toggle */}
  <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="md:hidden p-2 bg-gray-700 rounded-lg"
  >
    {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-100" /> : <Menu className="h-6 w-6 text-gray-100" />}
  </button>
</div>

  </div>

  {/* ─── Mobile Drawer ─── */}
  {isMobileMenuOpen && (
    <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700/40">
      <nav className="flex flex-col gap-2 p-4 text-sm">
        {user ? (
          <>
            {navLink('/dashboard', 'Dashboard', <HomeIcon className="h-4 w-4" />)}
            {navLink('/jobs', 'Jobs', <Briefcase className="h-4 w-4" />)}
            {user.role === 'applicant' &&
              navLink('/my-applications', 'Applications', <FileText className="h-4 w-4" />)}
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center gap-2 bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-md text-white"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </>
        ) : isHome ? (
          <>
            {navLink('/login', 'Login', <User className="h-4 w-4" />)}
            {navLink('/register', 'Register', <User className="h-4 w-4" />)}
          </>
        ) : null}
      </nav>
    </div>
  )}
</header>

{/* overlay for mobile drawer */}
{isMobileMenuOpen && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
    onClick={() => setIsMobileMenuOpen(false)}
  />
)}
    </>
  )
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
  // Step 1: On initial mount, load user from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }

  // Step 2: Sync across tabs (but don't trigger on first load)
  const handleStorageChange = (e) => {
    if (e.key === 'user') {
      if (e.newValue) {
        setUser(JSON.parse(e.newValue))
      } else {
        setUser(null)
      }
    }
  }

  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [])

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Nav user={user} setUser={setUser} />
        <main className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
          
          <div className="relative z-10 p-0 max-w-6xl mx-auto min-h-[calc(100vh-6rem)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App