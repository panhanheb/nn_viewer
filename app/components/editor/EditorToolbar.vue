<script setup lang="ts">
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useToast } from '~/composables/useToast'
import {
  WrapText,
  ClipboardPaste,
  Sparkles,
  FileCode,
  Trash2
} from 'lucide-vue-next'

defineProps<{
  lineWrap: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleLineWrap'): void
}>()

const store = useJsonViewerStore()
const { showToast } = useToast()

async function onPaste() {
  if (!navigator.clipboard?.readText) {
    showToast('Clipboard access not supported', 'error')
    return
  }
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      store.setRawJson(text)
      showToast('Pasted from clipboard', 'success')
    }
  } catch (err) {
    showToast('Permission denied to read clipboard', 'error')
  }
}

function onPrettify() {
  if (store.formatJson()) {
    showToast('Prettified JSON', 'success')
  } else {
    showToast('Syntax error: unable to prettify', 'error')
  }
}
</script>

<template>
  <div
    class="h-9 shrink-0 px-3 border-b flex items-center justify-between text-xs bg-slate-100/70 dark:bg-[#0E141B] border-slate-200 dark:border-[#26313D] select-none"
  >
    <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
      <FileCode class="w-3.5 h-3.5 text-sky-500" />
      <span>JSON Input / Editor</span>
      <span v-if="!store.isValid" class="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 font-semibold">
        Syntax Error
      </span>
    </div>

    <div class="flex items-center gap-1">
      <!-- Line wrap toggle -->
      <button
        type="button"
        @click="emit('toggleLineWrap')"
        class="p-1.5 rounded transition text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#18222E]"
        :class="{ 'text-sky-600 dark:text-sky-400 bg-sky-100/50 dark:bg-sky-950/30': lineWrap }"
        title="Toggle Line Wrap"
      >
        <WrapText class="w-3.5 h-3.5" />
      </button>

      <!-- Paste -->
      <button
        type="button"
        @click="onPaste"
        class="p-1.5 rounded transition text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#18222E]"
        title="Paste from clipboard"
      >
        <ClipboardPaste class="w-3.5 h-3.5" />
      </button>

      <!-- Prettify quick button -->
      <button
        type="button"
        @click="onPrettify"
        class="p-1.5 rounded transition text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#18222E]"
        title="Quick Prettify"
      >
        <Sparkles class="w-3.5 h-3.5" />
      </button>

      <!-- Clear -->
      <button
        type="button"
        @click="store.clearJson"
        class="p-1.5 rounded transition text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-[#18222E]"
        title="Clear editor"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
