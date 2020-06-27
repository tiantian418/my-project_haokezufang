/**
 * 封装吸顶功能
*/

import React from 'react'

class Sticky extends React.Component {
  // 创建ref
  pRef = React.createRef()
  cRef = React.createRef()
  handleScroll = () => {
    // 通过ref获取div  步骤: 创建 元素写上ref={} 使用this.创建ref
    let pDiv = this.pRef.current
    let cDiv = this.cRef.current
    // 获取距离顶部的位置
    let pTop = pDiv.getBoundingClientRect().top
    if (pTop <= 0) {
      cDiv.style.position= 'fixed'
      cDiv.style.top= 0
      cDiv.style.left= 0
      cDiv.style.width= '100%'
      cDiv.style.zIndex= 999
      // placeholder设置高度为40 占住那个位置 防粘纸下面跳上来
      pDiv.style.height= this.props.height + 'px'
    } else {
      // 还原原来的位置 static默认位置
      cDiv.style.position= 'static'
      pDiv.style.height= 0
    }
  }

  componentDidMount() {
    // 监听页面滚动 距离顶部为0 就让content fixed固定定位
    // 监听页面scroll滚动事件
    window.addEventListener('scroll', this.handleScroll)
  }

  // 组件卸载 取消监听滚动 否则一直在
  componentWillUnmount() {
    // 取消监听
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return <div className="sticky">
      {/* 1.加上div 不会影响原来的东西 只需要给content div 定位
          2.placeholder: 专门用来判断是否距离顶部为0
      */}
      <div id="palceholdr" ref={this.pRef}></div>
      <div id="content" ref={this.cRef}>
        {/* 相当于写了Filter */}
        {this.props.children}
      </div>
    </div>
  }
}

export default Sticky