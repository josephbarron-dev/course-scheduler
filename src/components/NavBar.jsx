// Feature: React Router navbar (Home / About)
import { NavLink, Link } from 'react-router-dom'

const NavBar = () => {
  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '')
  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Aurora CS Course Scheduler</Link>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><NavLink className={linkClass} to="/" end>Home</NavLink></li>
          <li className="nav-item"><NavLink className={linkClass} to="/about">About</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
