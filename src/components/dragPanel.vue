<template>
  <!-- 抽屉面板 -->
  <config ref="configPanel" @startDo="startDo" @doParse="doParse"></config>
  <jsonDrawer ref="jsondrawer" @valueRefresh="doParse"></jsonDrawer>
  <!-- 主布局 -->
  <div class="larry">
    <div
      v-if="state.renderArr && state.renderArr.length > 1"
      class="group left-navigator">
      <el-row class="infinite-list">
        <el-col
          class="title"
          :span="24"
          v-for="(item, index) in state.renderArr"
          :key="index">
          {{ item.title }}
        </el-col>
      </el-row>
    </div>
    <div class="group group-form" :style="'width: 100%;'">
      <monacoEditor v-model:value="state.content"></monacoEditor>
    </div>

    <div class="btn-group">
      <!-- 配置面板 -->
      <div>
        <el-button @click="doConfig" :icon="Tools"></el-button>
      </div>
      <!-- 预览 -->
      <div>
        <el-button @click="doParse" :icon="View"></el-button>
      </div>
      <!-- 配置请求头，请求体的东西 -->
      <div>
        <el-button @click="jsonData" :icon="Dish"></el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import monacoEditor from "./monacoEditor.vue"
import { View, Tools, Download, Document, Dish } from "@element-plus/icons-vue"
import { useMainStore } from "@/store"
import { ElMessageBox } from "element-plus"
import axios from "axios"
const store = useMainStore()
let state = reactive({
  content: 'console.log("Code Preview")', // 默认展示的内容
  config: store.config, // 配置信息
  nowChooseKey: "", // 当前选择看的文件
  renderArr: [], //所有模板数据
})
let timer = ref("")
const startDo = () => {
  let config = store.config
  clearInterval(timer)
  if (config?.timeOpen) {
    timer = setInterval(() => {
      doParse()
    }, 1000 * config.time)
  }
}
onUnmounted(() => {
  clearInterval(timer)
})

const loadConfig = () => {
  // 读取缓存数据初始化到pinia
  let configData = localStorage.getItem("design-config")
  let config = configData ? JSON.parse(configData) : {}
  store.saveConfig(config)
}

onMounted(() => {
  loadConfig()
  startDo()
  doParse()
})
const lar = inject("http")
// 显示控制面板
const configPanel = ref()
const doConfig = () => {
  configPanel.value.drawer = true
}

// 数据填充,这里很坑啊,ref必须先获取才能调
const jsondrawer = ref()
const jsonData = () => {
  jsondrawer.value.drawer = true
}
const render = (res, renderKey) => {
  const func = (res, renderKey) =>
    renderKey.split(".").reduce((obj, key) => obj?.[key], res)
  return func(res, renderKey)
}
const changeShow = () => {}
const doParse = async () => {
  let res = await axios.post(state.config.apiCustom)
  console.log(res, 1112)
  let renderArr = []
  state.config.renderRules.forEach((item) => {
    let renderKey = item.value
    renderArr.push({
      title: item.key,
      content: render(res, renderKey),
    })
  })
  state.renderArr = renderArr
  let value = ""
  if (renderArr.length) {
    // 上次看的界面，要保留，不能变到第一个渲染的代码
    if (state.nowChooseKey) {
      let data = renderArr.filter((item) => item.title == state.nowChooseKey)
      value = data.content
      state.nowChooseKey = data.title
    } else {
      value = renderArr.length ? renderArr[0].content : ""
      state.nowChooseKey = renderArr[0].title
    }
  }
  state.content = value
}
</script>
<style>
.larry {
  background-color: #f1f1f1;
  display: flex;
  justify-content: space-between;
  min-width: 990px;
  height: calc(100vh - 50px);
  overflow-y: hidden;
}

.larry::-webkit-scrollbar {
  display: none;
}

.wrap-form {
  display: inline-block;
}

.btn-group {
  margin: 0 5px;
  padding: 2px;
}

.btn-group div {
  margin-bottom: 5px;
}

.group {
  border: 1px solid #51c4d3;
  padding: 12px 0px;
  background-color: #fff;
  overflow-y: hidden;
  border-radius: 5px;
}

/* .group-form {
}
.group-show {
} */
.group-form::-webkit-scrollbar {
  display: none;
}

.group-show::-webkit-scrollbar {
  display: none;
}

.config-info {
  border: 1px solid red;
  margin: 20px;
  padding: 20px;
  height: 30vh;
  border-radius: 5px;
}

.delete-icon {
  position: absolute;
  /* width: 24px; */
  font-size: 22px;
  padding: 10px;
  right: 6px;
  top: -16px;
  z-index: 9999;
  border-radius: 50%;
}

.delete-icon:hover {
  color: rgb(206, 103, 103);
  background-color: #f1f1f1;
}

.item {
  border: solid 1px #ddd;
  padding: 0px;
  text-align: left;
  background-color: #fff;
  display: flex;
  align-items: center;
  height: 36px;
  /* line-height: 38px; */
  /* user-select: none; */
}

.item-control {
  display: inline-block;
  width: 100px;
  height: 45px;
  line-height: 45px;
  margin: 3px;
  text-align: center;
}

.item > label {
  padding: 6px 10px;
  color: #333;
}

.item > label:hover {
  cursor: move;
}

.item > span {
  padding: 6px 10px;
  color: #666;
}

.ghost {
  border: solid 1px pink !important;
}

.chosenClass {
  opacity: 1;
  border: solid 1px #ccc;
}

.fallbackClass {
  background-color: aquamarine;
}
.left-navigator {
  margin: 0 20px;
  min-width: 150px;
  text-align: center;
  padding: unset;
  font-size: 18px;
  .title {
    padding: 10px;
  }
  .title:hover {
    cursor: pointer;
    background-color: #51c4d3;
  }
}

.left-navigator::-webkit-scrollbar {
  display: none;
}
</style>
