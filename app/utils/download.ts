export function downloadJsonFile(content: string, filename = 'data.json'): boolean {
  if (typeof window === 'undefined') return false

  try {
    const cleanFilename = filename.endsWith('.json') ? filename : `${filename}.json`
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', cleanFilename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (err) {
    console.error('Failed to download JSON file', err)
    return false
  }
}
