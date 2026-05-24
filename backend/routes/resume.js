import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { analyzeGap } from '../services/deepseek.js'
import { RESUME_SYSTEM, buildResumeUserMessage } from '../services/resumePrompts.js'
import { renderResumeHTML } from '../services/htmlGenerator.js'
import { saveReport, getReport } from '../db.js'

const router = Router()

/**
 * POST /api/resume/build
 * 生成简历
 * Body: { rawMaterial, name, targetRole, contact, education, experiences, projects, skills, jobType, jdText }
 */
router.post('/build', async (req, res) => {
  try {
    const input = req.body

    if (!input.rawMaterial && !input.experiences && !input.name) {
      return res.status(400).json({ error: '请至少提供一些背景材料或经历描述' })
    }

    const userMessage = buildResumeUserMessage(input)
    const timeoutMs = 90000
    const result = await analyzeGap(RESUME_SYSTEM, userMessage, timeoutMs)

    // 生成 HTML
    const html = renderResumeHTML(result)

    // 保存
    const id = uuidv4()
    saveReport(id, result.title || '简历', input.rawMaterial || '', '', 0, {
      ...result,
      htmlContent: html,
      type: 'resume',
    })

    res.json({
      id,
      ...result,
      htmlContent: html,
    })
  } catch (err) {
    console.error('Resume build error:', err)
    if (err.name === 'AbortError' || err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: '简历生成超时，请稍后重试或精简输入内容',
      })
    }
    res.status(500).json({
      error: '简历生成失败，请稍后重试',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  }
})

/**
 * GET /api/resume/:id
 * 获取已生成的简历
 */
router.get('/:id', (req, res) => {
  const report = getReport(req.params.id)
  if (!report || report.resultJson?.type !== 'resume') {
    return res.status(404).json({ error: '简历未找到' })
  }
  res.json({ id: report.id, ...report.resultJson })
})

/**
 * GET /api/resume/:id/html
 * 直接返回 HTML 页面（浏览器可查看/打印）
 */
router.get('/:id/html', (req, res) => {
  const report = getReport(req.params.id)
  if (!report || report.resultJson?.type !== 'resume') {
    return res.status(404).send('<h1>简历未找到</h1>')
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(report.resultJson.htmlContent || '<h1>HTML 内容缺失</h1>')
})

export default router
