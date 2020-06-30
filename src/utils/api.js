/**
 * react配置axios
 */

import axios from 'axios'

import { baseURL } from './baseURL'

import { getToken, removeToken } from '../utils/token'

// 第一种写法
// axios.defaults.baseURL = 'http://api-haoke-web.itheima.net'

// 第二种写法
const API = axios.create({
  // baseURL: 'http://api-haoke-web.itheima.net'
  baseURL
})

// 配置请求拦截器
API.interceptors.request.use(function (config) {
  // 发送请求 一定会先拦截 执行这里的代码
  // console.log('请求拦截器', config)

  // 判断请求url路径
  if (
    config.url.startsWith('/user')
    && config.url !== 'user/registered'
    && config.url !== '/user/login'
  ) {
    config.headers.authorization = getToken()
  }

  // 要求返回config
  return config
})

// 配置响应拦截器
API.interceptors.response.use(function (response) {
  // 一般做请求错误状态码的判断
  // console.log('响应拦截器', response)

  if (response.data.status === 400) {
    console.log('token有问题')
    // 删除token
    removeToken()
  } else if (response.data.status === 500) {
    console.log('服务器有问题~~联系客服哦')
  } else if (response.data.status === 404) {
    console.log('找不到这个接口哦')
  }

  // 返回response
  return response
})

// 导出使用就可以
export { API }