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

// 数据不会改变 所以写在外边
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home/index'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/houselist'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

class Home extends React.Component {
  state = {
    selectedTab: '/home/index', // 选中的标题
    hidden: false
  }

  renderTabbarItem () {
    return tabItems.map ((item, index) => {
      return <TabBar.Item
        title={item.title}
        key={index}
        icon={ // 默认图标
          <i className={`iconfont ${item.icon}`}></i>
        }
        selectedIcon={ // 选中图标
          <i className={`iconfont ${item.icon}`}></i>
        }
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path
          })
          // 点击底部标题 切换跳转到对应的页面
          this.props.history.push(item.path)
        }}
        data-seed="logId"
      >
      </TabBar.Item>
    })
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
          {/* 调用renderTabbarItem函数 */}
          { this.renderTabbarItem() }
        </TabBar>
      </div>
    )
  }
}

export default Home
