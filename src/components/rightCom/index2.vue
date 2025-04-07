<!-- CodeMirrorEditor.vue -->
<template>
  <div ref="editorElement" class="codemirror-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import { javascript } from "@codemirror/lang-javascript"

import { EditorView, keymap, lineNumbers } from "@codemirror/view"
import { EditorState, type Extension } from "@codemirror/state"
import { java } from "@codemirror/lang-java"
import { bracketMatching, foldGutter, foldKeymap } from "@codemirror/language"
import { defaultKeymap } from "@codemirror/commands"
// Props 定义
const props = defineProps<{
  value: string
}>()

// Emits 定义
const emit = defineEmits<{
  (e: "update:value", value: string): void
}>()

// DOM 引用
const editorElement = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

// 基础编辑器配置
const cmExtensions: Extension[] = [
  java(), // language: "java" ✅
  lineNumbers(), // selectOnLineNumbers: true ✅
  EditorView.theme({}, { dark: true }), // theme: "vs" ✅
  bracketMatching(), // autoClosingBrackets: true ✅
  keymap.of([...defaultKeymap, ...foldKeymap]),
]

// 初始化编辑器
const initEditor = () => {
  if (!editorElement.value) return

  const state = EditorState.create({
    doc: props.value,
    extensions: cmExtensions,
  })

  editorView = new EditorView({
    state,
    parent: editorElement.value,
  })
}

// 响应外部 value 变化
watch(
  () => props.value,
  (newValue) => {
    if (!editorView) return

    const currentContent = editorView.state.doc.toString()
    if (newValue === currentContent) return

    editorView.dispatch({
      changes: {
        from: 0,
        to: currentContent.length,
        insert: newValue,
      },
    })
  }
)

// 生命周期
onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  editorView?.destroy()
  editorView = null
})
</script>

<style scoped>
.codemirror-container {
  /* border: 1px solid #e0e0e0; */
  border-radius: 4px;
  height: 100%;
  overflow: hidden;
}

/* 覆盖默认样式 */
:deep(.cm-editor) {
  height: 100%;
  font-family: "Fira Code", monospace;
  font-size: 14px;
}

:deep(.cm-gutters) {
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
}
</style>
