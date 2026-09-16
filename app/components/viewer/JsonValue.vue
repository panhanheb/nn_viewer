<script setup lang="ts">
import { computed } from 'vue'
import { getJsonType } from '~/utils/json'

const props = defineProps<{
  value: any
  searchHighlight?: string
}>()

const valueType = computed(() => getJsonType(props.value))

const formattedValue = computed(() => {
  if (props.value === null) return 'null'
  if (props.value === undefined) return 'undefined'
  if (typeof props.value === 'string') return `"${props.value}"`
  return String(props.value)
})

const isUrl = computed(() => {
  return (
    typeof props.value === 'string' &&
    (props.value.startsWith('http://') || props.value.startsWith('https://'))
  )
})
</script>

<template>
  <span class="inline-flex items-center text-[13px] font-mono select-text">
    <!-- String -->
    <template v-if="valueType === 'string'">
      <a
        v-if="isUrl"
        :href="value"
        target="_blank"
        rel="noopener noreferrer"
        class="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        title="Open link in new tab"
        @click.stop
      >
        "{{ value }}"
      </a>
      <span v-else class="text-emerald-600 dark:text-emerald-400">
        "{{ value }}"
      </span>
    </template>

    <!-- Number -->
    <span
      v-else-if="valueType === 'number'"
      class="text-sky-600 dark:text-sky-400 font-semibold"
    >
      {{ value }}
    </span>

    <!-- Boolean -->
    <span
      v-else-if="valueType === 'boolean'"
      class="text-amber-600 dark:text-amber-400 font-semibold"
    >
      {{ value }}
    </span>

    <!-- Null -->
    <span
      v-else-if="valueType === 'null'"
      class="text-slate-400 dark:text-slate-500 italic"
    >
      null
    </span>

    <!-- Other primitives / fallback -->
    <span v-else class="text-slate-600 dark:text-slate-300">
      {{ formattedValue }}
    </span>
  </span>
</template>
