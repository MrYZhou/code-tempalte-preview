import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { compression } from 'vite-plugin-compression2'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? './' : './',
    //启动服务配置
    server: {
        host: '127.0.0.1',
        port: 5173,
        open: false,
        cors: true,
        hmr: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8088/',  //你要跨域访问的网址
                changeOrigin: true,   // 允许跨域
                rewrite: (path) => path.replace(/^\/api/, '') // 重写路径把路径变成空字符
            }
        }
    },
    build: {
        outDir: './dist',
    },
    plugins: [
        vue(),
        // ...
        // gzip压缩 生产环境生成 .gz 文件
        compression({
            //压缩算法，默认gzip
            algorithm: 'gzip',
            //匹配文件
            include: [/.(js)$/, /.(css)$/,],
            //压缩超过此大小的文件,以字节为单位
            threshold: 10240,
            //删除原始文件
            deleteOriginalAssets: false
        }),
        AutoImport({
            dts: './src/auto-imports.d.ts',
            imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
            resolvers: [ElementPlusResolver()],
            eslintrc: {
                enabled: true, // Default `false`
                filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
        }),
        Components({
            dts: './src/components.d.ts',
            // imports 指定组件所在位置，默认为 src/components
            dirs: ['src/components/'],
            resolvers: [ElementPlusResolver()],
        }),
    ],
    // 配置路径别名
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    }
})
