import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import analyzeRouter from './routes/analyze.js'
import resumeRouter from './routes/resume.js'
import experienceRouter from './routes/experience.js'

// --- 启动校验 ---
const REQUIRED_ENV = ['DEEPSEEK_API_KEY']
const missing = REQUIRED_ENV.filter(k => !process.env[k])
if (missing.length > 0) {
  console.error(`[启动失败] 缺少必要的环境变量: ${missing.join(', ')}`)
  console.error('请检查 backend/.env 文件是否正确配置')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(s => s.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS blocked'))
    }
  },
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 全局限流
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟窗口
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求过于频繁，请稍后再试' },
})
app.use(globalLimiter)

// AI 接口严格限流
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI 分析请求过于频繁，请稍后再试' },
})

// Routes
app.use('/api/analyze', aiLimiter, analyzeRouter)
app.use('/api/resume', aiLimiter, resumeRouter)
app.use('/api/experience', aiLimiter, experienceRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    timestamp: new Date().toISOString(),
  })
})

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`JD智析后端已启动: http://localhost:${PORT}`)
  console.log(`API 健康检查: http://localhost:${PORT}/api/health`)
  console.log(`AI 模型: ${process.env.DEEPSEEK_MODEL || 'deepseek-chat'}`)
})
