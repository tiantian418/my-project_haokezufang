import React from 'react'

import { Carousel, Flex } from 'antd-mobile'

// 导入axios
import axios from 'axios'

// 导入图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

// 导入样式
import './index.css'

// 找房子
const navs = [
  {
    id: 0,
    img: nav1,
    title: '整租',
    path: '/home/houselist'
  },
  {
    id: 1,
    img: nav2,
    title: '合租',
    path: '/home/houselist'
  },
  {
    id: 2,
    img: nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 3,
    img: nav4,
    title: '去出租',
    path: '/rent/add'
  }
]

class Index extends React.Component {
  state = {
    data: [], // 轮播图数据
    imgHeight: 176,
    isplay:false // 是否自动轮播
  }

  // 页面初次渲染
  componentDidMount () {
    // 当页面打开 发送请求 获取轮播图 渲染数据
    this.getSwiperdata()
  }

  // 发送请求 获取轮播图
  async getSwiperdata () {
    let res = await axios.get("http://api-haoke-dev.itheima.net/home/swiper")
    // console.log(res)
    // 赋值轮播图数组
    if (res.data.status !== 200) {
      // 请求失败
      return
    }

    this.setState({
      data: res.data.body
    }, () => {
      this.setState({
        // 确认赋值之后,让轮播图自动轮播
        isplay: true
      })
    })
  }

  // 循环渲染轮播图图片
  renderSwiper () {
    return this.state.data.map(item => (
      <a
        key={item.id}
        href="http://www.itcast.cn"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://api-haoke-dev.itheima.net${item.imgSrc}`}
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            window.dispatchEvent(new Event('resize'))
            this.setState({ imgHeight: 'auto' })
          }}
        />
      </a>
    ))
  }

  // 循环渲染找房子
  renderNavs () {
    return navs.map (item => {
      return <Flex.Item
        key={item.id}
        onClick={() => {
          this.props.history.push(item.path)
        }}
      >
        <img src={item.img}></img>
      <p>{item.title}</p>
      </Flex.Item>
    })
  }
  
  render () {
    return <div className="index">
        <Carousel
          autoplay={this.state.isplay} // 自动轮播
          infinite // 无限循环轮播
        >
          {/* 循环data数据 生成三张图片 */}
          { this.renderSwiper() }
        </Carousel>

        {/* 租房子 */}
        {/* react里面不能直接使用本地图片 需要先导入 */}
        <Flex className="navs">
          { this.renderNavs() }
      </Flex>
    </div>
  }
}

export default Index
