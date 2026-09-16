<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useToast } from '~/composables/useToast'
import JsonNode from '~/components/viewer/JsonNode.vue'
import JsonValue from '~/components/viewer/JsonValue.vue'
import JsonNodeContextMenu from '~/components/viewer/JsonNodeContextMenu.vue'

const store = useJsonViewerStore()
const { showToast } = useToast()

const contextMenuState = ref<{
  visible: boolean
  x: number
  y: number
  key: string | number
  path: string
  value: any
  isContainer: boolean
  isExpanded: boolean
}>({
  visible: false,
  x: 0,
  y: 0,
  key: '',
  path: '',
  value: null,
  isContainer: false,
  isExpanded: false
})

function onContextMenu(e: MouseEvent, nodeData: any) {
  // Ensure menu stays within viewport
  const x = Math.min(e.clientX, window.innerWidth - 220)
  const y = Math.min(e.clientY, window.innerHeight - 260)

  contextMenuState.value = {
    visible: true,
    x,
    y,
    ...nodeData
  }
}

function handleContextMenuAction(actionType: string) {
  const { key, path, value } = contextMenuState.value

  switch (actionType) {
    case 'copy-value': {
      const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
      navigator.clipboard?.writeText(text).then(() => {
        showToast('Value copied', 'success')
      })
      break
    }
    case 'copy-json': {
      const text = JSON.stringify(value, null, 2)
      navigator.clipboard?.writeText(text).then(() => {
        showToast('JSON copied', 'success')
      })
      break
    }
    case 'copy-path': {
      navigator.clipboard?.writeText(path).then(() => {
        showToast(`Path copied: ${path}`, 'success')
      })
      break
    }
    case 'copy-key': {
      navigator.clipboard?.writeText(String(key)).then(() => {
        showToast(`Key copied: ${key}`, 'success')
      })
      break
    }
    case 'expand': {
      store.setPathExpanded(path, true)
      break
    }
    case 'collapse': {
      store.setPathExpanded(path, false)
      break
    }
    case 'expand-children': {
      expandSubtree(value, path, true)
      showToast('Subtree expanded', 'info')
      break
    }
    case 'collapse-children': {
      expandSubtree(value, path, false)
      showToast('Subtree collapsed', 'info')
      break
    }
  }
}

function expandSubtree(obj: any, currentPath: string, expand: boolean) {
  if (!obj || typeof obj !== 'object') return
  store.setPathExpanded(currentPath, expand)

  if (Array.isArray(obj)) {
    for (let i = 0; i < Math.min(obj.length, 500); i++) {
      expandSubtree(obj[i], `${currentPath}[${i}]`, expand)
    }
  } else {
    for (const k of Object.keys(obj)) {
      const childPath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)
        ? `${currentPath}.${k}`
        : `${currentPath}["${k}"]`
      expandSubtree(obj[k], childPath, expand)
    }
  }
}

const rootKeys = computed(() => {
  if (store.parsedJson === null || store.parsedJson === undefined) return []
  if (Array.isArray(store.parsedJson)) {
    return Array.from({ length: store.parsedJson.length }, (_, i) => i)
  }
  if (typeof store.parsedJson === 'object') {
    return Object.keys(store.parsedJson)
  }
  return ['root']
})
</script>

<template>
  <div class="p-4 min-h-full font-mono select-text relative">
    <!-- Primitive Root Value (if single number or string entered) -->
    <template v-if="typeof store.parsedJson !== 'object' || store.parsedJson === null">
      <div class="py-2 px-3 text-sm">
        <span class="text-slate-400 font-semibold mr-2">root:</span>
        <JsonValue :value="store.parsedJson" />
      </div>
    </template>

    <!-- Standard Object or Array Root -->
    <template v-else>
      <div class="space-y-0.5">
        <JsonNode
          v-for="k in rootKeys"
          :key="k"
          :node-key="k"
          :value="store.parsedJson[k]"
          parent-path="$"
          :depth="0"
          @contextmenu="onContextMenu"
        />
      </div>
    </template>

    <!-- Context Menu Portal -->
    <JsonNodeContextMenu
      v-if="contextMenuState.visible"
      :x="contextMenuState.x"
      :y="contextMenuState.y"
      :node-key="contextMenuState.key"
      :node-path="contextMenuState.path"
      :node-value="contextMenuState.value"
      :is-container="contextMenuState.isContainer"
      :is-expanded="contextMenuState.isExpanded"
      @close="contextMenuState.visible = false"
      @action="handleContextMenuAction"
    />
  </div>
</template>
