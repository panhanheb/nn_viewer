<script setup lang="ts">
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { Check, AlertCircle, Layers, Copy } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

const store = useJsonViewerStore()
const { showToast } = useToast()

function copySelectedPath() {
  if (!store.selectedPath) return
  if (navigator.clipboard) {
    navigator.clipboard.writeText(store.selectedPath).then(() => {
      showToast(`Copied path: ${store.selectedPath}`, 'success')
    })
  }
}
</script>

<template>
  <footer
    class="h-8 shrink-0 px-3 border-t flex items-center justify-between text-[11px] select-none transition-colors bg-white dark:bg-[#0B0F14] border-slate-200 dark:border-[#26313D] text-slate-600 dark:text-slate-400 font-mono"
  >
    <!-- Left: Validation status & selected path -->
    <div class="flex items-center gap-3 overflow-hidden">
      <!-- Status pill -->
      <button
        type="button"
        @click="!store.isValid && (store.showErrorDialog = true)"
        class="flex items-center gap-1.5 px-2 py-0.5 rounded transition font-sans font-medium"
        :class="store.isValid
          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
          : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:underline cursor-pointer'"
      >
        <Check v-if="store.isValid" class="w-3 h-3 text-emerald-500 shrink-0" />
        <AlertCircle v-else class="w-3 h-3 text-rose-500 shrink-0 animate-pulse" />
        <span>{{ store.isValid ? 'Valid JSON' : `Invalid JSON (Line ${store.error?.line || '?'})` }}</span>
      </button>

      <!-- Selected Path with quick copy -->
      <div
        v-if="store.selectedPath"
        @click="copySelectedPath"
        class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#18222E] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223041] cursor-pointer transition max-w-[280px] sm:max-w-md truncate"
        title="Click to copy path"
      >
        <span class="text-slate-400 text-[10px]">Path:</span>
        <span class="truncate font-semibold text-sky-600 dark:text-sky-400">{{ store.selectedPath }}</span>
        <Copy class="w-3 h-3 opacity-60 hover:opacity-100 shrink-0" />
      </div>
    </div>

    <!-- Right: Metrics / Statistics -->
    <div class="flex items-center gap-3 shrink-0">
      <span class="hidden sm:inline">
        Objects: <strong class="text-slate-900 dark:text-slate-200">{{ store.statistics.objects }}</strong>
      </span>
      <span class="hidden sm:inline">
        Arrays: <strong class="text-slate-900 dark:text-slate-200">{{ store.statistics.arrays }}</strong>
      </span>
      <span class="hidden md:inline">
        Keys: <strong class="text-slate-900 dark:text-slate-200">{{ store.statistics.keys }}</strong>
      </span>
      <span class="hidden md:inline">
        Values: <strong class="text-slate-900 dark:text-slate-200">{{ store.statistics.values }}</strong>
      </span>
      <span class="hidden lg:inline">
        Chars: <strong class="text-slate-900 dark:text-slate-200">{{ store.statistics.characters.toLocaleString() }}</strong>
      </span>
      <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#18222E] text-slate-800 dark:text-slate-200 font-semibold">
        {{ store.statistics.sizeFormatted }}
      </span>

      <!-- Line & Column in editor -->
      <span class="hidden xl:inline text-slate-400 pl-2 border-l border-slate-200 dark:border-[#26313D]">
        Ln {{ store.editorCursor.line }}, Col {{ store.editorCursor.column }}
      </span>
    </div>
  </footer>
</template>
