import React from 'react'

// 导入Route
import { Route } from 'react-router-dom'

// 导入组件,哪用哪导
import { TabBar } from 'antd-mobile'

// 导入样式
import './home.css'

// 导入四个组件
import Index from '../Index'
import Houselist from '../Houselist'
import News from '../News'
import Profile from '../Profile'

class Home extends React.Component {
  state = {
    selectedTab: '/home/index', // 选中的标题
    hidden: false
  }

  render () {
    return (
      <div className="home">
        {/* 挖坑 显示四个子路由 */}
        <Route exact path='/home/index' component={Index}></Route>
        <Route exact path='/home/houselist' component={Houselist}></Route>
        <Route exact path='/home/news' component={News}></Route>
        <Route exact path='/home/profile' component={Profile}></Route>

        {/* 底部tabBar 用固定定位 定位到底部 */}
        <TabBar
          unselectedTintColor="#bbb" // 未选中的字体颜色
          tintColor="#f20" // 选中的字体颜色
          barTintColor="white" // 整个tabBar的背景颜色
          hidden={this.state.hidden} // 是否隐藏tabBar true: 隐藏
          noRenderContent={true} // 不渲染div内容 true: 不渲染
        >
          <TabBar.Item
            title="首页"
            icon={ // 默认图标
              <i className="iconfont icon-ind"></i>
            }
            selectedIcon={ // 选中图标
              <i className="iconfont icon-ind"></i>
            }
            selected={this.state.selectedTab === '/home/index'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/index'
              })
              // 点击底部标题 切换跳转到对应的页面
              this.props.history.push('/home/index')
            }}
            data-seed="logId"
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-findHouse"></i>
            }
            selectedIcon={
              <i className="iconfont icon-findHouse"></i>
            }
            title="找房"
            selected={this.state.selectedTab === '/home/houselist'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/houselist'
              })
              this.props.history.push('/home/houselist')
            }}
            data-seed="logId1"
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-infom"></i>
            }
            selectedIcon={
              <i className="iconfont icon-infom"></i>
            }
            title="资讯"
            selected={this.state.selectedTab === '/home/news'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/news'
              })
              this.props.history.push('/home/news')
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-my"></i>
            }
            selectedIcon={
              <i className="iconfont icon-my"></i>
            }
            title="我的"
            selected={this.state.selectedTab === '/home/profile'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/profile'
              })
              this.props.history.push('/home/profile')
            }}
          >
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}

export default Home
