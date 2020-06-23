/**
 * 封装公共函数
 */

 import axios from 'axios'

// 导出封装函数 获取定位城市
export let getCurrentCity = () => {
  let city = JSON.parse(localStorage.getItem('my-city'))
  if (!city) {
    // 没有取到city 就去百度定位
    // 百度定位是异步的 需要时间 此时需要配Promise
    return new Promise ((resolve, reject) => {
      // 1.根据IP获取当前定位城市
      var myCity = new window.BMap.LocalCity()
      // async要写在离await最近的那个函数
      myCity.get(async (result) => {
        var cityName = result.name

        // 2.发送请求 获取城市名字+城市id
        let dingwei = await axios.get('http://api-haoke-web.itheima.net/area/info?name='+cityName)
        // console.log('定位城市数据', dingwei.data.body)

        // 3.百度定位后,存在本地 localStrong.setItem('名字', 字符串值)
        let str = JSON.stringify(dingwei.data.body) // 把对象转成字符串
        localStorage.setItem('my-city', str) // my-city: 存取的名字
        // resolve: 成功返回的值
        resolve(dingwei.data.body)
      })
    })
  } else {
    // 取到city 直接用
    // return new Promise ((resolve, reject) => {
    //   resolve(city)
    // })

    // 简写
    return Promise.resolve(city)
  }
}

// export default 一般导出一个
// export  一般导出多个
