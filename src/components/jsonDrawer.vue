<template>
  <el-drawer v-model="drawer" :direction="direction">
    <template #header>
      <h4>请求数据配置</h4>
    </template>
    <template #default>
      <el-form :model="postData" label-width="0">
        <el-button @click="addKey">添加header</el-button>
        <el-form-item
          class="mt10"
          v-if="postData.header && postData.header.length">
          <el-row v-for="item in postData.header" :key="item.key" :gutter="10">
            <el-col :span="6">
              <el-input v-model="item.key" placeholder="请输入key"></el-input>
            </el-col>
            <el-col :span="16">
              <el-input v-model="item.value" placeholder="请输入值"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button
                @click="removeKey"
                :icon="Delete"
                type="danger"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-divider />
        <el-button @click="addBodyKey">添加body</el-button>
        <el-form-item
          class="mt10"
          v-if="postData.content && postData.content.length">
          <el-row v-for="item in postData.content" :key="item.key" :gutter="10">
            <el-col :span="6">
              <el-input v-model="item.key" placeholder="请输入key"></el-input>
            </el-col>
            <el-col :span="16">
              <el-input v-model="item.value" placeholder="请输入值"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button
                @click="removeBodyKey"
                :icon="Delete"
                type="danger"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
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
  content: [{ key: "", value: "" }],
  header: [{ key: "", value: "" }],
})
const addKey = () => {
  postData.header.push({ key: "", value: "" })
}
const addBodyKey = () => {
  postData.content.push({ key: "", value: "" })
}

const removeKey = (index) => {
  postData.header.splice(index, 1)
}
const removeBodyKey = (index) => {
  postData.content.splice(index, 1)
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
  let configData = sessionStorage.getItem("design-config")
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
