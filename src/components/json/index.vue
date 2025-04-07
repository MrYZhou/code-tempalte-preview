<template>
  <div ref="editContainer3" class="code-editor" v-if="show"></div>
</template>
<script setup>
import { getCurrentInstance, onMounted, watch } from "vue"
import * as monaco from "monaco-editor"
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
let monacoEditor = null
const { proxy } = getCurrentInstance()
// 解决vite Monaco提示错误
self.MonacoEnvironment = {
  getWorker() {
    return new JsonWorker()
  },
}
let props = defineProps({
  value: "",
})
let show = ref(true)
const emit = defineEmits(["valueRefresh", "update:value"])
onMounted(() => {
  monacoEditor = monaco.editor.create(proxy.$refs.editContainer3, {
    value: props.value, // 内容
    readOnly: false, // 是否只读
    language: "json", // 显示的语言
    foldingStrategy: "indentation", // 代码可分小段折叠
    automaticLayout: true, // 自适应布局
    theme: "vs", // 白色主题
    overviewRulerBorder: false, // 不要滚动条的边框
    autoClosingBrackets: true,
    selectOnLineNumbers: true,
    renderSideBySide: false,
    minimap: {
      enabled: true, // 导航地图
    },
  })
  // 监听值变化
  monacoEditor.onDidChangeModelContent(() => {
    const currenValue = monacoEditor?.getValue()
    emit("update:value", currenValue)
    emit("valueRefresh", currenValue)
  })
})
const hide = () => {
  show.value = false
}
// 暴露方法给其他组件
defineExpose({
  hide,
})
</script>
<style scoped>
.code-editor {
  width: 100%;
  height: 100%;
}
</style>
