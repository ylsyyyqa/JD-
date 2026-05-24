import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="icon">🎯</span>
          <span>JD智析</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" style={pathname === '/' ? { color: '#2563eb' } : {}}>首页</Link>
          <Link to="/upload" style={pathname === '/upload' ? { color: '#2563eb' } : {}}>开始分析</Link>
          <Link to="/resume-builder" style={pathname === '/resume-builder' ? { color: '#2563eb' } : {}}>写简历</Link>
        </nav>
      </div>
    </header>
  )
}
