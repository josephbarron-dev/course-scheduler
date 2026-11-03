// Feature: Progress summary (completed / available / locked)
const ProgressSummary = ({ total, completedCount, availableCount, lockedCount }) => {
  const pct = total ? Math.round((completedCount / total) * 100) : 0
  return (
    <div className="card shadow-sm mb-4 sticky-top progress-summary">
      <div className="card-body py-3">
        <div className="d-flex flex-wrap gap-3 align-items-center mb-2">
          <span className="fw-semibold">
            <span className="badge bg-success me-1">{completedCount}</span> of {total} courses completed
          </span>
          <span><span className="badge bg-primary me-1">{availableCount}</span> available</span>
          <span><span className="badge bg-secondary me-1">{lockedCount}</span> locked</span>
        </div>
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar bg-success" style={{ width: `${pct}%` }}>{pct}%</div>
        </div>
      </div>
    </div>
  )
}

export default ProgressSummary
