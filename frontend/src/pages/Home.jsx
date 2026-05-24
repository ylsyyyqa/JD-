import { Link, useNavigate } from 'react-router-dom'
import { demoScenarios } from '../data/mockData'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            把岗位JD<span>翻译成</span>
            <br />你的成长路线图
          </h1>
          <p>
            上传你心仪岗位的JD和你的简历，AI逐项对比，找出差距，
            再给你一套从零开始补上的项目思路。不打无准备之仗。
          </p>
          <div className="hero-actions">
            <Link to="/upload" className="btn btn-primary btn-lg">
              开始分析 →
            </Link>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/report/demo-backend')}
            >
              查看Demo报告
            </button>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="steps">
          <div className="card step-card">
            <div className="step-number">1</div>
            <h3>上传JD + 简历</h3>
            <p>支持文本粘贴、PDF、Word 和截图。不想填？点一下 Demo 就能看效果。</p>
          </div>
          <div className="card step-card">
            <div className="step-number">2</div>
            <h3>AI逐项对比分析</h3>
            <p>硬技能、软技能、项目经历、领域知识——四维雷达扫描，缺口按严重度分级标注。</p>
          </div>
          <div className="card step-card">
            <div className="step-number">3</div>
            <h3>拿到项目思路</h3>
            <p>每个缺口生成 L1→L2→L3 递进难度的实战项目，附带技术栈、功能点、简历话术，拿来就能开工。</p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="demo-section">
          <h3>快速体验 Demo（一键填充示例数据）</h3>
          <div className="demo-cards">
            {demoScenarios.map(s => (
              <div
                key={s.id}
                className="demo-card"
                onClick={() => navigate(`/report/${s.id}`)}
              >
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: '40px 0' }} />
    </>
  )
}
