import { Router } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { analyzeGap } from '../services/deepseek.js'
import { GAP_ANALYSIS_SYSTEM, buildAnalysisUserMessage } from '../services/prompts.js'
import { saveReport, getReport, listReports } from '../db.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

/**
 * POST /api/analyze
 * 分析 JD 和简历的匹配度
 * Body: { jdText, resumeText } 或 multipart/form-data (jdFile, resumeFile)
 */
router.post('/', upload.fields([
  { name: 'jdFile', maxCount: 1 },
  { name: 'resumeFile', maxCount: 1 },
]), async (req, res) => {
  try {
    let jdText = req.body.jdText || ''
    let resumeText = req.body.resumeText || ''

    // 从文件读取（如有）
    if (req.files?.jdFile) {
      const file = req.files.jdFile[0]
      jdText = await extractText(file)
    }
    if (req.files?.resumeFile) {
      const file = req.files.resumeFile[0]
      resumeText = await extractText(file)
    }

    // 校验
    if (!jdText.trim()) {
      return res.status(400).json({ error: '请提供岗位 JD 内容' })
    }
    if (!resumeText.trim()) {
      return res.status(400).json({ error: '请提供个人简历内容' })
    }

    if (jdText.length > 10000) {
      jdText = jdText.substring(0, 10000)
    }
    if (resumeText.length > 10000) {
      resumeText = resumeText.substring(0, 10000)
    }

    // 调用 AI 分析
    const userMessage = buildAnalysisUserMessage(jdText, resumeText)
    const timeoutMs = 90000 // 90秒超时
    const result = await analyzeGap(GAP_ANALYSIS_SYSTEM, userMessage, timeoutMs)

    // 保存到数据库
    const id = uuidv4()
    const accessToken = uuidv4()
    saveReport(id, accessToken, result.jobTitle, jdText, resumeText, result.matchScore, result)

    // 返回结果
    res.json({ id, accessToken, ...result })
  } catch (err) {
    console.error('Analysis error:', err)
    if (err.name === 'AbortError' || err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: 'AI 分析超时，请稍后重试或缩短 JD/简历内容',
      })
    }
    res.status(500).json({
      error: '分析失败，请稍后重试',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  }
})

/**
 * GET /api/analyze/:id
 * 获取已保存的分析报告
 */
router.get('/:id', (req, res) => {
  const { token } = req.query
  if (!token) {
    return res.status(401).json({ error: '缺少访问令牌' })
  }
  const report = getReport(req.params.id, token)
  if (!report) {
    return res.status(404).json({ error: '报告未找到或令牌无效' })
  }
  res.json({ id: report.id, ...report.resultJson })
})

/**
 * GET /api/analyze
 * 列出历史报告
 */
router.get('/', (_req, res) => {
  const reports = listReports(20)
  res.json(reports)
})

/**
 * 从上传文件中提取文本
 */
async function extractText(file) {
  const ext = file.originalname?.toLowerCase().split('.').pop() || ''

  if (ext === 'txt' || !ext) {
    return file.buffer.toString('utf-8')
  }

  if (ext === 'pdf') {
    try {
      // 动态导入 pdf-parse
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(file.buffer)
      return data.text || ''
    } catch (e) {
      console.error('PDF parse error:', e)
      return `[PDF 解析失败: ${e.message}]`
    }
  }

  if (ext === 'docx') {
    try {
      const mammoth = (await import('mammoth')).default
      const result = await mammoth.extractRawText({ buffer: file.buffer })
      return result.value || ''
    } catch (e) {
      console.error('DOCX parse error:', e)
      return `[DOCX 解析失败: ${e.message}]`
    }
  }

  // 其他格式当纯文本尝试
  return file.buffer.toString('utf-8')
}

export default router
