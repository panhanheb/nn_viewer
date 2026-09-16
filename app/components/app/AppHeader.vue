<script setup lang="ts">
import { useJsonViewerStore } from '~/stores/jsonViewer'
import {
  Braces,
  Search,
  Command,
  Keyboard,
  Maximize2,
  Minimize2,
  FileCode2,
  GitFork,
  Columns
} from 'lucide-vue-next'
import ThemeToggle from '~/components/app/ThemeToggle.vue'

const store = useJsonViewerStore()
</script>

<template>
  <header
    class="h-14 shrink-0 px-4 border-b flex items-center justify-between backdrop-blur-md sticky top-0 z-40 transition-colors bg-white/90 dark:bg-[#111820]/90 border-slate-200 dark:border-[#26313D]"
  >
    <!-- Left: Logo and Brand -->
    <div class="flex items-center gap-3">
      <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md shadow-sky-500/20 text-white">
        <Braces class="w-4 h-4 stroke-[2.5]" />
      </div>
      <div class="flex items-center gap-2">
        <span class="font-bold text-sm tracking-tight text-slate-900 dark:text-white">JSON Viewer</span>
        <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50">
          v1.0
        </span>
      </div>

      <!-- File indicator if open -->
      <div
        v-if="store.fileName"
        class="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200 dark:border-[#26313D] text-xs text-slate-500 dark:text-slate-400"
      >
        <span class="truncate max-w-[160px] font-mono">{{ store.fileName }}</span>
      </div>
    </div>

    <!-- Center: View Mode Segmented Control -->
    <div class="hidden sm:flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#26313D] text-xs">
      <button
        type="button"
        @click="store.setViewMode('split')"
        class="flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all"
        :class="store.viewMode === 'split' ? 'bg-white dark:bg-[#18222E] text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
      >
        <Columns class="w-3.5 h-3.5" />
        <span>Split</span>
      </button>

      <button
        type="button"
        @click="store.setViewMode('tree')"
        class="flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all"
        :class="store.viewMode === 'tree' ? 'bg-white dark:bg-[#18222E] text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
      >
        <GitFork class="w-3.5 h-3.5" />
        <span>Tree</span>
      </button>

      <button
        type="button"
        @click="store.setViewMode('raw')"
        class="flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all"
        :class="store.viewMode === 'raw' ? 'bg-white dark:bg-[#18222E] text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
      >
        <FileCode2 class="w-3.5 h-3.5" />
        <span>Raw</span>
      </button>
    </div>

    <!-- Right: Search, Command Palette, Shortcuts, Theme, Fullscreen -->
    <div class="flex items-center gap-1.5">
      <!-- Search Button -->
      <button
        type="button"
        @click="store.searchActive = !store.searchActive"
        class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18222E] border border-slate-200 dark:border-[#26313D] transition-colors"
        title="Find in JSON (Cmd/Ctrl + F)"
      >
        <Search class="w-3.5 h-3.5 text-slate-400" />
        <span class="hidden md:inline">Search</span>
        <kbd class="hidden md:inline text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-[#0B0F14] text-slate-500 border border-slate-200 dark:border-[#26313D]">
          ⌘F
        </kbd>
      </button>

      <!-- Command Palette Button -->
      <button
        type="button"
        @click="store.showCommandPalette = true"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18222E] border border-slate-200 dark:border-[#26313D] transition-colors"
        title="Command Palette (Cmd/Ctrl + K)"
      >
        <Command class="w-3.5 h-3.5 text-slate-400" />
        <span class="hidden lg:inline">Commands</span>
        <kbd class="hidden lg:inline text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-[#0B0F14] text-slate-500 border border-slate-200 dark:border-[#26313D]">
          ⌘K
        </kbd>
      </button>

      <!-- Keyboard Shortcuts Dialog Trigger -->
      <button
        type="button"
        @click="store.showShortcutsModal = true"
        class="flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#18222E] transition-colors"
        title="Keyboard Shortcuts"
        aria-label="Keyboard Shortcuts"
      >
        <Keyboard class="w-4 h-4" />
      </button>

      <!-- Fullscreen Toggle -->
      <button
        type="button"
        @click="store.toggleFullscreen"
        class="flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#18222E] transition-colors"
        title="Toggle Fullscreen"
        aria-label="Toggle Fullscreen"
      >
        <Minimize2 v-if="store.isFullscreen" class="w-4 h-4 text-sky-400" />
        <Maximize2 v-else class="w-4 h-4" />
      </button>

      <div class="h-4 w-px bg-slate-200 dark:bg-[#26313D] mx-1"></div>

      <!-- Theme Switcher -->
      <ThemeToggle />
    </div>
  </header>
</template>
