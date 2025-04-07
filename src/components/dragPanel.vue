<template>
  <!-- 抽屉面板 -->
  <config ref="configPanel" @startDo="startDo"></config>
  <jsonDrawer ref="jsondrawer" @valueRefresh="doParse"></jsonDrawer>
  <!-- 主布局 -->
  <div class="larry">
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
    <div class="group group-form" :style="'width: 100%;'">
      <rightCom ref="rightcom" v-model:value="data.value2"></rightCom>
    </div>
  </div>
</template>
<script setup>
import rightCom from "./rightCom/index.vue"
import { View, Tools, Download, Document, Dish } from "@element-plus/icons-vue"
import { useMainStore } from "@/store"
import { ElMessageBox } from "element-plus"

const store = useMainStore()
let data = reactive({ value2: "" })
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

let rightcom = ref()

const loadConfig = () => {
  // 读取缓存数据初始化到pinia
  let configData = sessionStorage.getItem("design-config")
  console.log(configData, 3423)
  let config = JSON.parse(configData)
  if (configData) {
    store.saveConfig(config)
  }
}

onMounted(() => {
  startDo()

  loadConfig()
})
const axios = inject("axios") // inject axios

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

const doParse = async () => {
  let config = store.config
  console.log(config.renderData, 312312)
  console.log(JSON.parse(config.renderData))
  let query = {
    type: config.engine,
    content: data.value1,
    params: JSON.parse(config.renderData),
  }
  let res = await axios.post(`http://127.0.0.1:8088/render`, query)
  // todo 增加自定义的函数处理返回的信息
  let value = res.data
  if (typeof value === "string") {
    data.value2 = value
  }
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
  /* overflow-y: scroll; */
  overflow-y: hidden;
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
}

.delete-icon {
  position: absolute;
  /* width: 24px; */
  font-size: 22px;
  padding: 10px;
  /* background-color: aliceblue; */
  right: 6px;
  /* right: -39px; */
  top: -16px;
  z-index: 9999;
  border-radius: 50%;
  /* border: 1px solid #ccc; */
  /* border: 1px solid red; */
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
</style>
