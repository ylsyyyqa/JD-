const BASE_URL = '/api'

async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `请求失败 (${res.status})`)
  }

  return res.json()
}

export function analyzeJD(jdText, resumeText) {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify({ jdText, resumeText }),
  })
}

export function analyzeFiles(jdFile, resumeFile) {
  const form = new FormData()
  form.append('jdFile', jdFile)
  form.append('resumeFile', resumeFile)

  return fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    body: form,
  }).then(res => {
    if (!res.ok) {
      return res.json().then(body => {
        throw new Error(body.error || `请求失败 (${res.status})`)
      })
    }
    return res.json()
  })
}

export function getReport(id, token) {
  return request(`/analyze/${id}?token=${encodeURIComponent(token)}`)
}

export function buildResume(data) {
  return request('/resume/build', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getResume(id, token) {
  return request(`/resume/${id}?token=${encodeURIComponent(token)}`)
}

export function getResumeHtmlUrl(id, token) {
  return `/api/resume/${id}/html?token=${encodeURIComponent(token)}`
}

export function mineExperiences(data) {
  return request('/experience/mine-experiences', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
