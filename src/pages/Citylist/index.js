import React from 'react'

import { NavBar, Icon } from 'antd-mobile'

import './citylist.scss'

class Citylist extends React.Component {
  render () {
    return <div className="citylist">
      <NavBar
        className="navbar"
        mode="light"
        icon={<Icon type="left" style={{ color: '#7b7b7b' }} />}
        onLeftClick={() =>{
          this.props.history.push('/home/index')
        }}
      >城市选择</NavBar>
    </div>
  }
}

export default Citylist
