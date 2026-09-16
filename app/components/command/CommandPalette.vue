<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useTheme } from '~/composables/useTheme'
import { useToast } from '~/composables/useToast'
import { downloadJsonFile } from '~/utils/download'
import {
  Search,
  Code,
  Minimize,
  CheckCircle2,
  ChevronsUpDown,
  ChevronsDownUp,
  Copy,
  Download,
  Moon,
  Maximize2,
  Trash2,
  FileSpreadsheet,
  Columns,
  GitFork,
  FileCode2,
  Keyboard
} from 'lucide-vue-next'

const store = useJsonViewerStore()
const { toggleTheme } = useTheme()
const { showToast } = useToast()

const searchInput = ref('')
const selectedIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const commands = [
  {
    id: 'format',
    title: 'Format JSON',
    description: 'Beautify JSON with 2-space indentation',
    icon: Code,
    shortcut: '⌘Enter',
    action: () => {
      if (store.formatJson()) {
        showToast('JSON formatted', 'success')
      } else {
        showToast('Invalid JSON syntax', 'error')
      }
    }
  },
  {
    id: 'minify',
    title: 'Minify JSON',
    description: 'Compress JSON removing all whitespace',
    icon: Minimize,
    action: () => {
      if (store.minifyJson()) {
        showToast('JSON minified', 'success')
      } else {
        showToast('Invalid JSON syntax', 'error')
      }
    }
  },
  {
    id: 'validate',
    title: 'Validate JSON',
    description: 'Check JSON syntax and inspect errors',
    icon: CheckCircle2,
    action: () => {
      if (store.validateJson()) {
        showToast('Valid JSON', 'success')
      } else {
        store.showErrorDialog = true
      }
    }
  },
  {
    id: 'expand-all',
    title: 'Expand All Nodes',
    description: 'Open all levels in interactive tree',
    icon: ChevronsUpDown,
    action: () => {
      store.expandAll()
      showToast('All nodes expanded', 'info')
    }
  },
  {
    id: 'collapse-all',
    title: 'Collapse All Nodes',
    description: 'Collapse all branches to root',
    icon: ChevronsDownUp,
    action: () => {
      store.collapseAll()
      showToast('All nodes collapsed', 'info')
    }
  },
  {
    id: 'copy',
    title: 'Copy JSON',
    description: 'Copy entire JSON document to clipboard',
    icon: Copy,
    shortcut: '⌘⇧C',
    action: () => {
      if (store.rawJson && navigator.clipboard) {
        navigator.clipboard.writeText(store.rawJson).then(() => {
          showToast('JSON copied to clipboard', 'success')
        })
      }
    }
  },
  {
    id: 'download',
    title: 'Download JSON',
    description: 'Save current JSON to local disk',
    icon: Download,
    shortcut: '⌘S',
    action: () => {
      if (downloadJsonFile(store.rawJson, store.fileName)) {
        showToast('File downloaded', 'success')
      }
    }
  },
  {
    id: 'theme',
    title: 'Toggle Theme',
    description: 'Switch between Dark and Light mode',
    icon: Moon,
    action: () => {
      toggleTheme()
    }
  },
  {
    id: 'fullscreen',
    title: 'Toggle Fullscreen',
    description: 'Expand viewer to cover full display',
    icon: Maximize2,
    action: () => {
      store.toggleFullscreen()
    }
  },
  {
    id: 'view-split',
    title: 'Split View',
    description: 'Show code editor and tree side-by-side',
    icon: Columns,
    action: () => {
      store.setViewMode('split')
    }
  },
  {
    id: 'view-tree',
    title: 'Tree View Only',
    description: 'Focus exclusively on the interactive tree',
    icon: GitFork,
    action: () => {
      store.setViewMode('tree')
    }
  },
  {
    id: 'view-raw',
    title: 'Raw Editor Only',
    description: 'Focus exclusively on the raw JSON code editor',
    icon: FileCode2,
    action: () => {
      store.setViewMode('raw')
    }
  },
  {
    id: 'sample',
    title: 'Load Sample JSON',
    description: 'Populate editor with rich sample data',
    icon: FileSpreadsheet,
    action: () => {
      store.loadSample()
      showToast('Sample JSON loaded', 'info')
    }
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'View list of all application hotkeys',
    icon: Keyboard,
    action: () => {
      store.showShortcutsModal = true
    }
  },
  {
    id: 'clear',
    title: 'Clear JSON',
    description: 'Erase current document',
    icon: Trash2,
    action: () => {
      store.clearJson()
      showToast('JSON cleared', 'info')
    }
  }
]

const filteredCommands = computed(() => {
  if (!searchInput.value.trim()) return commands
  const q = searchInput.value.toLowerCase()
  return commands.filter(
    (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  )
})

function selectCommand(cmd: typeof commands[0]) {
  cmd.action()
  store.showCommandPalette = false
  searchInput.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (!store.showCommandPalette) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (filteredCommands.value.length > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % filteredCommands.value.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (filteredCommands.value.length > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const target = filteredCommands.value[selectedIndex.value]
    if (target) {
      selectCommand(target)
    }
  }
}

watch(
  () => store.showCommandPalette,
  (val) => {
    if (val) {
      selectedIndex.value = 0
      searchInput.value = ''
      nextTick(() => {
        inputEl.value?.focus()
      })
    }
  }
)

watch(filteredCommands, () => {
  selectedIndex.value = 0
})
</script>

<template>
  <transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="store.showCommandPalette"
      class="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
      @click="store.showCommandPalette = false"
      @keydown="handleKeydown"
    >
      <div
        class="w-full max-w-lg rounded-xl bg-white dark:bg-[#111820] border border-slate-200 dark:border-[#26313D] shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Search Input -->
        <div class="px-4 py-3 border-b border-slate-200 dark:border-[#26313D] flex items-center gap-3">
          <Search class="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref="inputEl"
            v-model="searchInput"
            type="text"
            placeholder="Type a command or search action..."
            class="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#18222E] text-slate-500 border border-slate-200 dark:border-[#26313D]">
            ESC
          </kbd>
        </div>

        <!-- Command List -->
        <div class="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          <div v-if="filteredCommands.length === 0" class="p-6 text-center text-xs text-slate-400">
            No commands matching "{{ searchInput }}"
          </div>

          <button
            v-for="(cmd, idx) in filteredCommands"
            :key="cmd.id"
            type="button"
            @click="selectCommand(cmd)"
            @mouseenter="selectedIndex = idx"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors"
            :class="selectedIndex === idx ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18222E]'"
          >
            <div class="flex items-center gap-3">
              <component :is="cmd.icon" class="w-4 h-4 shrink-0 text-slate-400" :class="{ 'text-sky-500 dark:text-sky-400': selectedIndex === idx }" />
              <div>
                <div class="text-xs font-semibold">{{ cmd.title }}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ cmd.description }}</div>
              </div>
            </div>

            <kbd
              v-if="cmd.shortcut"
              class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#18222E] text-slate-500 border border-slate-200 dark:border-[#26313D]"
            >
              {{ cmd.shortcut }}
            </kbd>
          </button>
        </div>

        <!-- Footer -->
        <div class="px-4 py-2 bg-slate-50 dark:bg-[#0E141B] border-t border-slate-200 dark:border-[#26313D] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div class="flex items-center gap-3">
            <span><kbd class="font-bold">↑↓</kbd> navigate</span>
            <span><kbd class="font-bold">↵</kbd> select</span>
          </div>
          <span>Antigravity JSON Viewer</span>
        </div>
      </div>
    </div>
  </transition>
</template>
