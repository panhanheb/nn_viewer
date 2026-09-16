<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-12 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
    <transition-group
      enter-active-class="transform ease-out duration-200 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg shadow-xl border text-xs backdrop-blur-md transition-all"
        :class="{
          'bg-slate-900/95 dark:bg-[#18222E]/95 text-slate-100 border-slate-700/60 dark:border-[#26313D]': toast.type === 'info',
          'bg-emerald-950/95 text-emerald-100 border-emerald-700/60 shadow-emerald-950/20': toast.type === 'success',
          'bg-rose-950/95 text-rose-100 border-rose-700/60 shadow-rose-950/20': toast.type === 'error',
          'bg-amber-950/95 text-amber-100 border-amber-700/60 shadow-amber-950/20': toast.type === 'warning'
        }"
      >
        <div class="flex items-center gap-2.5">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-400 shrink-0" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-rose-400 shrink-0" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4 h-4 text-amber-400 shrink-0" />
          <Info v-else class="w-4 h-4 text-sky-400 shrink-0" />
          <span class="font-medium">{{ toast.text }}</span>
        </div>

        <button
          type="button"
          @click="removeToast(toast.id)"
          class="opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded text-current hover:bg-white/10"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </transition-group>
  </div>
</template>
