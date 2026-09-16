import { ref, watch, computed } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import type { JsonSearchMatch } from '~/types/json'

export function useJsonSearch() {
  const store = useJsonViewerStore()
  const searchInput = ref('')
  const matches = ref<JsonSearchMatch[]>([])
  const currentIndex = ref(0)
  const isSearching = ref(false)

  function executeSearch(query: string) {
    if (!query.trim() || !store.parsedJson) {
      matches.value = []
      currentIndex.value = 0
      return
    }

    const q = query.toLowerCase()
    const results: JsonSearchMatch[] = []
    let counter = 0
    const MAX_MATCHES = 200 // Cap to prevent lagging on huge files

    function searchRecursive(data: any, currentPath: string, keyName: string | number) {
      if (counter >= MAX_MATCHES) return

      // Check key match
      const keyStr = String(keyName)
      if (keyStr.toLowerCase().includes(q)) {
        results.push({
          id: `match-${counter++}`,
          path: currentPath,
          key: keyName,
          matchType: 'key',
          valuePreview: typeof data === 'object' ? (Array.isArray(data) ? `Array[${data.length}]` : 'Object') : String(data)
        })
      }

      // Check value match for primitives
      if (data !== null && data !== undefined && typeof data !== 'object') {
        const valStr = String(data)
        if (valStr.toLowerCase().includes(q)) {
          results.push({
            id: `match-${counter++}`,
            path: currentPath,
            key: keyName,
            matchType: 'value',
            valuePreview: valStr
          })
        }
      }

      // Recurse into object/array
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            if (counter >= MAX_MATCHES) break
            searchRecursive(data[i], `${currentPath}[${i}]`, i)
          }
        } else {
          for (const k of Object.keys(data)) {
            if (counter >= MAX_MATCHES) break
            const childPath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)
              ? `${currentPath}.${k}`
              : `${currentPath}["${k}"]`
            searchRecursive(data[k], childPath, k)
          }
        }
      }
    }

    searchRecursive(store.parsedJson, '$', 'root')
    matches.value = results
    currentIndex.value = results.length > 0 ? 0 : -1

    if (results.length > 0) {
      goToMatch(0)
    }
  }

  function goToMatch(index: number) {
    if (matches.value.length === 0) return
    const normalizedIndex = (index + matches.value.length) % matches.value.length
    currentIndex.value = normalizedIndex
    const currentMatch = matches.value[normalizedIndex]

    if (currentMatch) {
      store.expandAncestors(currentMatch.path)
      store.setSelectedPath(currentMatch.path)

      // Scroll into view if in browser
      if (import.meta.client) {
        setTimeout(() => {
          const el = document.querySelector(`[data-tree-path="${CSS.escape(currentMatch.path)}"]`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 50)
      }
    }
  }

  function nextMatch() {
    if (matches.value.length > 0) {
      goToMatch(currentIndex.value + 1)
    }
  }

  function prevMatch() {
    if (matches.value.length > 0) {
      goToMatch(currentIndex.value - 1)
    }
  }

  let searchTimeout: any = null
  watch(searchInput, (newVal) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      executeSearch(newVal)
    }, 150)
  })

  // Re-run search if parsedJson changes
  watch(() => store.parsedJson, () => {
    if (searchInput.value) {
      executeSearch(searchInput.value)
    }
  })

  const currentMatch = computed(() => {
    if (currentIndex.value >= 0 && currentIndex.value < matches.value.length) {
      return matches.value[currentIndex.value]
    }
    return null
  })

  return {
    searchInput,
    matches,
    currentIndex,
    currentMatch,
    isSearching,
    nextMatch,
    prevMatch,
    goToMatch,
    executeSearch
  }
}
