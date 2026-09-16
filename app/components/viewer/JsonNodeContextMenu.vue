<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import {
  Copy,
  FolderOpen,
  Folder,
  FileCode,
  Layers
} from 'lucide-vue-next'

const props = defineProps<{
  x: number
  y: number
  nodeKey: string | number
  nodePath: string
  nodeValue: any
  isContainer: boolean
  isExpanded: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'action', actionType: 'copy-value' | 'copy-json' | 'copy-path' | 'copy-key' | 'expand' | 'collapse' | 'expand-children' | 'collapse-children'): void
}>()

function onAction(type: any) {
  emit('action', type)
  emit('close')
}

function handleGlobalClick(e: MouseEvent) {
  emit('close')
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('click', handleGlobalClick)
    window.addEventListener('contextmenu', handleGlobalClick)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('click', handleGlobalClick)
    window.removeEventListener('contextmenu', handleGlobalClick)
  }
})
</script>

<template>
  <div
    class="fixed z-50 min-w-[190px] rounded-lg py-1 shadow-2xl border bg-white dark:bg-[#18222E] border-slate-200 dark:border-[#26313D] text-xs select-none"
    :style="{ top: `${y}px`, left: `${x}px` }"
    @click.stop
    @contextmenu.prevent
  >
    <!-- Header showing node path -->
    <div class="px-3 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-100 dark:border-[#26313D] truncate max-w-[220px]">
      {{ nodePath }}
    </div>

    <!-- Copy options -->
    <button
      type="button"
      @click="onAction('copy-value')"
      class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
    >
      <Copy class="w-3.5 h-3.5 text-slate-400" />
      <span>Copy Value</span>
    </button>

    <button
      type="button"
      @click="onAction('copy-json')"
      class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
    >
      <FileCode class="w-3.5 h-3.5 text-slate-400" />
      <span>Copy JSON</span>
    </button>

    <button
      type="button"
      @click="onAction('copy-path')"
      class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
    >
      <span class="font-mono text-slate-400 text-xs font-bold">$</span>
      <span>Copy Path</span>
    </button>

    <button
      type="button"
      @click="onAction('copy-key')"
      class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
    >
      <span class="font-mono text-slate-400 text-xs font-bold">K</span>
      <span>Copy Key</span>
    </button>

    <!-- Expand / Collapse options for objects & arrays -->
    <template v-if="isContainer">
      <div class="my-1 border-t border-slate-100 dark:border-[#26313D]"></div>

      <button
        v-if="!isExpanded"
        type="button"
        @click="onAction('expand')"
        class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
      >
        <FolderOpen class="w-3.5 h-3.5 text-slate-400" />
        <span>Expand</span>
      </button>

      <button
        v-else
        type="button"
        @click="onAction('collapse')"
        class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
      >
        <Folder class="w-3.5 h-3.5 text-slate-400" />
        <span>Collapse</span>
      </button>

      <button
        type="button"
        @click="onAction('expand-children')"
        class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
      >
        <Layers class="w-3.5 h-3.5 text-slate-400" />
        <span>Expand Children</span>
      </button>

      <button
        type="button"
        @click="onAction('collapse-children')"
        class="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202D3D] transition-colors"
      >
        <Layers class="w-3.5 h-3.5 text-slate-400" />
        <span>Collapse Children</span>
      </button>
    </template>
  </div>
</template>
