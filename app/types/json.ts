export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export interface JsonObject {
  [key: string]: JsonValue
}

export type JsonArray = JsonValue[]

export type JsonNodeType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array'

export interface JsonNode {
  key: string | number
  path: string
  value: any
  type: JsonNodeType
  depth: number
  childrenCount?: number
  parentPath?: string
}

export interface JsonStatistics {
  objects: number
  arrays: number
  keys: number
  values: number
  characters: number
  sizeFormatted: string
  sizeBytes: number
}

export interface JsonParseError {
  message: string
  line: number
  column: number
  snippet?: string
}

export type ViewMode = 'split' | 'tree' | 'raw'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface JsonSearchMatch {
  id: string
  path: string
  key: string | number
  matchType: 'key' | 'value' | 'path'
  valuePreview: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  text: string
  duration?: number
}
