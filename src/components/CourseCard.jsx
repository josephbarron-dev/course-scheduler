// Feature: Visually distinct Completed / Available / Locked states
const STATUS_STYLES = {
  Completed: { badge: 'bg-success', border: 'border-success', card: 'course-completed' },
  Available: { badge: 'bg-primary', border: 'border-primary', card: 'course-available' },
  Locked: { badge: 'bg-secondary', border: 'border-secondary', card: 'course-locked' },
}

// Feature: Course card (number, title, credits, description, prerequisites)
const CourseCard = ({ course, status, prereqNumbers, onToggle }) => {
  const style = STATUS_STYLES[status]
  const isCompleted = status === 'Completed'
  const isLocked = status === 'Locked'
  const inputId = `course-${course.id}`

  return (
    <div className={`card h-100 border-2 ${style.border} ${style.card}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{course.number}</h5>
          <span className={`badge ${style.badge}`}>
            {isLocked ? '🔒 ' : isCompleted ? '✓ ' : ''}{status}
          </span>
        </div>
        <h6 className="card-subtitle mb-2">{course.title}</h6>
        <p className="card-text small text-body-secondary flex-grow-1">{course.description}</p>
        <p className="small mb-1"><strong>Credits:</strong> {course.credits}</p>
        <p className="small mb-3">
          <strong>Prerequisites:</strong> {prereqNumbers.length ? prereqNumbers.join(', ') : 'None'}
        </p>
        {/* Feature: Completion checkbox (disabled when Locked) */}
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={inputId}
            checked={isCompleted}
            disabled={isLocked}
            onChange={() => onToggle(course.id)}
          />
          <label className="form-check-label" htmlFor={inputId}>
            {isLocked ? 'Complete prerequisites first' : 'Completed'}
          </label>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
