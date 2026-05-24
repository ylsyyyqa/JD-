import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { analyzeGap } from '../services/deepseek.js'
import { EXPERIENCE_MINING_SYSTEM, buildMiningUserMessage } from '../services/experiencePrompts.js'
import { saveReport, getReport } from '../db.js'

const router = Router()

/**
 * POST /api/resume/mine-experiences
 * 基于用户的粗料和目标 JD，生成引导性问题帮用户回忆遗漏的经历
 * Body: { rawMaterial, jobType?, jdText? }
 */
router.post('/mine-experiences', async (req, res) => {
  try {
    const { rawMaterial, jobType, jdText } = req.body

    if (!rawMaterial || !rawMaterial.trim()) {
      return res.status(400).json({ error: '请先在"粗料直投"中填写一些背景信息' })
    }

    const userMessage = buildMiningUserMessage(rawMaterial.trim(), jobType || '', jdText || '')
    const timeoutMs = 45000
    const result = await analyzeGap(EXPERIENCE_MINING_SYSTEM, userMessage, timeoutMs)

    // 保存到数据库（便于后续追溯）
    const id = uuidv4()
    const accessToken = uuidv4()
    saveReport(id, accessToken, '经历挖掘', rawMaterial, '', 0, {
      ...result,
      type: 'experience-mining',
    })

    res.json({ id, accessToken, questions: result.questions || [] })
  } catch (err) {
    console.error('Mine experiences error:', err)
    if (err.name === 'AbortError' || err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: '经历挖掘超时，请稍后重试或精简输入内容',
      })
    }
    res.status(500).json({
      error: '经历挖掘失败，请稍后重试',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  }
})

/**
 * GET /api/resume/mine-experiences/:id
 * 获取历史挖掘结果
 */
router.get('/mine-experiences/:id', (req, res) => {
  const { token } = req.query
  if (!token) {
    return res.status(401).json({ error: '缺少访问令牌' })
  }
  const report = getReport(req.params.id, token)
  if (!report || report.resultJson?.type !== 'experience-mining') {
    return res.status(404).json({ error: '挖掘记录未找到或令牌无效' })
  }
  res.json({ id: report.id, ...report.resultJson })
})

export default router
