import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import RadarChart from '../components/RadarChart'
import GapCard from '../components/GapCard'
import { getReport } from '../services/api'
import { mockReportData } from '../data/mockData'

export default function Report() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      // Demo IDs use mock data (no API key needed)
      if (id && id.startsWith('demo-')) {
        setReport(mockReportData)
        setLoading(false)
        return
      }

      try {
        const data = await getReport(id)
        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="container loading">
        <div className="spinner" />
        <p>加载报告中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container empty-state">
        <div className="icon">⚠️</div>
        <h3>加载失败</h3>
        <p>{error}</p>
        <Link to="/upload" className="btn btn-primary">返回上传页</Link>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="container report-page">
      {/* Score Hero */}
      <div className="score-hero">
        <div className="score-circle">
          <div className="score-number">{report.matchScore}%</div>
          <div className="score-label">岗位匹配度</div>
        </div>
        <h2>{report.jobTitle}</h2>
        <p className="summary">{report.summary}</p>
      </div>

      {/* Radar Chart */}
      {report.dimensions && (
        <div className="radar-section">
          <div className="card">
            <h3>五维能力雷达</h3>
            <RadarChart dimensions={report.dimensions} />
          </div>
        </div>
      )}

      {/* Critical Gaps */}
      {report.criticalGaps?.length > 0 && (
        <div className="gap-section">
          <h3>致命缺口（{report.criticalGaps.length}项）</h3>
          <div className="gap-list">
            {report.criticalGaps.map((gap, i) => (
              <GapCard key={gap.id || `critical-${i}`} gap={gap} />
            ))}
          </div>
        </div>
      )}

      {/* Important Gaps */}
      {report.importantGaps?.length > 0 && (
        <div className="gap-section">
          <h3 style={{ color: '#ea580c' }}>重要缺口（{report.importantGaps.length}项）</h3>
          <div className="gap-list">
            {report.importantGaps.map((gap, i) => (
              <GapCard key={gap.id || `important-${i}`} gap={gap} />
            ))}
          </div>
        </div>
      )}

      {/* Advantages */}
      {report.advantages?.length > 0 && (
        <div className="gap-section">
          <h3 style={{ color: '#16a34a' }}>已有优势（{report.advantages.length}项）</h3>
          <div className="gap-list">
            {report.advantages.map((gap, i) => (
              <GapCard key={gap.id || `advantage-${i}`} gap={gap} />
            ))}
          </div>
        </div>
      )}

      {/* All sections empty fallback */}
      {!report.criticalGaps?.length && !report.importantGaps?.length && !report.advantages?.length && (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>暂无详细分析数据</h3>
          <p>匹配度已计算，但详细缺口数据未生成。可能是 AI 返回格式异常，请尝试重新分析。</p>
        </div>
      )}

      {/* Action Bar */}
      <div className="action-bar">
        <Link to={`/projects/${id}`} className="btn btn-primary btn-lg">
          查看补缺项目思路 →
        </Link>
        <button className="btn btn-outline btn-lg" onClick={() => window.print()}>
          导出报告 PDF
        </button>
      </div>
    </div>
  )
}
