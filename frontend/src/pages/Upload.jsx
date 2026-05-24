import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { demoScenarios } from '../data/mockData'
import { analyzeJD, analyzeFiles } from '../services/api'

export default function Upload() {
  const navigate = useNavigate()
  const [jdText, setJdText] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [jdMethod, setJdMethod] = useState('paste')
  const [resumeMethod, setResumeMethod] = useState('paste')
  const [jdFile, setJdFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const jdInputRef = useRef(null)
  const resumeInputRef = useRef(null)

  const jdValid = (jdMethod === 'paste' && jdText.trim()) || (jdMethod === 'file' && jdFile)
  const resumeValid = (resumeMethod === 'paste' && resumeText.trim()) || (resumeMethod === 'file' && resumeFile)
  const canAnalyze = jdValid && resumeValid

  const handleFileChange = (e, setFile) => {
    const file = e.target.files?.[0]
    if (file) setFile(file)
  }

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    setAnalyzing(true)
    setError('')

    try {
      let result

      if (jdMethod === 'file' || resumeMethod === 'file') {
        result = await analyzeFiles(
          jdFile || new File([jdText], 'jd.txt', { type: 'text/plain' }),
          resumeFile || new File([resumeText], 'resume.txt', { type: 'text/plain' })
        )
      } else {
        result = await analyzeJD(jdText, resumeText)
      }

      navigate(`/report/${result.id}?token=${encodeURIComponent(result.accessToken)}`)
    } catch (err) {
      setError(err.message)
      setAnalyzing(false)
    }
  }

  const fillDemo = (id) => {
    const demo = demoScenarios.find(d => d.id === id)
    if (demo) {
      setJdText(demo.jd)
      setResumeText(demo.resume)
      setJdMethod('paste')
      setResumeMethod('paste')
      setJdFile(null)
      setResumeFile(null)
    }
  }

  if (analyzing) {
    return (
      <div className="container loading">
        <div className="spinner" />
        <p>AI 正在分析中，请稍候...</p>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
          结构化提取 JD 要求 → 逐项匹配简历证据 → 计算匹配度 → 生成缺口报告
        </p>
      </div>
    )
  }

  return (
    <div className="container upload-page">
      <h2>开始分析</h2>
      <p className="subtitle">上传目标岗位JD和你的简历，AI会逐项对比并生成缺口报告</p>

      {error && (
        <div style={{
          background: '#fef2f2', color: '#dc2626', padding: '12px 16px',
          borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
        }}>
          {error}
          <button
            onClick={() => setError('')}
            style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="upload-grid">
        {/* JD Upload */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              className={`filter-chip ${jdMethod === 'paste' ? 'active' : ''}`}
              onClick={() => setJdMethod('paste')}
            >
              粘贴文本
            </button>
            <button
              className={`filter-chip ${jdMethod === 'file' ? 'active' : ''}`}
              onClick={() => setJdMethod('file')}
            >
              上传文件
            </button>
          </div>

          {jdMethod === 'paste' ? (
            <textarea
              className="upload-textarea"
              placeholder="把岗位JD粘贴到这里...&#10;&#10;例如：&#10;【岗位】Java后端开发实习生&#10;【要求】&#10;1. 计算机相关专业&#10;2. 熟悉Java和Spring Boot&#10;..."
              value={jdText}
              onChange={e => setJdText(e.target.value)}
            />
          ) : (
            <div
              className={`upload-box ${jdFile ? 'has-content' : ''}`}
              onClick={() => jdInputRef.current?.click()}
            >
              <div className="upload-icon">{jdFile ? '✅' : '📄'}</div>
              <h4>{jdFile ? jdFile.name : '点击上传JD文件'}</h4>
              <p className="hint">支持 PDF、Word、TXT</p>
              <input
                ref={jdInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.doc"
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e, setJdFile)}
              />
            </div>
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              className={`filter-chip ${resumeMethod === 'paste' ? 'active' : ''}`}
              onClick={() => setResumeMethod('paste')}
            >
              粘贴文本
            </button>
            <button
              className={`filter-chip ${resumeMethod === 'file' ? 'active' : ''}`}
              onClick={() => setResumeMethod('file')}
            >
              上传文件
            </button>
          </div>

          {resumeMethod === 'paste' ? (
            <textarea
              className="upload-textarea"
              placeholder="把你的简历粘贴到这里...&#10;&#10;例如：&#10;【个人信息】张三 | 软件工程大三&#10;【技能】Java、MySQL&#10;【项目】校园二手交易平台...&#10;"
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
            />
          ) : (
            <div
              className={`upload-box ${resumeFile ? 'has-content' : ''}`}
              onClick={() => resumeInputRef.current?.click()}
            >
              <div className="upload-icon">{resumeFile ? '✅' : '📋'}</div>
              <h4>{resumeFile ? resumeFile.name : '点击上传简历文件'}</h4>
              <p className="hint">支持 PDF、Word、TXT</p>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.doc"
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e, setResumeFile)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="upload-center">
        <button
          className="btn btn-primary btn-lg"
          disabled={!canAnalyze}
          onClick={handleAnalyze}
          style={{ opacity: canAnalyze ? 1 : 0.5, cursor: canAnalyze ? 'pointer' : 'not-allowed' }}
        >
          开始分析
        </button>
      </div>

      {/* Demo quick fill */}
      <div className="demo-section">
        <h3>不想自己填？一键加载Demo数据试试</h3>
        <div className="demo-cards">
          {demoScenarios.map(s => (
            <div
              key={s.id}
              className="demo-card"
              onClick={() => fillDemo(s.id)}
            >
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
