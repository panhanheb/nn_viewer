<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useJsonSearch } from '~/composables/useJsonSearch'
import { Search, ChevronUp, ChevronDown, X } from 'lucide-vue-next'

const store = useJsonViewerStore()
const {
  searchInput,
  matches,
  currentIndex,
  nextMatch,
  prevMatch,
  executeSearch
} = useJsonSearch()

const inputRef = ref<HTMLInputElement | null>(null)

function closeSearch() {
  store.searchActive = false
  searchInput.value = ''
  store.setSelectedPath(null)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (e.shiftKey) {
      prevMatch()
    } else {
      nextMatch()
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    closeSearch()
  }
}

watch(
  () => store.searchActive,
  (active) => {
    if (active) {
      nextTick(() => {
        inputRef.value?.focus()
        inputRef.value?.select()
      })
    }
  }
)
</script>

<template>
  <transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="store.searchActive"
      class="absolute top-3 right-6 z-30 flex items-center gap-1.5 p-1.5 rounded-lg shadow-xl border bg-white/95 dark:bg-[#111820]/95 backdrop-blur-md border-slate-200 dark:border-[#26313D] text-xs"
    >
      <div class="flex items-center gap-2 pl-2">
        <Search class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          ref="inputRef"
          v-model="searchInput"
          type="text"
          placeholder="Find key, value, path..."
          @keydown="onKeydown"
          class="w-48 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-xs"
        />
      </div>

      <!-- Match counter -->
      <div class="px-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-[#26313D]">
        <span v-if="matches.length > 0">
          {{ currentIndex + 1 }}/{{ matches.length }}
        </span>
        <span v-else-if="searchInput.trim()">
          0 results
        </span>
        <span v-else>
          --
        </span>
      </div>

      <!-- Nav buttons -->
      <div class="flex items-center gap-0.5 border-l border-slate-200 dark:border-[#26313D] pl-1">
        <button
          type="button"
          @click="prevMatch"
          :disabled="matches.length === 0"
          class="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#18222E] disabled:opacity-30 transition"
          title="Previous Match (Shift+Enter)"
        >
          <ChevronUp class="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          @click="nextMatch"
          :disabled="matches.length === 0"
          class="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#18222E] disabled:opacity-30 transition"
          title="Next Match (Enter)"
        >
          <ChevronDown class="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          @click="closeSearch"
          class="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#18222E] transition ml-0.5"
          title="Close (Esc)"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </transition>
</template>
