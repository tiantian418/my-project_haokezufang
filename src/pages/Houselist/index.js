import React from 'react'

import Filter from './components/Filter'

import SearchHeader from '../../components/SearchHeder'

import './houselist.scss'

import { getCurrentCity } from '../../utils/index'

import { API } from '../../utils/api'

import { List } from 'react-virtualized'

class Houselist extends React.Component {
  state= {
    cityname: '',
    count: 0, // 总条数
    list: [] // 房子数组
  }

  async componentDidMount () {
    let dingwei = await getCurrentCity()
    this.setState({
      cityname: dingwei.label
    })
  }

  onFilter = (filters) => {
    // console.log('onFilter父接收的条件', filters)
    // 发送请求获取满足条件的房子列表
    // 两个函数 filters 1.传参数 2.写全局变量 3.this.filters
    this.filters = filters
    this.searchHouseList()
  }

  // 发送请求获取满足条件的房子列表
  async searchHouseList() {
    let dingwei = await getCurrentCity()
    let res = await API.get('/houses', {
      params: {
        cityId: dingwei.value,  // 城市id
        ...this.filters, // 条件
        start: 1, // 从1开始
        end: 20 // 取到20 结束
      }
    })
    // console.log('房子数据', res)
    this.setState({
      count: res.data.body.count, // 总条数
      list: res.data.body.list // 房子
    })
  }

  // 每条数据 渲染的函数  里面可以写 html内容
  rowRenderer=({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  })=> {
    return (
      <div key={key} style={style}>
          <h2>哈哈哈哈哈</h2>
      </div>
    )
  }


  render () {
    return <div className="houselist">
      {/* 顶部导航栏 */}
      <div className="header">
        {/* 左箭头 */}
        <i className="iconfont icon-back"></i>
        {/* 传入当前定位城市 */}
        <SearchHeader cityname={ this.state.cityname }></SearchHeader>
      </div>

      {/* Filter: 筛选条件组件 */}
      <Filter onFilter={this.onFilter}></Filter>

      {/* 房子列表 */}
      <List
        width={300}
        height={300}
        rowCount={this.state.count}
        rowHeight={120}
        rowRenderer={this.rowRenderer}
      />
    </div>
  }
}

export default Houselist
