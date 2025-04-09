import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import http from '@/http'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component as any)
}
app.use(ElementPlus)
app.use(createPinia())
app.provide('http', http)
app.provide('axios', app.config.globalProperties.axios)
app.mount('#app')
