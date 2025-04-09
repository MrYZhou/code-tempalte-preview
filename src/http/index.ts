import { request } from './request'
interface ReqParams {
    method: string;
    url: string;
    params?: any;
    data?: any; // 请求数据
}
const http = {
    async get(url: any, params: any) {
        const config: ReqParams = {
            method: 'get',
            url: url
        }
        if (params) config.params = params
        return await request(config)
    },
    async post(url: any, params: any) {
        const config: ReqParams = {
            method: 'post',
            url: url
        }
        if (params) config.data = params
        return await request(config)
    },
    async put(url: any, params: any) {
        const config: ReqParams = {
            method: 'put',
            url: url
        }
        if (params) config.params = params
        return await request(config)
    },
    async delete(url: any, params: any) {
        const config: ReqParams = {
            method: 'post',
            url: url
        }
        if (params) config.params = params
        return await request(config)
    }
}
export default http
