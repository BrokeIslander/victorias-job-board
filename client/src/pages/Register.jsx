import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'applicant' })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form)
      setMessage(res.data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-2 border rounded" />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full p-2 border rounded">
          <option value="applicant">Applicant</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
      <p className="mt-4 text-green-600">{message}</p>
    </div>
  )
}
