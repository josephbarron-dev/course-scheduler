// Feature: About page (author, date, version)
import { version as VERSION } from '../../package.json'

const AUTHOR = 'Joseph Barron'

const AboutPage = () => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: 600 }}>
      <div className="card-body">
        <h2 className="card-title mb-3">About</h2>
        <p>
          Aurora CS Course Scheduler displays the Computer Science course catalog, tracks completed
          courses, and shows which courses you are eligible to take next.
        </p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Author:</strong> {AUTHOR}</li>
          <li className="list-group-item"><strong>Date:</strong> {today}</li>
          <li className="list-group-item"><strong>Version:</strong> {VERSION}</li>
        </ul>
      </div>
    </div>
  )
}

export default AboutPage
