/**
 * 封装对token的增删改查
 */

//  获取token
let getToken = () => {
  // 返回token
  return localStorage.getItem('my-token')
}

// 设置token
let setToken = (val) => {
  localStorage.setItem('my-token', val)
}

// 删除token
let removeToken = () => {
  localStorage.removeItem('my-token')
}

// 判断是否登录
let isAuth = () => {
  // 登录返回true 未登录返回false
  // if (getToken) {
  //   return true
  // } else {
  //   return false
  // }
  // 简写
  return !!getToken() // !!数据: 转换成布尔值
}

export { getToken, setToken, removeToken, isAuth }