/**
 * 将结构化简历数据渲染为 HTML 文档
 */

export function renderResumeHTML(data) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${h(data.name)} — 简历</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
    color: #333;
    background: #fff;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 48px;
  }
  .header {
    text-align: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid #003366;
  }
  .header h1 { font-size: 28px; font-weight: 700; color: #003366; margin-bottom: 4px; }
  .header .subtitle { font-size: 15px; color: #555; margin-bottom: 8px; }
  .header .contact { font-size: 13px; color: #777; }
  .header .contact span { margin: 0 8px; }
  .summary {
    font-size: 14px;
    color: #555;
    text-align: center;
    margin-bottom: 28px;
    line-height: 1.7;
  }
  h2 {
    font-size: 16px;
    color: #003366;
    border-bottom: 1px solid #ddd;
    padding-bottom: 6px;
    margin-bottom: 14px;
    margin-top: 24px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 8px;
  }
  .skill-cat { font-size: 13px; }
  .skill-cat strong { font-size: 12px; color: #003366; display: block; margin-bottom: 4px; }
  .skill-cat span { display: inline-block; background: #f0f4f8; padding: 2px 8px; border-radius: 3px; margin: 2px 3px 2px 0; font-size: 12px; color: #444; }
  .block { margin-bottom: 16px; }
  .block-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .block-header .org { font-size: 15px; font-weight: 600; color: #222; }
  .block-header .role { font-size: 14px; color: #555; font-weight: 500; }
  .block-header .duration { font-size: 12px; color: #999; white-space: nowrap; }
  ul { list-style: none; padding: 0; }
  li { font-size: 13px; color: #444; margin-bottom: 5px; padding-left: 16px; position: relative; line-height: 1.6; }
  li::before { content: "•"; position: absolute; left: 0; color: #003366; font-weight: bold; }
  .edu-line { font-size: 14px; color: #444; display: flex; justify-content: space-between; }
  .edu-line .school { font-weight: 600; }
  .certs { display: flex; flex-wrap: wrap; gap: 8px; }
  .certs span { font-size: 13px; color: #444; background: #f9f9f9; padding: 3px 10px; border-radius: 4px; }
  .advice-section { margin-top: 40px; padding-top: 24px; border-top: 1px dashed #ccc; }
  .advice-section h3 { font-size: 15px; color: #555; margin-bottom: 12px; }
  .advice-item { margin-bottom: 10px; font-size: 13px; color: #666; padding-left: 8px; border-left: 3px solid #003366; line-height: 1.6; }
  @media print {
    body { padding: 30px 36px; }
    .advice-section { display: none; }
  }
</style>
</head>
<body>

<div class="header">
  <h1>${h(data.name)}</h1>
  <div class="subtitle">${h(data.title)}</div>
  <div class="contact">
    ${[data.city, data.phone, data.email].filter(Boolean).map(s => `<span>${h(s)}</span>`).join('')}
  </div>
</div>

${data.summary ? `<div class="summary">${h(data.summary)}</div>` : ''}

${data.skills?.length ? `
<h2>专业技能</h2>
<div class="skills-grid">
  ${data.skills.map(s => `
  <div class="skill-cat">
    <strong>${h(s.category)}</strong>
    ${(s.items || []).map(i => `<span>${h(i)}</span>`).join('')}
  </div>`).join('')}
</div>
` : ''}

${data.experiences?.length ? `
<h2>工作经历</h2>
${data.experiences.map(exp => `
<div class="block">
  <div class="block-header">
    <span class="org">${h(exp.company)}</span>
    <span class="role">${h(exp.role)}</span>
    <span class="duration">${h(exp.duration)}</span>
  </div>
  <ul>
    ${(exp.highlights || []).map(h => `<li>${h}</li>`).join('')}
  </ul>
</div>`).join('')}
` : ''}

${data.projects?.length ? `
<h2>项目经验</h2>
${data.projects.map(proj => `
<div class="block">
  <div class="block-header">
    <span class="org">${h(proj.name)}</span>
    <span class="role">${h(proj.role)}</span>
    <span class="duration">${h(proj.duration)}</span>
  </div>
  <ul>
    ${(proj.highlights || []).map(h => `<li>${h}</li>`).join('')}
  </ul>
</div>`).join('')}
` : ''}

${data.education?.school ? `
<h2>教育背景</h2>
<div class="edu-line">
  <span class="school">${h(data.education.school)}</span>
  <span>${h(data.education.degree)} · ${h(data.education.major)}</span>
  <span class="duration">${h(data.education.duration)}</span>
</div>
` : ''}

${data.certifications?.length ? `
<h2>证书及荣誉</h2>
<div class="certs">
  ${data.certifications.map(c => `<span>${h(c)}</span>`).join('')}
</div>
` : ''}

${data.advice?.length ? `
<div class="advice-section">
  <h3>高阶顾问建议</h3>
  ${data.advice.map(a => `
  <div class="advice-item">
    <strong>${h(a.title)}：</strong>${h(a.content)}
  </div>`).join('')}
</div>
` : ''}

</body>
</html>`
}

function h(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
