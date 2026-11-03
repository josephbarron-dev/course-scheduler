import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'

const App = () => (
  <>
    <NavBar />
    <main className="container pb-5">
      {/* Feature: Routes — / and /about */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<div className="alert alert-warning">Page not found.</div>} />
      </Routes>
    </main>
  </>
)

export default App
