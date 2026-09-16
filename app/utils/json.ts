import type { JsonNodeType, JsonParseError } from '~/types/json'

export function getJsonType(val: unknown): JsonNodeType {
  if (val === null) return 'null'
  if (Array.isArray(val)) return 'array'
  const t = typeof val
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  if (t === 'object') return 'object'
  return 'string'
}

export function parseJsonSafe(text: string): { data: any; error: JsonParseError | null } {
  if (!text.trim()) {
    return { data: null, error: null }
  }

  try {
    const data = JSON.parse(text)
    return { data, error: null }
  } catch (err: any) {
    const errorInfo = extractJsonErrorInfo(err.message, text)
    return { data: null, error: errorInfo }
  }
}

export function extractJsonErrorInfo(errorMessage: string, text: string): JsonParseError {
  let line = 1
  let column = 1

  // Try parsing line and column directly from standard V8 error message: "... at line 12 column 5"
  const lineColMatch = errorMessage.match(/line (\d+) column (\d+)/i)
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10)
    column = parseInt(lineColMatch[2], 10)
  } else {
    // Try matching position: "at position 123"
    const posMatch = errorMessage.match(/position (\d+)/i)
    if (posMatch) {
      const position = parseInt(posMatch[1], 10)
      const lines = text.slice(0, position).split('\n')
      line = lines.length
      column = lines[lines.length - 1].length + 1
    }
  }

  // Get snippet around line
  const allLines = text.split('\n')
  const targetLine = allLines[line - 1] || ''
  const snippet = targetLine.trim()

  return {
    message: errorMessage.replace(/^JSON\.parse: /, '').replace(/at line \d+ column \d+.*$/, '').trim(),
    line,
    column,
    snippet
  }
}

export function formatJsonString(val: unknown, space = 2): string {
  if (val === undefined) return ''
  return JSON.stringify(val, null, space)
}

export function minifyJsonString(val: unknown): string {
  if (val === undefined) return ''
  return JSON.stringify(val)
}

/**
 * Creates standardized JSON path like $.user.address.city or $.users[0].name
 */
export function buildJsonPath(parentPath: string, key: string | number): string {
  if (!parentPath || parentPath === '$') {
    if (typeof key === 'number' || /^\d+$/.test(String(key))) {
      return `$[${key}]`
    }
    return `$.${key}`
  }

  if (typeof key === 'number' || /^\d+$/.test(String(key))) {
    return `${parentPath}[${key}]`
  }

  // If key contains spaces, dots, or special chars, use bracket notation
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(String(key))) {
    return `${parentPath}.${key}`
  }

  return `${parentPath}["${key}"]`
}
