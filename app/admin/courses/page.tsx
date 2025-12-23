"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, X } from "lucide-react"

// Pages list
const PAGES = [
  { id: "chess", label: "Chess Page" },
  { id: "robotics", label: "Robotics Page" },
  { id: "abacus", label: "Abacus Page" },
  { id: "coaching", label: "Coaching Page" },
  { id: "promaty", label: "Promaty School" },
]

export default function CoursesAdmin() {
  const [courses, setCourses] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  // Initial form
  const initialForm = {
    pageKey: "",
    title: "",
    category: "primary",
    age: "",
    description: "",
    themeKey: "beginner",
    popular: false,
    featuresText: "",
  }

  const [form, setForm] = useState(initialForm)

  /* ---------------- FETCH ---------------- */
  const fetchCourses = async () => {
    const res = await fetch("/api/courses")
    setCourses(await res.json())
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.pageKey) return alert("Please select a page")

    const featuresArray = form.featuresText
      .split("\n")
      .map(f => f.trim())
      .filter(Boolean)

    // ❗ Remove featuresText before sending to backend
    const { featuresText, ...rest } = form

    const payload = {
      ...rest,
      features: JSON.stringify(featuresArray),
    }

    const url = editingId ? `/api/courses/${editingId}` : "/api/courses"
    const method = editingId ? "PUT" : "POST"

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    setForm(initialForm)
    setEditingId(null)
    fetchCourses()
  }

  /* ---------------- EDIT ---------------- */
  const handleEdit = (c: any) => {
    setEditingId(c.id)

    const parsedFeatures = Array.isArray(c.features)
      ? c.features
      : JSON.parse(c.features || "[]")

    setForm({
      pageKey: c.pageKey || "",
      title: c.title,
      category: c.category,
      age: c.age,
      description: c.description,
      themeKey: c.themeKey,
      popular: c.popular,
      featuresText: parsedFeatures.join("\n"),
    })

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return
    await fetch(`/api/courses/${id}`, { method: "DELETE" })
    setCourses(courses.filter(c => c.id !== id))
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Courses Manager</h2>
        {editingId && (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">
            Editing Mode
          </span>
        )}
      </div>

      {/* FORM */}
      <div className={`p-6 rounded-2xl border ${editingId ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}>
        <div className="flex justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingId ? "Edit Course" : "Add Course"}
          </h3>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null)
                setForm(initialForm)
              }}
              className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Page */}
          <select
            className="w-full p-3 border rounded-lg"
            value={form.pageKey}
            onChange={e => setForm({ ...form, pageKey: e.target.value })}
            required
          >
            <option value="">Select Page</option>
            {PAGES.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

          <div className="grid md:grid-cols-2 gap-4">
            <input className="p-3 border rounded-lg" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input className="p-3 border rounded-lg" placeholder="Age Group" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <select className="p-3 border rounded-lg" value={form.themeKey} onChange={e => setForm({ ...form, themeKey: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select className="p-3 border rounded-lg" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="primary">General</option>
              <option value="camp">Camp</option>
            </select>

            <label className="flex items-center gap-2 border p-3 rounded-lg">
              <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} />
              Popular
            </label>
          </div>

          <textarea className="p-3 border rounded-lg w-full h-20" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

          <textarea
            className="p-3 border rounded-lg w-full h-32"
            placeholder="One feature per line"
            value={form.featuresText}
            onChange={e => setForm({ ...form, featuresText: e.target.value })}
            required
          />

          <button className={`w-full py-3 text-white font-bold rounded-lg ${editingId ? "bg-amber-600" : "bg-slate-900"}`}>
            {editingId ? "Update Course" : "Create Course"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map(c => {
          const features = Array.isArray(c.features)
            ? c.features
            : JSON.parse(c.features || "[]")

          return (
            <div key={c.id} className="bg-white p-5 rounded-xl border relative">
              <div className="absolute top-0 right-0 text-xs bg-slate-100 px-3 py-1 rounded-bl-lg">
                {c.pageKey}
              </div>

              <h4 className="font-bold text-lg">{c.title}</h4>
              <p className="text-sm text-slate-500">{c.age}</p>

              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(c)} className="p-2 hover:text-amber-500">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Features: {features.length} • Theme: {c.themeKey}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
