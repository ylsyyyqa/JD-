import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'data', 'reports.json')

function readAll() {
  try {
    if (!fs.existsSync(dbPath)) return []
    const raw = fs.readFileSync(dbPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeAll(records) {
  fs.writeFileSync(dbPath, JSON.stringify(records, null, 2), 'utf-8')
}

export function saveReport(id, accessToken, jobTitle, jdText, resumeText, matchScore, resultJson) {
  const records = readAll()
  records.unshift({
    id,
    accessToken,
    jobTitle,
    matchScore,
    resultJson,
    createdAt: new Date().toISOString(),
  })
  // 最多保留100条
  if (records.length > 100) records.length = 100
  writeAll(records)
  return id
}

export function getReport(id, accessToken) {
  const records = readAll()
  return records.find(r => r.id === id && r.accessToken === accessToken) || null
}

export function listReports(limit = 20) {
  const records = readAll()
  return records.slice(0, limit).map(({ id, jobTitle, matchScore, createdAt }) => ({
    id, jobTitle, matchScore, createdAt,
  }))
}
