import React from 'react'

import { Flex } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'

class SearchHeader extends React.Component {
  render () {
    return <Flex className="searchBox">
      {/* 左边选城市 */}
      <Flex className="searchLeft">
        <div
          className="location"
          onClick={ () => {
            // 点击跳转到citylist城市选择页面
            this.props.history.push('/citylist')
          }}
        >
          {/* 获取定位的城市 */}
          <span>{this.props.cityname}</span>
          <i className="iconfont icon-arrow"></i>
        </div>
        {/* 中间输入框 */}
        <div className="searchForm">
          <i className="iconfont icon-search"></i>
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      {/* 右边地图图标 */}
      <i
        className="iconfont icon-map"
        onClick={ () => {
          // 点击跳转到/map地图找房页面
          this.props.history.push('/map')
        }}
      ></i>
    </Flex>
  }
}

// 验证参数类型
SearchHeader.propTypes = {
  cityname: PropTypes.string // 要求是字符串
}

// 设置默认值
SearchHeader.defaultProps = {
  cityname: '默认'
}

// withRouter: 多了一层路由功能 可以正常跳转
export default withRouter(SearchHeader)
