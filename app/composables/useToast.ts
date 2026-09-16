import { ref } from 'vue'
import type { ToastMessage } from '~/types/json'

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  function showToast(text: string, type: ToastMessage['type'] = 'success', duration = 2400) {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: ToastMessage = { id, text, type, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
