/**
 * 封装顶部导航栏组件
 */

import React from 'react'

import { NavBar, Icon } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'

class NavHeader extends React.Component {
  render () {
    return <NavBar
      className="navbar"
      mode="light"
      icon={<Icon type="left" style={{ color: '#7b7b7b' }} />}
      onLeftClick={() =>{
        this.props.history.go(-1)
      }}
    >
      { this.props.children }
    </NavBar>
  }
}

// 验证传来的参数类型
NavHeader.propTypes = {
  children: PropTypes.string
}

// 设置默认值
NavHeader.defaultProps = {
  children: '导航默认栏'
}

// withRouter: 高阶组件函数
export default withRouter (NavHeader)