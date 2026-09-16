<script setup lang="ts">
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { X, Keyboard } from 'lucide-vue-next'

const store = useJsonViewerStore()

const shortcuts = [
  { action: 'Format JSON', keys: ['⌘ / Ctrl', 'Enter'] },
  { action: 'Search in JSON', keys: ['⌘ / Ctrl', 'F'] },
  { action: 'Command Palette', keys: ['⌘ / Ctrl', 'K'] },
  { action: 'Download JSON', keys: ['⌘ / Ctrl', 'S'] },
  { action: 'Copy All JSON', keys: ['⌘ / Ctrl', 'Shift', 'C'] },
  { action: 'Close Dialogs / Search', keys: ['Esc'] },
  { action: 'Navigate Search Next / Prev', keys: ['Enter', 'Shift+Enter'] }
]
</script>

<template>
  <transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="store.showShortcutsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
      @click="store.showShortcutsModal = false"
    >
      <div
        class="w-full max-w-md rounded-xl bg-white dark:bg-[#111820] border border-slate-200 dark:border-[#26313D] shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b border-slate-200 dark:border-[#26313D] flex items-center justify-between">
          <div class="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
            <Keyboard class="w-4 h-4 text-sky-500" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            type="button"
            @click="store.showShortcutsModal = false"
            class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#18222E] transition"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Shortcuts List -->
        <div class="p-5 space-y-3 text-xs">
          <div
            v-for="item in shortcuts"
            :key="item.action"
            class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-[#1E293B]/50 last:border-0"
          >
            <span class="text-slate-600 dark:text-slate-300 font-medium">{{ item.action }}</span>
            <div class="flex items-center gap-1 font-mono">
              <kbd
                v-for="k in item.keys"
                :key="k"
                class="px-2 py-1 rounded bg-slate-100 dark:bg-[#18222E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#26313D] text-[11px]"
              >
                {{ k }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 bg-slate-50 dark:bg-[#0E141B] border-t border-slate-200 dark:border-[#26313D] flex justify-end">
          <button
            type="button"
            @click="store.showShortcutsModal = false"
            class="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-[#26313D] text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-[#334155] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
