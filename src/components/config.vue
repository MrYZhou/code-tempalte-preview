<template>
  <el-drawer v-model="drawer" :direction="direction">
    <template #header>
      <h4>配置面板</h4>
    </template>
    <template #default>
      <div style="padding-right: 20px">
        <el-form :model="config" label-width="100px" :label-position="'left'">
          <!-- <el-form-item label="版本">
            <el-radio-group v-model="config.vueType" class="ml-4">
              <el-radio label="1" size="large">vue2</el-radio>
              <el-radio label="2" size="large">vue3</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="平台">
            <el-radio-group v-model="config.codeForm" class="ml-4">
              <el-radio label="1" size="large">uniapp</el-radio>
              <el-radio label="2" size="large">web</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="服务地址">
            <el-input
              v-model="config.apiCustom"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="定时请求">
            <el-switch
              v-model="config.timeOpen"
              active-text="开"
              inactive-text="关"
            />
          </el-form-item>

          <el-form-item label="间隔" v-if="config.timeOpen">
            <el-input-number
              style="width: 100%"
              :step="1"
              :min="1"
              v-model="config.time"
              placeholder="请输入秒数"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
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
  api: "http://localhost:8088",
  apiCustom: "http://localhost:8000",
  time: 1,
  templateDir: "",
  hasOne: false,
  timeOpen: false,
  vueType: "1",
  codeForm: "1",
  output: "",
})
const loadConfig = () => {
  let configData = localStorage.getItem("design-config")
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
  localStorage.setItem("design-config", JSON.stringify(config))

  emit("startDo")
  cancelClick()
}
</script>
<style scoped>
.el-select {
  width: 100%;
}
</style>
