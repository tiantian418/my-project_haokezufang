import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import { API } from '../../../../utils/api'

import { getCurrentCity } from '../../../../utils/index'

// 标题高亮的四个状态
const titleStatus = {
  area: false, // 区域
  mode: false, // 方式
  price: false, // 租金
  more: false // 筛选
}

export default class Filter extends Component {
  state = {
    titleStatus: titleStatus,
    openType: '', // 隐藏
    filtersData: {} // 所有条件数据
  }

  componentDidMount () {
    // 获取所有条件数据
    this.getFiltersData()
  }

  // 获取所有条件数据
  async getFiltersData () {
    let dingwei = await getCurrentCity()
    let res = await API.get('/houses/condition?id='+dingwei.value)
    // console.log('所有条件数据', res)
    this.setState({
      filtersData: res.data.body // 所有条件数据
    })
  }

  // 点击标题时执行 (父组件写了一个函数)
  onTitleClick = (type) => {
    // 想高亮谁就把titleStatus对应的状态变成true
    this.setState({
      titleStatus: {
        ...titleStatus, // 原样展开四个false
        [type]: true // 后面的会覆盖前面的
      },
      openType: type
    })
  }

  // 取消的函数
  onCancel = () => {
    // console.log('点击取消')
    // 隐藏组件
    this.setState({
      openType: ''
    })
  }

  // 确定的函数
  onSave = () => {
    // console.log('点击确定')
    // 隐藏组件
    this.setState({
      openType: ''
    }) 
  }

  // 渲染FilterPicker下拉选择
  renderPicker () {
    let { openType } = this.state
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      let { filtersData } = this.state
      let data = [] // 下拉数据
      let cols = 0 // 列数
      // 判断是谁 就传谁的数据
      switch (openType) {
        case 'area':
          data= [filtersData.area, filtersData.subway]
          cols= 3
          break;
        case 'mode':
          data= filtersData.rentType
          cols= 1
          break;
        case 'price':
          data= filtersData.price
          cols= 1
          break;
      }
      // 显示picker同时传入不同的下拉数据和不同的列数
      return <FilterPicker 
        data= { data }
        cols={ cols }
        onCancel={ this.onCancel }
        onSave={ this.onSave }
      />
    } else {
      // 不显示
      return null
    }
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleStatus={this.state.titleStatus}
            onTitleClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          { this.renderPicker() }

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
