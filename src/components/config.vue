<template>
  <el-drawer v-model="drawer" :direction="direction">
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
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="定时请求">
              <el-switch
                v-model="config.timeOpen"
                active-text="开"
                inactive-text="关"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="间隔" v-if="config.timeOpen">
              <el-input-number
                style="width: 100%"
                :step="1"
                :min="1"
                v-model="config.time"
                placeholder="请输入秒数"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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

const store = useMainStore()
const drawer = ref(false)
defineExpose({
  drawer,
})
const direction = ref("rtl")

let config = reactive({
  apiCustom: "http://localhost:8000", // 自己预览服务的地址
  timeOpen: true, // 定时请求
  time: 5, // 每多少秒请求一次
})
const loadConfig = () => {
  let configData = sessionStorage.getItem("design-config")
  if (configData) {
    config = reactive({ ...JSON.parse(configData) })
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
  // 存pinia
  store.saveConfig(config)
  // 存localStorage
  sessionStorage.setItem("design-config", JSON.stringify(config))

  emit("startDo")
  cancelClick()
}
</script>
<style scoped></style>
