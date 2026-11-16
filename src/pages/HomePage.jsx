import { useState, useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import CourseList from '../components/CourseList'
import ProgressSummary from '../components/ProgressSummary'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Feature: Availability logic
const isAvailable = (course, completed) =>
  course.prerequisites.every((prereqId) => completed.includes(prereqId))

const HomePage = () => {
  // Feature: Fetch courses and saved completions from the Express API with useFetch
  const { data: courses, isPending, error } = useFetch(`${API_BASE_URL}/api/courses`)
  const {
    data: savedCompletions,
    isPending: completionsPending,
    error: completionsError,
  } = useFetch(`${API_BASE_URL}/api/completions`)
  const [completed, setCompleted] = useState([])
  const [filter, setFilter] = useState('all')
  const [saveMessage, setSaveMessage] = useState(null) // { type: 'success' | 'danger', text }
  const [isSaving, setIsSaving] = useState(false)

  // When the fetch finishes, copy the server's list into editable state
  useEffect(() => {
    if (Array.isArray(savedCompletions)) setCompleted(savedCompletions)
  }, [savedCompletions])

  // Feature: Completed / Available / Locked status
  const getStatus = (course) => {
    if (completed.includes(course.id)) return 'Completed'
    return isAvailable(course, completed) ? 'Available' : 'Locked'
  }

  // Feature: Prerequisites shown as course numbers
  const getPrereqNumbers = (course) =>
    course.prerequisites.map((id) => courses.find((c) => c.id === id)?.number ?? `#${id}`)

  const getDependents = (courseId, acc = new Set()) => {
    courses
      .filter((c) => c.prerequisites.includes(courseId) && !acc.has(c.id))
      .forEach((c) => {
        acc.add(c.id)
        getDependents(c.id, acc)
      })
    return acc
  }

  const handleToggle = (courseId) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return

    if (completed.includes(courseId)) {
      // Feature: Cascade uncomplete
      const toRemove = getDependents(courseId)
      toRemove.add(courseId)
      setCompleted(completed.filter((id) => !toRemove.has(id)))
    } else {
      // Feature: Prerequisite enforcement
      if (!isAvailable(course, completed)) return
      setCompleted([...completed, courseId])
    }
    setSaveMessage(null)
  }

  // Feature: Save completions to the database with PUT /api/completions
  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/completions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completed),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        // A 400 carries the server's own error message
        throw new Error(body?.error || `Save failed (HTTP ${res.status})`)
      }
      setCompleted(body)
      setSaveMessage({ type: 'success', text: `Saved at ${new Date().toLocaleTimeString()}` })
    } catch (err) {
      setSaveMessage({ type: 'danger', text: err.message || 'Save failed' })
    } finally {
      setIsSaving(false)
    }
  }

  // Feature: Loading state
  if (isPending || completionsPending) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading courses...</p>
      </div>
    )
  }

  // Feature: Error state
  if (error || completionsError) {
    return (
      <div className="alert alert-danger">
        <h5 className="alert-heading">Error loading courses</h5>
        <p className="mb-0">
          {error || completionsError}. Make sure the Express API is running on {API_BASE_URL}.
        </p>
      </div>
    )
  }

  const validCompleted = completed.filter((id) => courses.some((c) => c.id === id))

  // Feature: Progress summary counts derived with .filter()
  const completedCount = courses.filter((c) => validCompleted.includes(c.id)).length
  const availableCount = courses.filter(
    (c) => !validCompleted.includes(c.id) && isAvailable(c, validCompleted)
  ).length
  const lockedCount = courses.filter(
    (c) => !validCompleted.includes(c.id) && !isAvailable(c, validCompleted)
  ).length

  // Feature: Filter (All / Completed Only / Remaining)
  const visibleCourses = courses.filter((c) => {
    if (filter === 'completed') return completed.includes(c.id)
    if (filter === 'remaining') return !completed.includes(c.id)
    return true
  })

  return (
    <>
      <ProgressSummary
        total={courses.length}
        completedCount={completedCount}
        availableCount={availableCount}
        lockedCount={lockedCount}
      />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        {/* Feature: Filter control */}
        <div className="btn-group" role="group" aria-label="Filter courses">
          {[
            ['all', 'All Courses'],
            ['completed', 'Completed Only'],
            ['remaining', 'Remaining'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`btn ${filter === value ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Feature: Save button */}
        <div className="d-flex align-items-center gap-2">
          {saveMessage && (
            <span className={`text-${saveMessage.type} small`} role="status">
              {saveMessage.text}
            </span>
          )}
          <button type="button" className="btn btn-success" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Feature: Course list display */}
      <CourseList
        courses={visibleCourses}
        getStatus={getStatus}
        getPrereqNumbers={getPrereqNumbers}
        onToggle={handleToggle}
      />
    </>
  )
}

export default HomePage
