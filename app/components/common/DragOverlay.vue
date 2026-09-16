<script setup lang="ts">
import { FileDown } from 'lucide-vue-next'

defineProps<{
  visible: boolean
}>()
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
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/75 dark:bg-black/80 backdrop-blur-sm pointer-events-none"
    >
      <div class="flex flex-col items-center justify-center p-12 max-w-md w-full rounded-2xl border-2 border-dashed border-sky-400 bg-white/95 dark:bg-[#111820]/95 shadow-2xl text-center">
        <div class="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 animate-bounce">
          <FileDown class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Drop JSON File Here</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Supports .json or text documents</p>
      </div>
    </div>
  </transition>
</template>
