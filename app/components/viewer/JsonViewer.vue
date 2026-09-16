<script setup lang="ts">
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useFileDrop } from '~/composables/useFileDrop'
import { useToast } from '~/composables/useToast'
import {
  GitFork,
  ChevronsUpDown,
  ChevronsDownUp,
  Search,
  Upload,
  ClipboardPaste,
  FileSpreadsheet,
  AlertCircle,
  ArrowRight,
  Braces
} from 'lucide-vue-next'
import JsonTree from '~/components/viewer/JsonTree.vue'
import JsonSearch from '~/components/search/JsonSearch.vue'

const store = useJsonViewerStore()
const { openFilePicker } = useFileDrop()
const { showToast } = useToast()

async function onPasteEmpty() {
  if (!navigator.clipboard?.readText) {
    showToast('Clipboard access unavailable', 'error')
    return
  }
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      store.setRawJson(text)
      showToast('Pasted JSON', 'success')
    }
  } catch (err) {
    showToast('Permission denied to read clipboard', 'error')
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#111820] overflow-hidden relative">
    <!-- Search floating bar overlay -->
    <JsonSearch />

    <!-- Viewer Header / Subtoolbar -->
    <div
      class="h-9 shrink-0 px-3 border-b flex items-center justify-between text-xs bg-slate-100/70 dark:bg-[#0E141B] border-slate-200 dark:border-[#26313D] select-none"
    >
      <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
        <GitFork class="w-3.5 h-3.5 text-sky-500" />
        <span>Interactive Tree</span>
        <span
          v-if="store.isValid && store.parsedJson"
          class="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-[#18222E] text-slate-600 dark:text-slate-400 font-mono"
        >
          {{ store.statistics.objects + store.statistics.arrays }} containers
        </span>
      </div>

      <div class="flex items-center gap-1">
        <!-- Search Trigger -->
        <button
          type="button"
          @click="store.searchActive = !store.searchActive"
          class="p-1.5 rounded transition text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#18222E]"
          :class="{ 'text-sky-600 dark:text-sky-400 bg-sky-100/50 dark:bg-sky-950/30': store.searchActive }"
          title="Search JSON (Cmd/Ctrl + F)"
        >
          <Search class="w-3.5 h-3.5" />
        </button>

        <!-- Expand All -->
        <button
          type="button"
          @click="store.expandAll"
          class="p-1.5 rounded transition text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#18222E]"
          title="Expand All"
        >
          <ChevronsUpDown class="w-3.5 h-3.5" />
        </button>

        <!-- Collapse All -->
        <button
          type="button"
          @click="store.collapseAll"
          class="p-1.5 rounded transition text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#18222E]"
          title="Collapse All"
        >
          <ChevronsDownUp class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Main Viewer Body -->
    <div class="flex-1 overflow-auto relative">
      <!-- 1. Empty State (Section 21) -->
      <div
        v-if="!store.hasData"
        class="h-full flex flex-col items-center justify-center p-6 text-center select-none"
      >
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#18222E] flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 border border-slate-200 dark:border-[#26313D] shadow-inner">
          <Braces class="w-8 h-8" />
        </div>
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">JSON Viewer</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 mb-6">
          Paste or upload your JSON to explore the interactive hierarchical tree
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="onPasteEmpty"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition"
          >
            <ClipboardPaste class="w-3.5 h-3.5" />
            <span>Paste JSON</span>
          </button>

          <button
            type="button"
            @click="openFilePicker"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-[#26313D] bg-white dark:bg-[#18222E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#202D3D] transition"
          >
            <Upload class="w-3.5 h-3.5" />
            <span>Open File</span>
          </button>

          <button
            type="button"
            @click="store.loadSample"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-[#26313D] bg-white dark:bg-[#18222E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#202D3D] transition"
          >
            <FileSpreadsheet class="w-3.5 h-3.5" />
            <span>Sample</span>
          </button>
        </div>

        <p class="text-[11px] text-slate-400 mt-6">
          Drop a <code class="font-mono bg-slate-100 dark:bg-[#18222E] px-1 py-0.5 rounded">.json</code> file anywhere
        </p>
      </div>

      <!-- 2. Invalid JSON State (Section 22) -->
      <div
        v-else-if="!store.isValid && store.error"
        class="p-6 max-w-lg mx-auto my-12 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-center"
      >
        <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
          <AlertCircle class="w-6 h-6" />
        </div>
        <h4 class="text-sm font-bold text-rose-800 dark:text-rose-300">Invalid JSON</h4>
        <p class="text-xs text-rose-600 dark:text-rose-400 mt-1 font-mono">
          {{ store.error.message }}
        </p>
        <div class="flex items-center justify-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 mt-3">
          <span>Line: <strong class="text-rose-600 dark:text-rose-400">{{ store.error.line }}</strong></span>
          <span>Column: <strong class="text-rose-600 dark:text-rose-400">{{ store.error.column }}</strong></span>
        </div>
        <button
          type="button"
          @click="store.goToLine(store.error.line)"
          class="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition"
        >
          <span>Go to Line {{ store.error.line }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- 3. Active Tree Content -->
      <JsonTree v-else />
    </div>
  </div>
</template>
