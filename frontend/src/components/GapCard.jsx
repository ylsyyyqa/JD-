const severityConfig = {
  critical: { icon: '🔴', label: '致命缺口', tagClass: 'critical', cardClass: 'critical' },
  important: { icon: '🟠', label: '重要缺口', tagClass: 'important', cardClass: 'important' },
  match: { icon: '🟢', label: '已有优势', tagClass: 'match', cardClass: 'match' },
}

export default function GapCard({ gap }) {
  const config = severityConfig[gap.severity]

  return (
    <div className={`card gap-card ${config.cardClass}`}>
      <div className="gap-icon">{config.icon}</div>
      <div className="gap-content">
        <h4>{gap.title}</h4>
        <p>{gap.description}</p>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className={`gap-tag ${config.tagClass}`}>{config.label}</span>
          <span style={{ fontSize: '12px', color: '#9ca3af', padding: '3px 0' }}>
            {gap.dimension}
          </span>
        </div>
        {gap.jdRequirement && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
              JD要求 &nbsp;|&nbsp; 简历证据
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div style={{ background: '#fef2f2', padding: '8px 12px', borderRadius: '6px', color: '#991b1b' }}>
                {gap.jdRequirement}
              </div>
              <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: '6px', color: '#166534' }}>
                {gap.resumeEvidence}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
