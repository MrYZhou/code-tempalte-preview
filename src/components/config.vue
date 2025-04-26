<template>
  <el-drawer v-model="drawer" :direction="direction" style="min-width: 500px">
    <template #header>
      <h4>配置面板</h4>
    </template>
    <template #default>
      <el-form :model="config" label-width="100px" :label-position="'left'">
        <el-row>
          <el-col :span="22">
            <el-form-item label="服务地址">
              <el-input
                v-model="config.apiCustom"
                placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="定时请求">
              <el-switch
                v-model="config.timeOpen"
                active-text="开"
                inactive-text="关" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="间隔" v-if="config.timeOpen">
              <el-input-number
                style="width: 100%"
                :step="1"
                :min="1"
                v-model="config.time"
                placeholder="请输入秒数"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row
        ><el-button @click="addRenderName">添加解析规则</el-button>
      </el-row>
      <el-row
        v-for="(item, index) in config.renderRules"
        :key="item.key"
        :gutter="8"
        style="margin-top: 10px">
        <!-- <el-col :span="2" style="margin:auto">组{{ index + 1 }}</el-col> -->
        <el-col :span="8">
          <el-input
            v-model="item.title"
            placeholder="请输入显示标题"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="item.value"
            placeholder="请输入数据路径"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            @click="removeKey"
            :icon="Delete"
            type="danger"></el-button>
        </el-col>
      </el-row>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ElMessageBox } from "element-plus"
import { useMainStore } from "@/store"
import { Delete } from "@element-plus/icons-vue"

const store = useMainStore()
const drawer = ref(false)
defineExpose({
  drawer,
})
const direction = ref("rtl")

let config = reactive({
  apiCustom: "http://localhost:8000", // 自己预览服务的地址
  timeOpen: false, // 定时请求
  time: 1, // 每多少秒请求一次
  renderRules: [],
})
const addRenderName = () => {
  config.renderRules.push({ title: "", value: "" })
}
const removeKey = (index) => {
  config.renderRules.splice(index, 1)
}

const doSaveConfig = () => {
  // 存pinia
  store.saveConfig(config)
  // 存localStorage
  localStorage.setItem("design-config", JSON.stringify(config))
}
const loadConfig = () => {
  let configData = localStorage.getItem("design-config")
  if (configData) {
    config = reactive({ ...JSON.parse(configData) })
  } else {
    doSaveConfig()
  }
}
onMounted(() => {
  loadConfig()
})
const emit = defineEmits(["startDo"])
function cancelClick() {
  drawer.value = false
}
function confirmClick() {
  emit("startDo")
  doSaveConfig()
  cancelClick()
}
</script>
<style scoped></style>
