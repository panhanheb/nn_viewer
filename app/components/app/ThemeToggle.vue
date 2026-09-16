<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Sun, Moon, Laptop } from 'lucide-vue-next'
import { useTheme } from '~/composables/useTheme'
import type { ThemeMode } from '~/types/json'

const { themeMode, isDark, setTheme } = useTheme()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectTheme(mode: ThemeMode) {
  setTheme(mode)
  isOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      @click.stop="toggleDropdown"
      class="flex items-center justify-center w-8 h-8 rounded-md transition-colors text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 dark:hover:bg-slate-800/80 light:hover:bg-slate-200/80 focus:outline-none"
      :title="`Theme: ${themeMode}`"
      aria-label="Toggle theme"
    >
      <Sun v-if="themeMode === 'light'" class="w-4 h-4 text-amber-500" />
      <Moon v-else-if="themeMode === 'dark'" class="w-4 h-4 text-sky-400" />
      <Laptop v-else class="w-4 h-4 text-slate-400" />
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-1.5 w-36 rounded-lg py-1 shadow-xl z-50 border bg-white dark:bg-[#18222E] border-slate-200 dark:border-[#26313D] text-xs"
      >
        <button
          type="button"
          @click="selectTheme('light')"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
          :class="{ 'font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30': themeMode === 'light' }"
        >
          <Sun class="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>
        <button
          type="button"
          @click="selectTheme('dark')"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
          :class="{ 'font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30': themeMode === 'dark' }"
        >
          <Moon class="w-3.5 h-3.5 text-sky-400" />
          <span>Dark</span>
        </button>
        <button
          type="button"
          @click="selectTheme('system')"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
          :class="{ 'font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30': themeMode === 'system' }"
        >
          <Laptop class="w-3.5 h-3.5 text-slate-400" />
          <span>System</span>
        </button>
      </div>
    </transition>
  </div>
</template>
