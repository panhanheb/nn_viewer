import { ref, computed, watch, onMounted } from 'vue'
import type { ThemeMode } from '~/types/json'

const themeMode = ref<ThemeMode>('dark')
const systemIsDark = ref(true)

export function useTheme() {
  const isDark = computed(() => {
    if (themeMode.value === 'system') {
      return systemIsDark.value
    }
    return themeMode.value === 'dark'
  })

  function applyTheme() {
    if (!import.meta.client) return
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  }

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode
    if (import.meta.client) {
      localStorage.setItem('nn_viewer_theme', mode)
    }
    applyTheme()
  }

  function toggleTheme() {
    if (themeMode.value === 'dark') {
      setTheme('light')
    } else if (themeMode.value === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  onMounted(() => {
    if (!import.meta.client) return

    // Load saved theme
    const saved = localStorage.getItem('nn_viewer_theme') as ThemeMode | null
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      themeMode.value = saved
    }

    // Media query listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemIsDark.value = mediaQuery.matches

    const handler = (e: MediaQueryListEvent) => {
      systemIsDark.value = e.matches
      if (themeMode.value === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handler)
    applyTheme()
  })

  watch(isDark, () => {
    applyTheme()
  })

  return {
    themeMode,
    isDark,
    setTheme,
    toggleTheme
  }
}
