/**
 * react配置axios
 */

 import axios from 'axios'

// 第一种写法
// axios.defaults.baseURL = 'http://api-haoke-web.itheima.net'

// 第二种写法
let API = axios.create({
  baseURL: 'http://api-haoke-web.itheima.net'
})

// 导出使用旧可以
export { API }