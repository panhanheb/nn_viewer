import { defineStore } from 'pinia'
import type { ViewMode, JsonParseError, JsonStatistics } from '~/types/json'
import { parseJsonSafe, formatJsonString, minifyJsonString } from '~/utils/json'
import { calculateJsonStatistics } from '~/utils/statistics'
import { DEFAULT_SAMPLE_JSON, DEFAULT_SAMPLE_STRING } from '~/utils/sampleJson'

export const useJsonViewerStore = defineStore('jsonViewer', {
  state: () => ({
    rawJson: DEFAULT_SAMPLE_STRING,
    parsedJson: DEFAULT_SAMPLE_JSON as any,
    isValid: true,
    error: null as JsonParseError | null,
    viewMode: 'split' as ViewMode,
    splitRatio: 50, // percentage for split editor
    selectedPath: null as string | null,
    expandedPaths: new Set<string>(['$', '$.application', '$.application.features', '$.user', '$.user.contact', '$.user.contact.location', '$.user.skills', '$.settings']),
    isFullscreen: false,
    fileName: 'data.json',
    searchQuery: '',
    searchActive: false,
    showShortcutsModal: false,
    showCommandPalette: false,
    showErrorDialog: false,
    statistics: calculateJsonStatistics(DEFAULT_SAMPLE_JSON, DEFAULT_SAMPLE_STRING),
    editorCursor: { line: 1, column: 1 },
    editorTargetLine: null as number | null
  }),

  getters: {
    isPathExpanded: (state) => (path: string) => {
      return state.expandedPaths.has(path)
    },
    hasData: (state) => {
      return state.rawJson.trim().length > 0
    }
  },

  actions: {
    setRawJson(text: string, autoParse = true) {
      this.rawJson = text
      if (autoParse) {
        this.parseCurrentJson()
      }
    },

    parseCurrentJson() {
      if (!this.rawJson.trim()) {
        this.parsedJson = null
        this.isValid = true
        this.error = null
        this.statistics = calculateJsonStatistics(null, '')
        return
      }

      const { data, error } = parseJsonSafe(this.rawJson)
      if (error) {
        this.isValid = false
        this.error = error
        // Keep previous parsedJson for tree stability or null
        this.statistics = calculateJsonStatistics(this.parsedJson, this.rawJson)
      } else {
        this.isValid = true
        this.error = null
        this.parsedJson = data
        this.statistics = calculateJsonStatistics(data, this.rawJson)
      }
    },

    formatJson() {
      if (!this.rawJson.trim()) return false
      try {
        const parsed = JSON.parse(this.rawJson)
        this.parsedJson = parsed
        this.rawJson = formatJsonString(parsed, 2)
        this.isValid = true
        this.error = null
        this.statistics = calculateJsonStatistics(parsed, this.rawJson)
        return true
      } catch (err: any) {
        const errorInfo = parseJsonSafe(this.rawJson).error
        this.error = errorInfo
        this.isValid = false
        return false
      }
    },

    minifyJson() {
      if (!this.rawJson.trim()) return false
      try {
        const parsed = JSON.parse(this.rawJson)
        this.parsedJson = parsed
        this.rawJson = minifyJsonString(parsed)
        this.isValid = true
        this.error = null
        this.statistics = calculateJsonStatistics(parsed, this.rawJson)
        return true
      } catch (err: any) {
        const errorInfo = parseJsonSafe(this.rawJson).error
        this.error = errorInfo
        this.isValid = false
        return false
      }
    },

    validateJson(): boolean {
      this.parseCurrentJson()
      return this.isValid
    },

    loadSample() {
      this.rawJson = DEFAULT_SAMPLE_STRING
      this.parsedJson = DEFAULT_SAMPLE_JSON
      this.isValid = true
      this.error = null
      this.fileName = 'sample.json'
      this.statistics = calculateJsonStatistics(DEFAULT_SAMPLE_JSON, DEFAULT_SAMPLE_STRING)
      this.expandedPaths = new Set(['$', '$.application', '$.application.features', '$.user', '$.user.contact', '$.user.contact.location', '$.user.skills', '$.settings'])
    },

    clearJson() {
      this.rawJson = ''
      this.parsedJson = null
      this.isValid = true
      this.error = null
      this.selectedPath = null
      this.expandedPaths.clear()
      this.statistics = calculateJsonStatistics(null, '')
    },

    toggleExpand(path: string) {
      const next = new Set(this.expandedPaths)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      this.expandedPaths = next
    },

    setPathExpanded(path: string, expanded: boolean) {
      const next = new Set(this.expandedPaths)
      if (expanded) {
        next.add(path)
      } else {
        next.delete(path)
      }
      this.expandedPaths = next
    },

    expandAll() {
      if (!this.parsedJson) return
      const allPaths = new Set<string>()

      function collectPaths(obj: any, currentPath: string) {
        allPaths.add(currentPath)
        if (obj && typeof obj === 'object') {
          if (Array.isArray(obj)) {
            // Cap at 1000 to prevent freezing on giant JSON
            const max = Math.min(obj.length, 1000)
            for (let i = 0; i < max; i++) {
              collectPaths(obj[i], `${currentPath}[${i}]`)
            }
          } else {
            const keys = Object.keys(obj)
            for (const key of keys) {
              const childPath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
                ? `${currentPath}.${key}`
                : `${currentPath}["${key}"]`
              collectPaths(obj[key], childPath)
            }
          }
        }
      }

      collectPaths(this.parsedJson, '$')
      this.expandedPaths = allPaths
    },

    collapseAll() {
      this.expandedPaths = new Set()
    },

    expandToLevel(level: number) {
      if (!this.parsedJson) return
      const paths = new Set<string>()

      function traverse(obj: any, currentPath: string, currentLevel: number) {
        if (currentLevel > level) return
        paths.add(currentPath)
        if (obj && typeof obj === 'object') {
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              traverse(obj[i], `${currentPath}[${i}]`, currentLevel + 1)
            }
          } else {
            for (const k of Object.keys(obj)) {
              const childPath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)
                ? `${currentPath}.${k}`
                : `${currentPath}["${k}"]`
              traverse(obj[k], childPath, currentLevel + 1)
            }
          }
        }
      }

      traverse(this.parsedJson, '$', 0)
      this.expandedPaths = paths
    },

    expandAncestors(targetPath: string) {
      if (!targetPath) return
      const next = new Set(this.expandedPaths)
      next.add('$')

      // Parse tokens from path e.g. $.user.skills[0]
      let current = '$'
      const parts = targetPath.replace(/^\$\.?/, '').split(/(?=\[)|(?<=\])|\./)

      for (const part of parts) {
        if (!part) continue
        if (part.startsWith('[')) {
          current = `${current}${part}`
        } else {
          current = current === '$' ? `$.${part}` : `${current}.${part}`
        }
        next.add(current)
      }

      this.expandedPaths = next
    },

    setViewMode(mode: ViewMode) {
      this.viewMode = mode
    },

    setSplitRatio(ratio: number) {
      this.splitRatio = Math.max(20, Math.min(80, ratio))
    },

    setSelectedPath(path: string | null) {
      this.selectedPath = path
    },

    setFileName(name: string) {
      this.fileName = name
    },

    toggleFullscreen() {
      if (!import.meta.client) return
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
        this.isFullscreen = true
      } else {
        document.exitFullscreen().catch(() => {})
        this.isFullscreen = false
      }
    },

    goToLine(line: number) {
      this.editorTargetLine = line
      if (this.viewMode === 'tree') {
        this.viewMode = 'split'
      }
    }
  }
})
