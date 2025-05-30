import axios, { type AxiosRequestConfig } from 'axios'
import config from '../config'
// import router from "@/router";

// 创建axios的实例
const instance = axios.create({
    baseURL: config.baseURL,
    timeout: 10000
})
// 请求拦截器配置
instance.interceptors.request.use(config => {
    // config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, error => {
    console.log(error)
}
)
// 响应拦截器配置
instance.interceptors.response.use(response => {
    return response.data
}, error => {
    switch (error.response.status) {
        case 401:
            console.log("无权访问")
            // router.push({path: '/login'})
            break
        case 403:
            console.log("token过期啦")
            // router.push({path: '/login'})
            break
        case 404:
            console.log("404啦")
            // router.push({path: '/404'})
            break
        default:
            return Promise.reject(error)
    }
    return Promise.reject(error)
})
export function request(config: AxiosRequestConfig<any>) {

    // 发送真正的网络请求
    return instance(config);
}

export default request
