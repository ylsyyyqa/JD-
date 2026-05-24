import OpenAI from 'openai'

let client = null

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    })
  }
  return client
}

/**
 * 调用 DeepSeek Chat 进行缺口分析
 * @param {string} systemPrompt - 系统提示词
 * @param {string} userMessage - 用户消息
 * @returns {Promise<object>} - 解析后的 JSON 结果
 */
export async function analyzeGap(systemPrompt, userMessage, timeoutMs = 60000) {
  const openai = getClient()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 8192,
    }, {
      signal: controller.signal,
    })

    const content = response.choices[0]?.message?.content || ''

    if (!content.trim()) {
      throw new Error('AI 返回了空内容，可能是请求被服务端拒绝，请稍后重试')
    }

    // 从回复中提取 JSON（可能包裹在 ```json ``` 中）
    let jsonStr = content.trim()

    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*)\s*```/)
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim()
    }

    let result
    try {
      result = JSON.parse(jsonStr)
    } catch (e) {
      const objStart = jsonStr.indexOf('{')
      const objEnd = jsonStr.lastIndexOf('}')
      if (objStart !== -1 && objEnd > objStart) {
        try {
          result = JSON.parse(jsonStr.slice(objStart, objEnd + 1))
        } catch (e2) {
          console.error('JSON parse error (raw):', content.substring(0, 500))
          throw new Error(`AI 返回内容解析失败: ${e2.message}`)
        }
      } else {
        console.error('JSON parse error, no JSON object found in:', content.substring(0, 500))
        throw new Error(`AI 返回内容解析失败: ${e.message}`)
      }
    }

    // 校验必填字段，防止前端白屏
    if (!result.dimensions) result.dimensions = []
    if (!result.criticalGaps) result.criticalGaps = []
    if (!result.importantGaps) result.importantGaps = []
    if (!result.advantages) result.advantages = []
    if (!result.projects) result.projects = []
    if (!result.summary) result.summary = '分析完成，请查看下方详细报告'
    if (result.matchScore == null) result.matchScore = 0

    return result
  } finally {
    clearTimeout(timeout)
  }
}
