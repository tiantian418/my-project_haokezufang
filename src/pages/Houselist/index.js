import React from 'react'

import Filter from './components/Filter'

import SearchHeader from '../../components/SearchHeder'

import './houselist.scss'

import { getCurrentCity } from '../../utils/index'

class Houselist extends React.Component {
  state= {
    cityname: ''
  }

  async componentDidMount () {
    let dingwei = await getCurrentCity()
    this.setState({
      cityname: dingwei.label
    })
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
      <Filter></Filter> 
    </div>
  }
}

export default Houselist
