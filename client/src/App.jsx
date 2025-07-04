import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import PostJob from './components/PostJob'
import JobList from './components/JobList'
import Login from './pages/Login'
import Register from './pages/Register'
const user = JSON.parse(localStorage.getItem("user"))
function App() {
  return (
    <Router>
  

<nav className="p-4 bg-blue-600 text-white flex gap-4">
  <Link to="/" className="hover:underline">Home</Link>
  <Link to="/jobs" className="hover:underline">Jobs</Link>
  {user ? (
    <>
      <span>{user.name}</span>
      <button onClick={() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.reload()
      }}>Logout</button>
    </>
  ) : (
    <Link to="/login" className="hover:underline">Login</Link>
  )}
  <Link to="/register" className="hover:underline">Register</Link>
</nav>


      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
