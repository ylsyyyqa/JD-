const levelConfig = {
  1: { label: 'L1 · 入门', className: 'l1', phaseClass: 'l1' },
  2: { label: 'L2 · 进阶', className: 'l2', phaseClass: 'l2' },
  3: { label: 'L3 · 深度作品', className: 'l3', phaseClass: 'l3' },
}

export default function ProjectCard({ project }) {
  const level = levelConfig[project.level]

  return (
    <div className="card project-card card-hover">
      <span className={`project-level ${level.className}`}>{level.label}</span>
      <h4>{project.title}</h4>
      <p className="desc">{project.desc}</p>
      <div className="meta">⏱ {project.duration}</div>

      <div className="project-features">
        {project.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </div>

      <div className="project-tags">
        {project.skills.map(skill => (
          <span key={skill} className="project-tag">{skill}</span>
        ))}
      </div>

      <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>
        🔑 <strong>学习关键词：</strong>{project.keywords}
      </div>

      <div className="project-resume">
        ✍️ {project.resumePhrase}
      </div>
    </div>
  )
}
