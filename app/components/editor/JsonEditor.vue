<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useJsonViewerStore } from '~/stores/jsonViewer'
import { useTheme } from '~/composables/useTheme'
import EditorToolbar from '~/components/editor/EditorToolbar.vue'

// CodeMirror imports (SSR safe via client checks or dynamic imports)
import { EditorState, Compartment } from '@codemirror/state'
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightActiveLine, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { bracketMatching, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

const store = useJsonViewerStore()
const { isDark } = useTheme()

const editorHost = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

const themeCompartment = new Compartment()
const lineWrapCompartment = new Compartment()
const lineWrap = ref(true)

function toggleLineWrap() {
  lineWrap.value = !lineWrap.value
  if (editorView) {
    editorView.dispatch({
      effects: lineWrapCompartment.reconfigure(lineWrap.value ? EditorView.lineWrapping : [])
    })
  }
}

// Debounce typing to avoid running JSON.parse on every keystroke
let debounceTimer: any = null

function updateStoreFromEditor(newDoc: string) {
  if (newDoc === store.rawJson) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.setRawJson(newDoc)
  }, 120)
}

function initCodeMirror() {
  if (!editorHost.value || !import.meta.client) return
  if (editorView) {
    editorView.destroy()
    editorView = null
  }

  const startState = EditorState.create({
    doc: store.rawJson,
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      bracketMatching(),
      json(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      themeCompartment.of(isDark.value ? oneDark : []),
      lineWrapCompartment.of(lineWrap.value ? EditorView.lineWrapping : []),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          updateStoreFromEditor(update.state.doc.toString())
        }

        // Update cursor line / col in status bar
        const sel = update.state.selection.main
        const line = update.state.doc.lineAt(sel.head)
        const col = sel.head - line.from + 1
        store.editorCursor = { line: line.number, column: col }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '13.5px'
        },
        '.cm-scroller': {
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace"
        }
      })
    ]
  })

  editorView = new EditorView({
    state: startState,
    parent: editorHost.value
  })
}

// Sync external changes (e.g. format, minify, load sample, drag drop) into CodeMirror
watch(
  () => store.rawJson,
  (newVal) => {
    if (!editorView) return
    const currentDoc = editorView.state.doc.toString()
    if (newVal !== currentDoc) {
      editorView.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: newVal }
      })
    }
  }
)

// Sync theme changes into CodeMirror
watch(isDark, (dark) => {
  if (editorView) {
    editorView.dispatch({
      effects: themeCompartment.reconfigure(dark ? oneDark : [])
    })
  }
})

// Jump to error line if requested
watch(
  () => store.editorTargetLine,
  (targetLine) => {
    if (targetLine && editorView) {
      try {
        const doc = editorView.state.doc
        const lineNum = Math.min(Math.max(1, targetLine), doc.lines)
        const line = doc.line(lineNum)
        editorView.dispatch({
          selection: { anchor: line.from },
          scrollIntoView: true
        })
        editorView.focus()
      } catch (e) {
        // ignore out-of-bounds error
      }
      store.editorTargetLine = null
    }
  }
)

onMounted(() => {
  nextTick(() => {
    initCodeMirror()
  })
})

onUnmounted(() => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#111820] overflow-hidden">
    <!-- Editor Header Toolbar -->
    <EditorToolbar
      :line-wrap="lineWrap"
      @toggle-line-wrap="toggleLineWrap"
    />

    <!-- Editor Surface -->
    <div
      ref="editorHost"
      class="flex-1 w-full h-full overflow-hidden relative"
    ></div>
  </div>
</template>
