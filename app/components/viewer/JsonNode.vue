<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useToast } from '~/composables/useToast'
import { getJsonType, buildJsonPath } from '~/utils/json'
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-vue-next'
import JsonValue from '~/components/viewer/JsonValue.vue'

const props = withDefaults(
  defineProps<{
    nodeKey: string | number
    value: any
    parentPath: string
    depth?: number
  }>(),
  {
    depth: 0
  }
)

const emit = defineEmits<{
  (e: 'contextmenu', event: MouseEvent, nodeData: {
    key: string | number
    path: string
    value: any
    isContainer: boolean
    isExpanded: boolean
  }): void
}>()

const store = useJsonViewerStore()
const { showToast } = useToast()

const currentPath = computed(() => buildJsonPath(props.parentPath, props.nodeKey))
const valueType = computed(() => getJsonType(props.value))
const isContainer = computed(() => valueType.value === 'object' || valueType.value === 'array')

const isExpanded = computed(() => {
  return isContainer.value && store.isPathExpanded(currentPath.value)
})

const isSelected = computed(() => {
  return store.selectedPath === currentPath.value
})

const childrenKeys = computed(() => {
  if (!isContainer.value || !props.value) return []
  if (Array.isArray(props.value)) {
    return Array.from({ length: props.value.length }, (_, i) => i)
  }
  return Object.keys(props.value)
})

// Large collection slicing: display in chunks of 100
const displayLimit = ref(100)
const visibleChildrenKeys = computed(() => {
  return childrenKeys.value.slice(0, displayLimit.value)
})

const hasMoreChildren = computed(() => {
  return childrenKeys.value.length > displayLimit.value
})

function showMore() {
  displayLimit.value += 100
}

function toggleExpand() {
  if (isContainer.value) {
    store.toggleExpand(currentPath.value)
  }
  store.setSelectedPath(currentPath.value)
}

function onSelectNode() {
  store.setSelectedPath(currentPath.value)
}

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  store.setSelectedPath(currentPath.value)
  emit('contextmenu', e, {
    key: props.nodeKey,
    path: currentPath.value,
    value: props.value,
    isContainer: isContainer.value,
    isExpanded: isExpanded.value
  })
}

// Collapsed preview string
const collapsedPreview = computed(() => {
  if (!isContainer.value) return ''
  if (Array.isArray(props.value)) {
    if (props.value.length === 0) return '[]'
    const previewItems = props.value.slice(0, 3).map((item) => {
      if (typeof item === 'string') return `"${item}"`
      if (typeof item === 'object') return Array.isArray(item) ? '[...]' : '{...}'
      return String(item)
    })
    return `[ ${previewItems.join(', ')}${props.value.length > 3 ? ', ...' : ''} ]`
  } else {
    const keys = Object.keys(props.value)
    if (keys.length === 0) return '{}'
    const previewItems = keys.slice(0, 3).map((k) => {
      const v = props.value[k]
      const formattedV = typeof v === 'string' ? `"${v}"` : typeof v === 'object' ? '{...}' : String(v)
      return `${k}: ${formattedV}`
    })
    return `{ ${previewItems.join(', ')}${keys.length > 3 ? ', ...' : ''} }`
  }
})

const copied = ref(false)
function quickCopy(e: MouseEvent) {
  e.stopPropagation()
  const content = typeof props.value === 'object' ? JSON.stringify(props.value, null, 2) : String(props.value)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(content).then(() => {
      copied.value = true
      showToast(`Copied ${props.nodeKey}`, 'success', 1500)
      setTimeout(() => {
        copied.value = false
      }, 1500)
    })
  }
}
const containerLengthBadge = computed(() => {
  return valueType.value === 'array' ? `[${childrenKeys.value.length}]` : `{${childrenKeys.value.length}}`
})
</script>

<template>
  <div
    class="select-none font-mono text-[13px] leading-relaxed group/item"
    :data-tree-path="currentPath"
  >
    <!-- Node Header Row -->
    <div
      class="flex items-center gap-1.5 py-0.5 px-1.5 rounded transition-colors cursor-pointer group-hover/item:bg-slate-100/80 dark:group-hover/item:bg-[#18222E]/80"
      :class="{
        'bg-sky-100/70 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 border-l-2 border-sky-500': isSelected,
        'border-l-2 border-transparent': !isSelected
      }"
      @click="toggleExpand"
      @contextmenu="onContextMenu"
    >
      <!-- Expand / Collapse chevron for containers -->
      <span
        v-if="isContainer"
        class="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-transform shrink-0"
      >
        <ChevronDown v-if="isExpanded" class="w-3.5 h-3.5" />
        <ChevronRight v-else class="w-3.5 h-3.5" />
      </span>
      <span v-else class="w-4 h-4 shrink-0"></span>

      <!-- Key Name or Array Index -->
      <span
        class="font-semibold select-text"
        :class="typeof nodeKey === 'number'
          ? 'text-slate-500 dark:text-slate-400 font-mono text-xs'
          : 'text-violet-700 dark:text-violet-400'"
      >
        {{ typeof nodeKey === 'number' ? `[${nodeKey}]` : nodeKey }}
      </span>

      <!-- Colon separator -->
      <span class="text-slate-400 dark:text-slate-500 mr-0.5">:</span>

      <!-- Container: Item count badge & collapsed preview -->
      <template v-if="isContainer">
        <!-- Badge for length -->
        <span class="text-[11px] px-1.5 py-0.2 rounded font-sans bg-slate-200/70 dark:bg-[#1E2A38] text-slate-600 dark:text-slate-400">
          {{ containerLengthBadge }}
        </span>

        <!-- Collapsed inline preview -->
        <span
          v-if="!isExpanded"
          class="text-xs text-slate-400 dark:text-slate-500 truncate max-w-sm ml-1 select-text"
        >
          {{ collapsedPreview }}
        </span>
      </template>

      <!-- Primitive Value Component -->
      <template v-else>
        <JsonValue :value="value" />
      </template>

      <!-- Hover Quick Copy Button -->
      <button
        type="button"
        @click="quickCopy"
        class="opacity-0 group-hover/item:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-[#202D3D] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition ml-auto shrink-0"
        title="Copy value"
        aria-label="Copy value"
      >
        <Check v-if="copied" class="w-3 h-3 text-emerald-500" />
        <Copy v-else class="w-3 h-3" />
      </button>
    </div>

    <!-- Recursive Children Container -->
    <div
      v-if="isContainer && isExpanded"
      class="ml-3 pl-2.5 border-l border-slate-200 dark:border-[#26313D] flex flex-col mt-0.5 space-y-0.5"
    >
      <JsonNode
        v-for="k in visibleChildrenKeys"
        :key="k"
        :node-key="k"
        :value="value[k]"
        :parent-path="currentPath"
        :depth="depth + 1"
        @contextmenu="(e, data) => emit('contextmenu', e, data)"
      />

      <!-- Show more button for large objects / arrays -->
      <div v-if="hasMoreChildren" class="py-1 pl-4">
        <button
          type="button"
          @click.stop="showMore"
          class="px-2 py-1 rounded text-xs font-sans text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition border border-sky-200/50 dark:border-sky-800/40"
        >
          Show more (+100 of {{ childrenKeys.length }} items)...
        </button>
      </div>
    </div>
  </div>
</template>
