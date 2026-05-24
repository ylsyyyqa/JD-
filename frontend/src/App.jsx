import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Report from './pages/Report'
import Projects from './pages/Projects'
import ResumeBuilder from './pages/ResumeBuilder'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/report/:id" element={<Report />} />
          <Route path="/projects/:id" element={<Projects />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>JD智析 — 把JD翻译成你的成长路线图</p>
      </footer>
    </>
  )
}
