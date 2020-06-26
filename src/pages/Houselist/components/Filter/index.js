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
    filtersData: {}, // 所有条件数据
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }

  componentDidMount() {
    // 获取所有条件数据
    this.getFiltersData()
  }

  // 获取所有条件数据
  async getFiltersData() {
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
  onSave = (value) => {
    // console.log('点击确定', value)
    let type=this.state.openType
    // 隐藏组件 拿到传来的条件 存起来
    this.setState({
      selectedValues: {
        ...this.state.selectedValues, // 四个条件
        [type]: value // 覆盖
      },
      openType: ''
    }, () => {
      // 每次点击确定 在里面获取四个条件
      let { area, mode, price, more } = this.state.selectedValues
      // 格式成我们要的样式
      let filters = {}
      filters.mode = mode[0] // 数组[0] 要里面的那个true单词
      filters.price = price[0]
      filters.mode = more.join(',') // join数组以 , 分割成字符串
      let areaName = area[0] // area或者subway
      let areaValue = 'null' // 没选
      if (area.length === 3) {
        areaValue = area[2] === 'null' ? area[1] : area[2]
      }
      filters[areaName] = areaValue
      // console.log('格式后的filters四个条件', filters)
      this.props.onFilter(filters)
    })
  }

  // 渲染FilterPicker下拉选择
  renderPicker() {
    let { openType } = this.state
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      let { filtersData } = this.state
      let data = [] // 下拉数据
      let cols = 0 // 列数
      // 从四个条件拿到当前值
      let defaultValues = this.state.selectedValues[openType]
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
      // 显示picker同时传入不同的下拉数据和不同的列数 并且传入默认选中值
      return <FilterPicker 
        data= { data }
        cols={ cols }
        onCancel={ this.onCancel }
        onSave={ this.onSave }
        defaultValues={ defaultValues }
        // 组件更新 全部更新
        key={ openType }
      />
    } else {
      // 不显示
      return null
    }
  }

  // 渲染筛选 FilterMore组件
  renderMore() {
    let { openType, filtersData } = this.state
    if (openType === 'more') {
      // 显示FilterMore 同时传入户型朝向等数据
      let data = {
        roomType: filtersData.roomType,
        oriented: filtersData.oriented,
        floor: filtersData.floor,
        characteristic: filtersData.characteristic
      }
      // 传入默认选中值
      let defaultValues = this.state.selectedValues['more']
      return <FilterMore
        data={data} // 四个数据
        onSave={this.onSave} // 确定函数
        defaultValues={defaultValues}
      />
    } else {
      // 不显示
      return null
    }
  }

  // 渲染遮罩层
  renderMask() {
    let { openType } = this.state
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return <div className={styles.mask} />
    } else {
      return null
    }
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        { this.renderMask() }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleStatus={this.state.titleStatus}
            onTitleClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          { this.renderPicker() }

          {/* 最后一个菜单对应的内容： */}
          { this.renderMore() }
        </div>
      </div>
    )
  }
}
