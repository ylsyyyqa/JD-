import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { getReport } from '../services/api'
import { mockProjectIdeas, mockReportData } from '../data/mockData'

export default function Projects() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [projects, setProjects] = useState([])
  const [activeLevel, setActiveLevel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        let data
        if (id && id.startsWith('demo-')) {
          data = mockReportData
          setProjects(mockProjectIdeas)
        } else {
          data = await getReport(id)
          setProjects(data.projects || [])
        }
        setReport(data)
      } catch (err) {
        console.error('Failed to load projects:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Group projects by gap
  const groupedProjects = useMemo(() => {
    const groups = {}
    projects.forEach(p => {
      if (activeLevel && p.level !== activeLevel) return
      const key = p.gapTitle || '未分类'
      if (!groups[key]) groups[key] = []
      groups[key].push(p)
    })
    return groups
  }, [projects, activeLevel])

  // Find corresponding gap severity
  const getGapSeverity = (gapTitle) => {
    if (!report) return 'important'
    const allGaps = [...(report.criticalGaps || []), ...(report.importantGaps || [])]
    const found = allGaps.find(g => g.title === gapTitle)
    return found?.severity || 'important'
  }

  const severityIcon = { critical: '🔴', important: '🟠' }

  if (loading) {
    return (
      <div className="container loading">
        <div className="spinner" />
        <p>加载项目思路中...</p>
      </div>
    )
  }

  return (
    <div className="container projects-page">
      <h2>补缺项目思路</h2>
      <p className="subtitle">
        针对缺口报告中的每个技能短板，AI 生成了三级递进难度的实战项目。
        从入门到深度作品，选择适合你当前水平的项目开始动手。
      </p>

      {/* Level Filter */}
      <div className="filter-bar">
        <button
          className={`filter-chip ${activeLevel === null ? 'active' : ''}`}
          onClick={() => setActiveLevel(null)}
        >
          全部难度
        </button>
        {[1, 2, 3].map(level => (
          <button
            key={level}
            className={`filter-chip ${activeLevel === level ? 'active' : ''}`}
            onClick={() => setActiveLevel(level)}
          >
            L{level}
          </button>
        ))}
      </div>

      {/* Project Groups */}
      {Object.entries(groupedProjects).map(([gapTitle, projs]) => {
        const severity = getGapSeverity(gapTitle)

        return (
          <div key={gapTitle} className="gap-group">
            <h3>
              {severityIcon[severity]} 补缺目标：{gapTitle}
              <span style={{ fontSize: '14px', fontWeight: '400', color: '#9ca3af', marginLeft: '8px' }}>
                （{projs.length}个项目思路）
              </span>
            </h3>
            <div className="project-grid">
              {projs.map((proj, i) => (
                <ProjectCard key={proj.id || `proj-${i}`} project={proj} />
              ))}
            </div>
          </div>
        )
      })}

      {Object.keys(groupedProjects).length === 0 && (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>{projects.length === 0 ? '暂无项目思路' : '当前筛选条件下没有项目'}</h3>
          <p>{projects.length === 0 ? '该报告未生成项目思路，可能是因为缺口较少。' : '试试切换难度筛选，或清除筛选查看全部'}</p>
        </div>
      )}

      {/* Bottom actions */}
      <div className="action-bar" style={{ marginTop: '40px' }}>
        <Link to={`/report/${id}`} className="btn btn-outline btn-lg">
          ← 返回缺口报告
        </Link>
        <button className="btn btn-primary btn-lg" onClick={() => window.print()}>
          导出全部项目思路
        </button>
      </div>
    </div>
  )
}
