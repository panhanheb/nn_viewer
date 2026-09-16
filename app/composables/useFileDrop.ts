import { ref, onMounted, onUnmounted } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useToast } from '~/composables/useToast'

export function useFileDrop() {
  const store = useJsonViewerStore()
  const { showToast } = useToast()
  const isDraggingOver = ref(false)
  let dragCounter = 0

  function handleFile(file: File) {
    if (!file) return

    // Allow JSON or text
    if (!file.name.endsWith('.json') && file.type && !file.type.includes('json') && !file.type.includes('text')) {
      showToast('Please drop a valid .json file', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (typeof content === 'string') {
        store.setFileName(file.name)
        store.setRawJson(content)
        if (store.isValid) {
          showToast(`Loaded ${file.name}`, 'success')
        } else {
          showToast(`Loaded ${file.name} (with syntax errors)`, 'warning')
        }
      }
    }
    reader.onerror = () => {
      showToast('Unable to read file', 'error')
    }
    reader.readAsText(file)
  }

  function openFilePicker() {
    if (!import.meta.client) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json,text/plain'
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0]
      if (file) {
        handleFile(file)
      }
    }
    input.click()
  }

  function onDragEnter(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter++
    if (e.dataTransfer?.types?.includes('Files')) {
      isDraggingOver.value = true
    }
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter--
    if (dragCounter <= 0) {
      isDraggingOver.value = false
      dragCounter = 0
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDraggingOver.value = false
    dragCounter = 0

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  onMounted(() => {
    if (!import.meta.client) return
    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
  })

  onUnmounted(() => {
    if (!import.meta.client) return
    window.removeEventListener('dragenter', onDragEnter)
    window.removeEventListener('dragleave', onDragLeave)
    window.removeEventListener('dragover', onDragOver)
    window.removeEventListener('drop', onDrop)
  })

  return {
    isDraggingOver,
    openFilePicker,
    handleFile
  }
}
