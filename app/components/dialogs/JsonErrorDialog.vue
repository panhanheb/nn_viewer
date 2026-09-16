<script setup lang="ts">
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { AlertCircle, X, ArrowRight } from 'lucide-vue-next'

const store = useJsonViewerStore()

function goToLine() {
  if (store.error) {
    store.goToLine(store.error.line)
    store.showErrorDialog = false
  }
}
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
      v-if="store.showErrorDialog && store.error"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
      @click="store.showErrorDialog = false"
    >
      <div
        class="w-full max-w-md rounded-xl bg-white dark:bg-[#111820] border border-rose-200 dark:border-rose-900/50 shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b border-rose-100 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between">
          <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm">
            <AlertCircle class="w-4 h-4" />
            <span>Invalid JSON Syntax</span>
          </div>
          <button
            type="button"
            @click="store.showErrorDialog = false"
            class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#18222E] transition"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4 text-xs">
          <div>
            <span class="text-slate-500 dark:text-slate-400 font-medium">Error Description:</span>
            <p class="mt-1 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-mono border border-rose-200/60 dark:border-rose-900/40">
              {{ store.error.message }}
            </p>
          </div>

          <div class="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-mono">
            <div class="px-3 py-1.5 rounded bg-slate-100 dark:bg-[#18222E] border border-slate-200 dark:border-[#26313D]">
              Line: <strong class="text-rose-500 font-bold">{{ store.error.line }}</strong>
            </div>
            <div class="px-3 py-1.5 rounded bg-slate-100 dark:bg-[#18222E] border border-slate-200 dark:border-[#26313D]">
              Column: <strong class="text-rose-500 font-bold">{{ store.error.column }}</strong>
            </div>
          </div>

          <div v-if="store.error.snippet">
            <span class="text-slate-500 dark:text-slate-400 font-medium">Near code:</span>
            <pre class="mt-1 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto"><code>{{ store.error.snippet }}</code></pre>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 bg-slate-50 dark:bg-[#0E141B] border-t border-slate-200 dark:border-[#26313D] flex items-center justify-between">
          <button
            type="button"
            @click="store.showErrorDialog = false"
            class="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            Dismiss
          </button>
          <button
            type="button"
            @click="goToLine"
            class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition"
          >
            <span>Go to Line {{ store.error.line }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
