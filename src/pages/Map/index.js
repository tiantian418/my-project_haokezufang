import React from 'react'

import './map.scss'

const BMap = window.BMap

class Map extends React.Component {
  componentDidMount() {
    // 必须保证有div 必须在componentDidMount里面写
    // 调用 initMap初始化地图
    this.initMap()
  }


  // 初始化地图
  initMap() {
    // 1.初始化地图到container
    var map = new BMap.Map('container')
    // 2.设置中心点坐标
    var point = new BMap.Point(116.404, 39.915) // 经纬度
    // 缩放地图到中心点
    map.centerAndZoom(point, 15)
  }

  render() {
    return (
      <div className="map">
        {/* 用来放地图 */}
        <div id="container"></div>
      </div>
    )
  }
}

export default Map
