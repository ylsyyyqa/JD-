import { useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { buildResume, getResumeHtmlUrl, mineExperiences } from '../services/api'

const JOB_TYPES = [
  '后端工程师', '前端工程师', 'AI/算法工程师', 'AI 产品经理',
  'C 端运营', '视觉/UI设计师', '市场营销', '财务分析师',
  'HRBP', '销售/BD', '数据分析师', '其他',
]

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams()
  const linkedReportId = searchParams.get('from')
  const [resumeToken, setResumeToken] = useState('')

  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Form state
  const [name, setName] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [jobType, setJobType] = useState('')
  const [contact, setContact] = useState('')
  const [education, setEducation] = useState('')
  const [experiences, setExperiences] = useState('')
  const [projects, setProjects] = useState('')
  const [skills, setSkills] = useState('')
  const [jdText, setJdText] = useState('')
  const [rawMaterial, setRawMaterial] = useState('')
  const [mining, setMining] = useState(false)
  const [miningQuestions, setMiningQuestions] = useState([])
  const [miningAnswers, setMiningAnswers] = useState({})
  const [joinedQuestions, setJoinedQuestions] = useState(new Set())

  const canGenerate = name.trim() && (experiences.trim() || rawMaterial.trim())

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return
    setGenerating(true)
    setError('')

    try {
      const data = await buildResume({
        name, targetRole, contact, education,
        experiences, projects, skills,
        jobType, jdText, rawMaterial,
      })
      setResumeToken(data.accessToken || '')
      setResult(data)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }, [canGenerate, name, targetRole, contact, education, experiences, projects, skills, jobType, jdText, rawMaterial])

  const handleMine = useCallback(async () => {
    if (!rawMaterial.trim()) return
    setMining(true)
    setError('')
    try {
      const data = await mineExperiences({
        rawMaterial: rawMaterial.trim(),
        jobType,
        jdText: jdText.trim(),
      })
      setMiningQuestions(data.questions || [])
      setMiningAnswers({})
      setJoinedQuestions(new Set())
    } catch (err) {
      setError(err.message)
    } finally {
      setMining(false)
    }
  }, [rawMaterial, jobType, jdText])

  const handleJoinMaterial = useCallback((index, question, answer) => {
    if (!answer.trim()) return
    const block = `\n【补充经历 · ${question.dimension}】${answer.trim()}`
    setRawMaterial(prev => prev + block)
    setJoinedQuestions(prev => {
      if (prev.has(index)) return prev
      return new Set([...prev, index])
    })
  }, [])

  const openHtmlPage = () => {
    if (result?.id) {
      window.open(getResumeHtmlUrl(result.id, resumeToken), '_blank')
    }
  }

  if (generating) {
    return (
      <div className="container loading">
        <div className="spinner" />
        <p>AI 正在为你撰写简历...</p>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
          分析背景材料 → 匹配岗位技能维度 → 撰写专业简历 → 输出优化建议
        </p>
      </div>
    )
  }

  return (
    <div className="container resume-page">
      <h2>AI 简历生成</h2>
      <p className="subtitle">
        输入你的经历和背景材料，AI 按目标岗位自动生成专业简历。
        支持"粗料直投"——旧简历、工作流水账、项目文档都可以，无需精细整理。
      </p>

      {linkedReportId && (
        <div style={{
          background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px',
          padding: '12px 16px', marginBottom: '24px', fontSize: '14px', color: '#1e40af'
        }}>
          已关联 JD 缺口报告 —
          <Link to={`/report/${linkedReportId}`} style={{ marginLeft: '8px', fontWeight: 600 }}>
            查看分析结果
          </Link>
        </div>
      )}

      {error && (
        <div className="error-bar">
          {error}
          <button onClick={() => setError('')} className="error-dismiss">✕</button>
        </div>
      )}

      {/* Step indicators */}
      <div className="step-indicators">
        <div className={`step-dot ${step === 1 ? 'active' : ''} ${step === 2 ? 'done' : ''}`}>1</div>
        <div className="step-line" />
        <div className={`step-dot ${step === 2 ? 'active' : ''}`}>2</div>
      </div>

      {step === 1 && (
        <div className="resume-form">
          <div className="form-section">
            <h4>基本信息</h4>
            <div className="form-row">
              <input
                className="input" placeholder="姓名 *"
                value={name} onChange={e => setName(e.target.value)}
              />
              <input
                className="input" placeholder="求职方向（如：Java后端开发实习生）"
                value={targetRole} onChange={e => setTargetRole(e.target.value)}
              />
              <select
                className="input"
                value={jobType}
                onChange={e => setJobType(e.target.value)}
              >
                <option value="">选择岗位类型（可选）</option>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row">
              <input
                className="input" placeholder="联系方式（电话/邮箱/城市，用 | 分隔）"
                value={contact} onChange={e => setContact(e.target.value)}
              />
              <input
                className="input" placeholder="教育背景（如：XX大学 本科 软件工程 2019-2023）"
                value={education} onChange={e => setEducation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h4>目标岗位 JD（可选，用于 ATS 关键词对齐）</h4>
            <textarea
              className="input textarea-mini"
              placeholder="粘贴目标岗位的JD，AI 会自动提取关键词并嵌入简历..."
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-section">
            <h4>自由描述 / 粗料直投 *</h4>
            <p className="form-hint">
              直接把旧简历、工作流水账、项目文档等任何材料粘贴到这里。
              AI 会自动提取关键信息并进行专业化改写。如果下面单独填写了经历和项目，则此处的补充信息也会被融合。
            </p>
            <textarea
              className="input textarea"
              placeholder="把你能想到的所有经历、做过的事、会的技能都倒进来...&#10;&#10;例如：&#10;大三的时候在XX公司实习了3个月，主要做Java开发，写过后端接口，用过Spring Boot和MySQL。&#10;还做过一个校园二手交易小程序，用React写的，但是没上线。&#10;在社团里当过技术部部长，组织过几次黑客松活动。"
              value={rawMaterial}
              onChange={e => setRawMaterial(e.target.value)}
            />
          </div>

          {/* ── AI 经历挖掘 ── */}
          <div className="form-section">
            <div className="mining-trigger">
              <button
                className="btn btn-outline"
                disabled={!rawMaterial.trim() || mining}
                onClick={handleMine}
                style={{ opacity: rawMaterial.trim() ? 1 : 0.5 }}
              >
                {mining ? 'AI 正在回忆中...' : 'AI 帮我回忆'}
              </button>
              <span className="form-hint" style={{ marginLeft: '12px' }}>
                不确定还有什么经历值得写？让 AI 帮你挖掘
              </span>
            </div>

            {mining && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div className="spinner" />
                <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                  AI 正在分析你的背景，生成追问...
                </p>
              </div>
            )}

            {miningQuestions.length > 0 && (
              <div className="mining-questions">
                {miningQuestions.map((q, i) => {
                  const isJoined = joinedQuestions.has(i)
                  const answer = miningAnswers[i] || ''
                  return (
                    <div key={i} className="mining-card">
                      <span className="mining-dimension">{q.dimension}</span>
                      <p className="mining-question">{q.question}</p>
                      {q.hint && <p className="mining-hint">提示：{q.hint}</p>}
                      <div className="mining-answer-row">
                        <input
                          className="mining-input"
                          placeholder="在此输入你的回答..."
                          value={answer}
                          disabled={isJoined}
                          onChange={e => setMiningAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                        />
                        <button
                          className={`btn btn-sm ${isJoined ? 'btn-joined' : 'btn-primary'}`}
                          disabled={isJoined || !answer.trim()}
                          onClick={() => handleJoinMaterial(i, q, answer)}
                        >
                          {isJoined ? '已加入 ✓' : '加入粗料'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!mining && miningQuestions.length === 0 && rawMaterial.trim() && (
              <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
                点击上方按钮，让 AI 帮你发现遗漏的经历
              </p>
            )}
          </div>

          <div className="form-section">
            <h4>工作/实习经历（分条描述，可选）</h4>
            <textarea
              className="input textarea"
              placeholder="公司A | 后端实习生 | 2023.06-2023.09&#10;负责XX系统开发，用Spring Boot写了10+接口&#10;优化了查询性能，响应时间从300ms降到50ms&#10;&#10;公司B | ..."
              value={experiences}
              onChange={e => setExperiences(e.target.value)}
            />
          </div>

          <div className="form-section">
            <h4>项目经验（可选）</h4>
            <textarea
              className="input textarea"
              placeholder="校园二手交易平台 | 全栈开发 | 2023.03-2023.06&#10;用React+Java+MySQL实现商品发布、搜索、收藏功能&#10;..."
              value={projects}
              onChange={e => setProjects(e.target.value)}
            />
          </div>

          <div className="form-section">
            <h4>技能清单（可选，一行一个）</h4>
            <textarea
              className="input textarea-mini"
              placeholder="Java, Spring Boot, MySQL&#10;React, JavaScript&#10;Git, Docker"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary btn-lg"
              disabled={!canGenerate}
              onClick={handleGenerate}
              style={{ opacity: canGenerate ? 1 : 0.5, cursor: canGenerate ? 'pointer' : 'not-allowed' }}
            >
              生成简历
            </button>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div className="resume-result">
          <div className="result-toolbar">
            <button className="btn btn-primary" onClick={openHtmlPage}>
              在新窗口查看/打印
            </button>
            <button className="btn btn-outline" onClick={() => setStep(1)}>
              返回修改
            </button>
            <button className="btn btn-outline" onClick={() => {
              setStep(1)
              setResult(null)
            }}>
              全新生成
            </button>
          </div>

          {/* Embedded preview */}
          <div className="resume-preview">
            <iframe
              src={getResumeHtmlUrl(result.id, resumeToken)}
              title="简历预览"
              style={{ width: '100%', height: '800px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          {result.advice?.length > 0 && (
            <div className="advice-block">
              <h3>面试准备建议</h3>
              {result.advice.map((a, i) => (
                <div key={i} className="advice-item">
                  <strong>{a.title}</strong>：{a.content}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
