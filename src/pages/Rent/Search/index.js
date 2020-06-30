import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { API } from '../../../utils/api'

import { getCurrentCity } from '../../../utils/index'

import styles from './index.module.css'

export default class Search extends Component {
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  getSearchList = async (val) => {
    this.setState({
      searchTxt: val
    })

    // 获取输入的关键字
    console.log('关键字', val)

    if (!val) {
      return this.setState({
        tipsList: []
      })
    }

    let dingwei = await getCurrentCity()

    clearTimeout(this.timerId)
    this.timerId = setTimeout(async () => {
      // 获取小区列表
      let res = await API.get('/area/community', {
        params: {
          name: val, // 输入的关键字
          id: dingwei.value // 城市id
        }
      })
      // console.log('小区列表数据', res)

      this.setState({
        tipsList: res.data.body // 小区数组
      })
    }, 500)
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址" // 占位
          value={searchTxt} // 搜索框值
          showCancelButton={true} // 显示取消
          onCancel={() => history.replace('/rent/add')}
          onChange={this.getSearchList}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
