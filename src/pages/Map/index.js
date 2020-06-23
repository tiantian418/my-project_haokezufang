import React from 'react'

import './map.scss'

import styles from './map.module.scss'

import NavHeader from '../../components/NavHeader'

import { getCurrentCity } from '../../utils/index'

import { Toast } from 'antd-mobile'

import axios from 'axios'

// 赋值比较简单点
const BMap = window.BMap

class Map extends React.Component {
  state = {
    count: 0, // 小区房子数量
    list: [], // 小区房子列表
    isShow: false // 默认不显示房子列表
  }

  componentDidMount() {
    // 调用 initMap初始化地图
    this.initMap()
  }

  // 初始化地图
  async initMap () {
    // 获取当前定位城市
    let dingwei = await getCurrentCity()

    // 1.初始化地图到container
    this.map = new BMap.Map('container')

    // 绑定地图开始移动的事件movestart 当移动时 隐藏房子列表
    this.map.addEventListener('movestart', () => {
      this.setState({
        isShow: false
      })
    })

    // 设置中心点坐标
    var myGeo = new BMap.Geocoder()

    // 根据城市名得到经纬度点
    myGeo.getPoint (dingwei.label, (point) => {
      if (point) {
        // 缩放地图到中心点
        this.map.centerAndZoom(point, 11) // 数字代表缩放级别 11:市区 13:县镇 15:小区街道

        // 添加地图空间 map.addControl(控件)
        this.map.addControl(new BMap.NavigationControl()) // 缩放控件  
        this.map.addControl(new BMap.ScaleControl()) // 比例尺
        this.map.addControl(new BMap.OverviewMapControl()) // 右下角小地图  
        this.map.addControl(new BMap.MapTypeControl()) // 卫星三维
        // map.addControl(new BMap.CopyrightControl()) // 版权

        // 调用发送请求获取数据 生成很多覆盖物
        this.renderOverlays(dingwei.value, 'cycle')
      }
	  }, dingwei.label)
  }

  // 发送请求获取数据 生成很多覆盖物
  async renderOverlays (id, type) {
    // 发送请求之前 显示loading
    Toast.loading('正在加载...', 0)
    // 发送请求 获取所有区的房子套数
    let res = await axios.get('http://api-haoke-web.itheima.net/area/map?id='+id)
    // console.log('所有区的房子的套数', res)
    // 成功之后 隐藏loading
    Toast.hide()

    // 循环数组 生成12个覆盖物到地图
    res.data.body.forEach(item => {
      let point = new BMap.Point(item.coord.longitude, item.coord.latitude) // 每一个区对应的自己的经纬度
      // 添加一个最简单的文字覆盖物
      var opts = {
        position: point, // 坐标点
        offset: new BMap.Size (-35, -35), // 和点的x,y方向偏移
      }
      // 一个label代表一个覆盖物
      var label = new BMap.Label('', opts) // 创建覆盖物
      // type: 用来判断画圆还是矩形
      if (type === 'cycle') {
        // bubble div: 圆形样式
        label.setContent(
          `<div class="${styles.bubble}">
            <p class="${styles.name}">${item.label}</p>
            <p>${item.count}套</p>
          </div>
          `
        )
      } else if (type === 'rect') {
        // rect div: 矩形样式
        label.setContent(
          `<div class="${styles.rect}">
            <span class="${styles.housename}">${item.label}</span>
            <span class="${styles.housenum}">${item.count}套</span>
            <i class="${styles.arrow}"></i>
          </div>
          `
        )
      }
      
      // label外层大盒子label标签样式
      label.setStyle({
        padding: 0,
        border: 'none'
      })
      // 给label覆盖物添加点击事件
      label.addEventListener('click', (e) => {
        // console.log('点击了覆盖物啊', item.label, item.value)
        // 点击时候的地图级别
        let zoom = this.map.getZoom()
        if (zoom === 11) {
          this.map.centerAndZoom(point, 13)
          setTimeout(() => {
            this.map.clearOverlays()
          }, 10)
          // 发送请求 获取通州的房子套数 循环生成覆盖物 显示在地图
          this.renderOverlays(item.value, 'cycle') // 传入id
        } else if (zoom === 13) {
          this.map.centerAndZoom(point, 15)
          setTimeout(() => {
            this.map.clearOverlays()
          }, 10)
          this.renderOverlays(item.value, 'rect')
        } else if (zoom === 15) {
          // console.log('不放大 请求获取当前小区房子列表显示')

          // 获取点击时的x,y坐标
          let clickX = e.changedTouches[0].clientX
          let clickY = e.changedTouches[0].clientY
          // 获取中心点坐标
          let centerX = window.innerWidth/2
          let centerY = (window.innerHeight - 330)/2
          // 移动的距离 = 点击的坐标 - 中心点坐标
          let distanceX  = clickX - centerX
          let distanceY  = clickY - centerY
          // 移动地图panBy(x距离, y距离)
          this.map.panBy(-distanceX, -distanceY)

          // 获取当前小区房子列表显示
          this.getHouselist(item.value)
        }
      })
      // 添加label覆盖物
      this.map.addOverlay(label)
    })
  }

  // 获取当前小区房子列表显示
  async getHouselist (id) {
    // 发送请求之前 显示loading
    Toast.loading('正在加载...', 0)
    let res = await axios.get('http://api-haoke-web.itheima.net/houses?cityId='+id)
    // console.log('当前房子列表显示', res)
    // 成功之后 隐藏loading
    Toast.hide()
    this.setState({
      count: res.data.body.count,
      list: res.data.body.list,
      isShow: true
    })
  }

  // 渲染房子列表
  renderHouselist () {
    return this.state.list.map(item => {
      return <div key={item.houseCode} className={styles.house}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={`http://api-haoke-web.itheima.net${item.houseImg}`} alt=""/>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {/* ['近地铁', '随时看房'] 生成几个span */}
            {
              item.tags.map((v,i)=>{
                return <span key={i} className={[styles.tag,styles.tag1 ].join(' ')} >{v}</span>
              })
            }
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    })
  }

  render() {
    return (
      <div className="map">
        {/* 顶部导航栏 */}
        <NavHeader>地图找房</NavHeader>

        {/* 用来放地图 */}
        <div id="container"></div>

        {/* 小区房子列表 */}
        <div className={[styles.houseList, this.state.isShow ? styles.show : ''  ].join(' ')}>
          {/* 标题 */}
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">更多房源</a>
          </div>
          {/* 房子列表 */}
          <div className={styles.houseItems}>
            { this.renderHouselist() }
          </div>
        </div>
      </div>
    )
  }
}

export default Map
