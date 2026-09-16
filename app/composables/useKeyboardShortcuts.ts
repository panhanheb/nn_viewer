import { onMounted, onUnmounted } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useToast } from '~/composables/useToast'
import { downloadJsonFile } from '~/utils/download'

export function useKeyboardShortcuts() {
  const store = useJsonViewerStore()
  const { showToast } = useToast()

  function handleKeyDown(e: KeyboardEvent) {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    const modifier = isMac ? e.metaKey : e.ctrlKey

    // Esc: close active modals/search
    if (e.key === 'Escape') {
      if (store.showCommandPalette) {
        store.showCommandPalette = false
        e.preventDefault()
        return
      }
      if (store.showShortcutsModal) {
        store.showShortcutsModal = false
        e.preventDefault()
        return
      }
      if (store.showErrorDialog) {
        store.showErrorDialog = false
        e.preventDefault()
        return
      }
      if (store.searchActive) {
        store.searchActive = false
        e.preventDefault()
        return
      }
    }

    if (!modifier) return

    // Cmd/Ctrl + Enter: Format JSON
    if (e.key === 'Enter') {
      e.preventDefault()
      const ok = store.formatJson()
      if (ok) {
        showToast('JSON formatted', 'success')
      } else {
        showToast('Unable to format: Invalid JSON', 'error')
      }
      return
    }

    // Cmd/Ctrl + F: Search
    if (e.key.toLowerCase() === 'f' && !e.shiftKey) {
      e.preventDefault()
      store.searchActive = !store.searchActive
      return
    }

    // Cmd/Ctrl + K: Command menu
    if (e.key.toLowerCase() === 'k') {
      e.preventDefault()
      store.showCommandPalette = !store.showCommandPalette
      return
    }

    // Cmd/Ctrl + S: Download
    if (e.key.toLowerCase() === 's' && !e.shiftKey) {
      e.preventDefault()
      if (downloadJsonFile(store.rawJson, store.fileName)) {
        showToast('File downloaded', 'success')
      } else {
        showToast('Download failed', 'error')
      }
      return
    }

    // Cmd/Ctrl + Shift + C: Copy JSON
    if (e.key.toLowerCase() === 'c' && e.shiftKey) {
      e.preventDefault()
      if (navigator.clipboard) {
        navigator.clipboard.writeText(store.rawJson).then(() => {
          showToast('JSON copied to clipboard', 'success')
        }).catch(() => {
          showToast('Unable to copy to clipboard', 'error')
        })
      }
      return
    }
  }

  onMounted(() => {
    if (!import.meta.client) return
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    if (!import.meta.client) return
    window.removeEventListener('keydown', handleKeyDown)
  })
}
