<script setup lang="ts">
import { ref } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useToast } from '~/composables/useToast'
import { useFileDrop } from '~/composables/useFileDrop'
import { downloadJsonFile } from '~/utils/download'
import {
  Code,
  Minimize,
  CheckCircle2,
  AlertCircle,
  ChevronsUpDown,
  ChevronsDownUp,
  Copy,
  Download,
  Trash2,
  Upload,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-vue-next'

const store = useJsonViewerStore()
const { showToast } = useToast()
const { openFilePicker } = useFileDrop()

const showDownloadMenu = ref(false)
const showLevelMenu = ref(false)

function onFormat() {
  const success = store.formatJson()
  if (success) {
    showToast('JSON formatted', 'success')
  } else {
    showToast('Cannot format: Syntax errors in JSON', 'error')
  }
}

function onMinify() {
  const success = store.minifyJson()
  if (success) {
    showToast('JSON minified', 'success')
  } else {
    showToast('Cannot minify: Syntax errors in JSON', 'error')
  }
}

function onValidate() {
  const valid = store.validateJson()
  if (valid) {
    showToast('Valid JSON', 'success')
  } else {
    showToast('Invalid JSON syntax detected', 'error')
    store.showErrorDialog = true
  }
}

function onCopy() {
  if (!store.rawJson.trim()) {
    showToast('No JSON to copy', 'warning')
    return
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(store.rawJson).then(() => {
      showToast('JSON copied to clipboard', 'success')
    }).catch(() => {
      showToast('Failed to copy JSON', 'error')
    })
  }
}

function onDownload(formatted = true) {
  if (!store.rawJson.trim()) {
    showToast('No JSON to download', 'warning')
    return
  }

  let content = store.rawJson
  if (formatted && store.parsedJson) {
    content = JSON.stringify(store.parsedJson, null, 2)
  }

  if (downloadJsonFile(content, store.fileName)) {
    showToast('File downloaded', 'success')
  } else {
    showToast('Failed to download', 'error')
  }
  showDownloadMenu.value = false
}

function onExpandAll() {
  store.expandAll()
  showToast('All nodes expanded', 'info')
}

function onCollapseAll() {
  store.collapseAll()
  showToast('All nodes collapsed', 'info')
}

function onExpandLevel(level: number) {
  store.expandToLevel(level)
  showLevelMenu.value = false
  showToast(`Expanded to level ${level}`, 'info')
}

function onClear() {
  if (confirm('Are you sure you want to clear the current JSON?')) {
    store.clearJson()
    showToast('JSON cleared', 'info')
  }
}

function onLoadSample() {
  store.loadSample()
  showToast('Sample JSON loaded', 'info')
}
</script>

<template>
  <div
    class="h-12 shrink-0 px-4 border-b flex items-center justify-between overflow-x-auto no-scrollbar gap-2 transition-colors bg-slate-50 dark:bg-[#0E141B] border-slate-200 dark:border-[#26313D] text-xs select-none"
  >
    <!-- Left Operations: Format, Minify, Validate, Expand, Collapse -->
    <div class="flex items-center gap-1.5 shrink-0">
      <!-- Format -->
      <button
        type="button"
        @click="onFormat"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
        title="Prettify / Format JSON (Cmd/Ctrl + Enter)"
      >
        <Code class="w-3.5 h-3.5 text-sky-500" />
        <span>Format</span>
      </button>

      <!-- Minify -->
      <button
        type="button"
        @click="onMinify"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
        title="Minify JSON"
      >
        <Minimize class="w-3.5 h-3.5 text-indigo-500" />
        <span>Minify</span>
      </button>

      <!-- Validation status badge button -->
      <button
        type="button"
        @click="onValidate"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition active:scale-95"
        :class="store.isValid
          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 hover:bg-emerald-200/60 dark:hover:bg-emerald-900/40 border border-emerald-300/50 dark:border-emerald-800/40'
          : 'text-rose-700 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/40 hover:bg-rose-200/60 dark:hover:bg-rose-900/40 border border-rose-300/50 dark:border-rose-800/40'"
        title="Click to view JSON validation details"
      >
        <CheckCircle2 v-if="store.isValid" class="w-3.5 h-3.5 text-emerald-500" />
        <AlertCircle v-else class="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        <span>{{ store.isValid ? 'Valid' : 'Invalid' }}</span>
      </button>

      <div class="h-4 w-px bg-slate-200 dark:bg-[#26313D] mx-1"></div>

      <!-- Expand All -->
      <button
        type="button"
        @click="onExpandAll"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
        title="Expand all tree nodes"
      >
        <ChevronsUpDown class="w-3.5 h-3.5 text-slate-500" />
        <span class="hidden sm:inline">Expand All</span>
      </button>

      <!-- Collapse All -->
      <button
        type="button"
        @click="onCollapseAll"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
        title="Collapse all tree nodes"
      >
        <ChevronsDownUp class="w-3.5 h-3.5 text-slate-500" />
        <span class="hidden sm:inline">Collapse All</span>
      </button>

      <!-- Expand Level Dropdown -->
      <div class="relative">
        <button
          type="button"
          @click="showLevelMenu = !showLevelMenu"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
          title="Expand specific depth level"
        >
          <span class="hidden md:inline">Levels</span>
          <ChevronDown class="w-3 h-3 text-slate-400" />
        </button>

        <div
          v-if="showLevelMenu"
          class="absolute left-0 mt-1.5 w-32 rounded-lg py-1 shadow-xl z-50 border bg-white dark:bg-[#18222E] border-slate-200 dark:border-[#26313D]"
        >
          <button
            v-for="lvl in [1, 2, 3, 4]"
            :key="lvl"
            type="button"
            @click="onExpandLevel(lvl)"
            class="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Level {{ lvl }}
          </button>
        </div>
      </div>
    </div>

    <!-- Right Operations: Copy, Open, Download, Sample, Clear -->
    <div class="flex items-center gap-1.5 shrink-0">
      <!-- Copy JSON -->
      <button
        type="button"
        @click="onCopy"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
        title="Copy JSON to clipboard (Cmd/Ctrl + Shift + C)"
      >
        <Copy class="w-3.5 h-3.5 text-slate-500" />
        <span class="hidden md:inline">Copy</span>
      </button>

      <!-- Open File -->
      <button
        type="button"
        @click="openFilePicker"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
        title="Open .json file"
      >
        <Upload class="w-3.5 h-3.5 text-slate-500" />
        <span class="hidden sm:inline">Open</span>
      </button>

      <!-- Download Split Button -->
      <div class="relative">
        <div class="flex items-center rounded-md overflow-hidden border border-slate-200 dark:border-[#26313D] bg-white dark:bg-[#18222E]">
          <button
            type="button"
            @click="onDownload(true)"
            class="flex items-center gap-1.5 px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202D3D] active:scale-95 transition"
            title="Download formatted JSON (Cmd/Ctrl + S)"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span class="hidden sm:inline">Download</span>
          </button>
          <button
            type="button"
            @click="showDownloadMenu = !showDownloadMenu"
            class="px-1.5 py-1.5 border-l border-slate-200 dark:border-[#26313D] text-slate-500 hover:bg-slate-100 dark:hover:bg-[#202D3D]"
            aria-label="Download options"
          >
            <ChevronDown class="w-3 h-3" />
          </button>
        </div>

        <div
          v-if="showDownloadMenu"
          class="absolute right-0 mt-1.5 w-44 rounded-lg py-1 shadow-xl z-50 border bg-white dark:bg-[#18222E] border-slate-200 dark:border-[#26313D]"
        >
          <button
            type="button"
            @click="onDownload(true)"
            class="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Download Formatted JSON
          </button>
          <button
            type="button"
            @click="onDownload(false)"
            class="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Download Raw JSON
          </button>
        </div>
      </div>

      <!-- Load Sample -->
      <button
        type="button"
        @click="onLoadSample"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1B2430] active:scale-95 transition"
        title="Load sample JSON"
      >
        <FileSpreadsheet class="w-3.5 h-3.5 text-slate-500" />
        <span class="hidden lg:inline">Sample</span>
      </button>

      <!-- Clear -->
      <button
        type="button"
        @click="onClear"
        class="flex items-center gap-1.5 px-2 py-1.5 rounded-md font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 active:scale-95 transition"
        title="Clear JSON"
      >
        <Trash2 class="w-3.5 h-3.5" />
        <span class="hidden xl:inline">Clear</span>
      </button>
    </div>
  </div>
</template>
