<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useFileDrop } from '~/composables/useFileDrop'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import AppHeader from '~/components/app/AppHeader.vue'
import AppToolbar from '~/components/app/AppToolbar.vue'
import AppStatusBar from '~/components/app/AppStatusBar.vue'
import JsonEditor from '~/components/editor/JsonEditor.vue'
import JsonViewer from '~/components/viewer/JsonViewer.vue'
import CommandPalette from '~/components/command/CommandPalette.vue'
import KeyboardShortcuts from '~/components/dialogs/KeyboardShortcuts.vue'
import JsonErrorDialog from '~/components/dialogs/JsonErrorDialog.vue'
import DragOverlay from '~/components/common/DragOverlay.vue'
import ToastContainer from '~/components/app/ToastContainer.vue'
import { FileCode2, GitFork, GripVertical } from 'lucide-vue-next'

const store = useJsonViewerStore()
const { isDraggingOver } = useFileDrop()
useKeyboardShortcuts()

// Resizable Split Pane state
const containerRef = ref<HTMLElement | null>(null)
const isDraggingSplit = ref(false)
const mobileTab = ref<'editor' | 'viewer'>('editor')

function onMouseDownSplit(e: MouseEvent) {
  e.preventDefault()
  isDraggingSplit.value = true
  document.body.classList.add('resizing-active')
  window.addEventListener('mousemove', onMouseMoveSplit)
  window.addEventListener('mouseup', onMouseUpSplit)
}

function onMouseMoveSplit(e: MouseEvent) {
  if (!isDraggingSplit.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const offset = e.clientX - rect.left
  const totalWidth = rect.width
  let percentage = (offset / totalWidth) * 100

  // Clamping to minimum 280px or 20%-80%
  const minPixels = 280
  const minPercent = (minPixels / totalWidth) * 100
  const maxPercent = 100 - minPercent

  percentage = Math.max(minPercent, Math.min(maxPercent, percentage))
  store.setSplitRatio(percentage)
}

function onMouseUpSplit() {
  isDraggingSplit.value = false
  document.body.classList.remove('resizing-active')
  window.removeEventListener('mousemove', onMouseMoveSplit)
  window.removeEventListener('mouseup', onMouseUpSplit)
}

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('mousemove', onMouseMoveSplit)
    window.removeEventListener('mouseup', onMouseUpSplit)
  }
})
</script>

<template>
  <div class="w-full h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-slate-100 font-sans theme-transition">
    <!-- Header -->
    <AppHeader />

    <!-- Toolbar -->
    <AppToolbar />

    <!-- Mobile view segmented tabs (visible on < 768px) -->
    <div class="md:hidden flex items-center justify-around border-b border-slate-200 dark:border-[#26313D] bg-slate-100 dark:bg-[#111820] p-1 text-xs">
      <button
        type="button"
        @click="mobileTab = 'editor'"
        class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition"
        :class="mobileTab === 'editor' ? 'bg-white dark:bg-[#18222E] text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500'"
      >
        <FileCode2 class="w-3.5 h-3.5" />
        <span>Editor</span>
      </button>
      <button
        type="button"
        @click="mobileTab = 'viewer'"
        class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition"
        :class="mobileTab === 'viewer' ? 'bg-white dark:bg-[#18222E] text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500'"
      >
        <GitFork class="w-3.5 h-3.5" />
        <span>Tree Viewer</span>
      </button>
    </div>

    <!-- Main Workspace -->
    <main
      ref="containerRef"
      class="flex-1 flex overflow-hidden relative"
    >
      <!-- Mobile View Rendering -->
      <div class="md:hidden w-full h-full flex flex-col overflow-hidden">
        <div v-show="mobileTab === 'editor'" class="w-full h-full">
          <ClientOnly>
            <JsonEditor />
          </ClientOnly>
        </div>
        <div v-show="mobileTab === 'viewer'" class="w-full h-full">
          <JsonViewer />
        </div>
      </div>

      <!-- Desktop View Rendering: Supports 'split', 'tree', 'raw' -->
      <template class="hidden md:flex w-full h-full">
        <!-- 1. JSON Editor Pane -->
        <div
          v-show="store.viewMode === 'raw' || store.viewMode === 'split'"
          class="h-full flex flex-col overflow-hidden"
          :style="{
            width: store.viewMode === 'split' ? `${store.splitRatio}%` : '100%'
          }"
        >
          <ClientOnly>
            <JsonEditor />
          </ClientOnly>
        </div>

        <!-- 2. Draggable Splitter Divider -->
        <div
          v-if="store.viewMode === 'split'"
          @mousedown="onMouseDownSplit"
          class="w-1.5 hover:w-2 bg-slate-200 dark:bg-[#26313D] hover:bg-sky-500 dark:hover:bg-sky-500 transition-all duration-100 cursor-col-resize flex items-center justify-center shrink-0 z-20 group"
          :class="{ 'bg-sky-500 dark:bg-sky-500 w-2': isDraggingSplit }"
          title="Drag to resize panels"
        >
          <div class="opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical class="w-3 h-3 text-white" />
          </div>
        </div>

        <!-- 3. Interactive JSON Tree Viewer Pane -->
        <div
          v-show="store.viewMode === 'tree' || store.viewMode === 'split'"
          class="h-full flex flex-col overflow-hidden flex-1"
        >
          <JsonViewer />
        </div>
      </template>
    </main>

    <!-- Status Bar (32px) -->
    <AppStatusBar />

    <!-- Modals & Overlays -->
    <CommandPalette />
    <KeyboardShortcuts />
    <JsonErrorDialog />
    <DragOverlay :visible="isDraggingOver" />
    <ToastContainer />
  </div>
</template>
