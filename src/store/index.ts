import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        tableInfo: [],
        config: {
            parseType: 1,   // 建议改为驼峰命名 parseType
            renderData: null,  // 添加初始定义避免 undefined
            header: []
        }
    }),
    actions: {
        configData(data: { content: any; header: any[] }) {
            // 使用对象合并保持响应性
            this.config = {
                ...this.config,
                renderData: data.content,
                header: data.header.map((item: { key: any; value: any }) => ({
                    [item.key]: item.value
                })) as any
            }
        },
        saveConfig(config: any) {
            // 使用 Object.assign 保持响应性
            Object.assign(this.config, config)
        }
    }
})
