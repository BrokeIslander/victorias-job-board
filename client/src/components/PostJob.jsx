import { useState } from "react"

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) return alert("Please log in as employer first")

    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        alert("Job posted!")
        setFormData({ title: "", company: "", description: "", location: "", salary: "" })
      } else {
        alert(data.message || "Error posting job")
      }
    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "company", "description", "location", "salary"].map((field) => (
          <input
            key={field}
            type={field === "salary" ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        ))}
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  )
}

export default PostJob
