<template>
  <el-drawer v-model="drawer" :direction="direction" size="48%">
    <template #header>
      <h4>请求数据配置</h4>
    </template>
    <template #default>
      <el-form :model="postData" label-width="64px" :label-position="'left'">
        <el-button @click="addKey">添加</el-button>
        <el-form-item label="header" class="mt10">
          <el-row v-for="item in postData.header" :key="item.key" :gutter="10">
            <el-col :span="6">
              <el-input v-model="item.key" placeholder="请输入key"></el-input>
            </el-col>
            <el-col :span="14">
              <el-input v-model="item.value" placeholder="请输入值"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="removeKey" :icon="Delete"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <json
          style="width: 100%; height: 100vh"
          v-model:value="postData.content"
        ></json>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue"
import { ElMessageBox } from "element-plus"
import { useMainStore } from "@/store"
import { Delete } from "@element-plus/icons-vue"

const store = useMainStore()
let postData = reactive({
  content: "",
  header: [{ key: "", value: "" }],
})
const addKey = () => {
  postData.header.push({ key: "", value: "" })
}
const removeKey = (index) => {
  postData.header.splice(index, 1)
}
const drawer = ref(false)
const direction = ref("ltr")
defineExpose({
  drawer,
})

function cancelClick() {
  drawer.value = false
}

const loadConfig = () => {
  let configData = localStorage.getItem("design-config")
  if (configData) {
    let data = JSON.parse(configData)
    postData = reactive({
      content: data.content,
      header: data.header ?? [],
    })
  }
}
onMounted(() => {
  loadConfig()
  addKey()
})
const emit = defineEmits(["valueRefresh"])

function confirmClick() {
  store.configData(postData)
  emit("valueRefresh", "")
  drawer.value = false
}
</script>
<style scope>
.el-textarea__inner {
  height: calc(100vh - 150px);
}

.el-drawer__header {
  margin-bottom: 0;
}

.el-drawer__body {
  overflow: hidden;
  /* width: 0; */
  padding-right: 0;
}
</style>
